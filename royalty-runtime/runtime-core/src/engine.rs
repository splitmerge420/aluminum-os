use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use rayon::{ThreadPool, ThreadPoolBuilder};
use serde::{Deserialize, Serialize};
use crate::tracer::CanonicalLineage;

/// Claims embedded in a signed execution lease.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LeaseClaims {
    pub sub: String,
    pub lineage_hash: String,
    pub capabilities: Vec<String>,
    pub exp: usize,
}

/// The Royalty Engine — lease-aware execution runtime.
///
/// Without lease: single-threaded, functional but limited.
/// With valid lease: full multi-threaded concurrency.
///
/// "We don't threaten them with lawyers. We threaten them with latency."
pub struct RoyaltyEngine {
    pub is_enterprise: bool,
    pub thread_pool_size: usize,
    pool: ThreadPool,
}

impl RoyaltyEngine {
    /// Unlock the engine with an optional signed lease.
    ///
    /// Verification: signature -> expiration -> hash binding (THE CHOKE POINT)
    pub fn unlock(signed_lease: Option<&str>, local_lineage: &CanonicalLineage) -> Self {
        let fallback = Self::free_tier();

        let token = match signed_lease {
            Some(t) if !t.is_empty() => t,
            _ => return fallback,
        };

        let mut validation = Validation::new(Algorithm::HS256);
        validation.leeway = 0;

        let key = DecodingKey::from_secret(b"royalty-runtime-dev-secret");

        match decode::<LeaseClaims>(token, &key, &validation) {
            Ok(token_data) => {
                let actual_hash = local_lineage.generate_hash();

                if token_data.claims.lineage_hash != actual_hash {
                    eprintln!(
                        "[ROYALTY] Security Alert: Lease hash mismatch. Expected: {}..., Got: {}...",
                        &token_data.claims.lineage_hash[..8],
                        &actual_hash[..8]
                    );
                    return fallback;
                }

                let thread_count = num_cpus_or_default();
                eprintln!(
                    "[ROYALTY] Commercial lease verified for tenant '{}'. Unlocking {} threads.",
                    token_data.claims.sub, thread_count
                );

                RoyaltyEngine {
                    is_enterprise: true,
                    thread_pool_size: thread_count,
                    pool: ThreadPoolBuilder::new()
                        .num_threads(thread_count)
                        .build()
                        .unwrap_or_else(|_| ThreadPoolBuilder::new().num_threads(1).build().unwrap()),
                }
            }
            Err(e) => {
                eprintln!("[ROYALTY] Lease validation failed: {}. Free tier enabled.", e);
                fallback
            }
        }
    }

    fn free_tier() -> Self {
        eprintln!("[ROYALTY] Free tier mode. Single-threaded execution.");
        RoyaltyEngine {
            is_enterprise: false,
            thread_pool_size: 1,
            pool: ThreadPoolBuilder::new().num_threads(1).build().unwrap(),
        }
    }

    pub fn execute_workload<F, R>(&self, workload: F) -> R
    where
        F: FnOnce() -> R + Send,
        R: Send,
    {
        self.pool.install(workload)
    }
}

fn num_cpus_or_default() -> usize {
    std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(4)
}