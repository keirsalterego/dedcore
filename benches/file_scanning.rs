use criterion::{criterion_group, criterion_main, Criterion};
use std::path::Path;
use tempfile::tempdir;
use std::fs::{self, File};
use std::io::Write;
use std::time::Duration;

fn create_test_directory(depth: usize, files_per_dir: usize, file_size: usize) -> tempfile::TempDir {
    let dir = tempdir().unwrap();
    let root = dir.path();
    
    // Create a simple directory structure
    let mut dirs = vec![root.to_path_buf()];
    
    // Create directories
    for d in 0..depth {
        let new_dirs = dirs.clone();
        dirs.clear();
        
        for dir in new_dirs {
            for i in 0..files_per_dir {
                let subdir = dir.join(format!("dir_{}_{}", d, i));
                fs::create_dir(&subdir).unwrap();
                dirs.push(subdir);
            }
        }
    }
    
    // Create files in each directory
    let data = vec![0u8; file_size];
    for (i, dir) in dirs.iter().enumerate() {
        for file_num in 0..files_per_dir {
            let file_path = dir.join(format!("file_{}_{}.dat", i, file_num));
            let mut file = File::create(file_path).unwrap();
            file.write_all(&data).unwrap();
        }
    }
    
    dir
}

fn bench_scan_directory(c: &mut Criterion) {
    let mut group = c.benchmark_group("File Scanning Benchmarks");
    group.measurement_time(Duration::from_secs(10));
    group.sample_size(10);
    
    // Test with different directory structures
    let test_cases = [
        ("shallow", 1, 10, 1024),   // 1 level, 10 files/dir, 1KB files
        ("medium", 2, 5, 1024),     // 2 levels, 5 files/dir, 1KB files
        ("deep", 3, 3, 1024),       // 3 levels, 3 files/dir, 1KB files
    ];
    
    for (name, depth, files_per_dir, file_size) in test_cases.iter() {
        let dir = create_test_directory(*depth, *files_per_dir, *file_size);
        
        group.bench_function(
            &format!("scan_directory - {} (depth: {}, files/dir: {}, size: {}B)", 
                    name, depth, files_per_dir, file_size),
            |b| {
                b.iter(|| {
                    let _files: Vec<_> = walkdir::WalkDir::new(dir.path())
                        .into_iter()
                        .filter_map(Result::ok)
                        .filter(|e| e.file_type().is_file())
                        .collect();
                })
            },
        );
        
        dir.close().unwrap();
    }
    
    group.finish();
}

criterion_group!(benches, bench_scan_directory);
criterion_main!(benches);
