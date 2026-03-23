use axum::{Json, http::StatusCode};
use jsonwebtoken::{encode, Header, EncodingKey, Algorithm};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Deserialize)]
pub struct LeaseRequest {
    pub tenant_id: String,
    pub lineage_hash: String,
    pub requested_capabilities: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct LeaseClaims {
    pub sub: String,
    pub lineage_hash: String,
    pub capabilities: Vec<String>,
    pub exp: usize,
    pub iat: usize,
}

/// POST /v1/leases — issues time-bounded, lineage-bound execution leases
pub async fn issue_lease(
    Json(payload): Json<LeaseRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as usize;

    let ttl_seconds = 15 * 60; // 15 minutes

    let claims = LeaseClaims {
        sub: payload.tenant_id,
        lineage_hash: payload.lineage_hash,
        capabilities: payload.requested_capabilities,
        exp: now + ttl_seconds,
        iat: now,
    };

    // In production, use RSA private key from secure storage
    let token = encode(
        &Header::new(Algorithm::HS256),
        &claims,
        &EncodingKey::from_secret(b"royalty-runtime-dev-secret"),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(serde_json::json!({
        "signed_lease": token,
        "expires_in": ttl_seconds,
        "capabilities": claims.capabilities,
    })))
}