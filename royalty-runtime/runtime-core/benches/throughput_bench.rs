use criterion::{criterion_group, criterion_main, Criterion};
use rayon::prelude::*;
use rayon::ThreadPoolBuilder;

fn heavy_workload_parallel(threads: usize) {
    let pool = ThreadPoolBuilder::new()
        .num_threads(threads)
        .build()
        .unwrap();

    pool.install(|| {
        (0..100_000u64).into_par_iter().for_each(|i| {
            let _ = (i as f64).sqrt() * (i as f64).sin();
        });
    });
}

fn heavy_workload_single() {
    for i in 0..100_000u64 {
        let _ = (i as f64).sqrt() * (i as f64).sin();
    }
}

fn benchmark_free_vs_leased(c: &mut Criterion) {
    let mut group = c.benchmark_group("royalty_throughput");

    group.bench_function("free_tier_single_thread", |b| {
        b.iter(|| heavy_workload_single())
    });

    group.bench_function("leased_tier_multi_thread", |b| {
        b.iter(|| heavy_workload_parallel(0))
    });

    group.finish();
}

criterion_group!(benches, benchmark_free_vs_leased);
criterion_main!(benches);