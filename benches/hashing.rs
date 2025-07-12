use criterion::{criterion_group, criterion_main, Criterion};
use rand::RngCore;
use std::time::Duration;

// Import from the local crate
use dedcore::hashing::{hash_bytes, HashKind};

fn generate_random_data(size: usize) -> Vec<u8> {
    let mut data = vec![0u8; size];
    let mut rng = rand::thread_rng();
    rng.fill_bytes(&mut data);
    data
}

fn bench_hashing(c: &mut Criterion) {
    let mut group = c.benchmark_group("Hashing Benchmarks");
    group.measurement_time(Duration::from_secs(10));
    group.sample_size(20);
    
    // Test different data sizes: 1KB, 1MB, 10MB
    for size in [1024, 1024 * 1024, 10 * 1024 * 1024].iter() {
        let data = generate_random_data(*size);
        
        // Test different hash algorithms
        for hash_kind in [
            HashKind::Sha256,
            HashKind::Blake3,
            HashKind::XxHash3,
        ] {
            let id = format!("{} - {}B", hash_kind, size);
            group.bench_function(&id, |b| {
                b.iter(|| {
                    let _ = hash_bytes(&data, hash_kind.clone());
                })
            });
        }
    }
    
    group.finish();
}

criterion_group!(benches, bench_hashing);
criterion_main!(benches);
