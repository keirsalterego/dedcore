use std::fs::File;
use std::io::{self, Read, BufReader};
use sha2::{Sha256, Digest as ShaDigest};
use blake3;
use xxhash_rust::xxh3::Xxh3;
use rayon::prelude::*;
use memmap2::Mmap;

use std::fmt;

#[derive(Clone, Debug)]
pub enum HashKind {
    Sha256,
    Blake3,
    XxHash3,
}

impl fmt::Display for HashKind {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            HashKind::Sha256 => write!(f, "SHA-256"),
            HashKind::Blake3 => write!(f, "BLAKE3"),
            HashKind::XxHash3 => write!(f, "XXH3"),
        }
    }
}

#[derive(Clone, Debug)]
pub enum Security {
    Low,
    Medium,
    High,
    Maximum,
}

#[derive(Clone, Debug)]
pub enum Speed {
    Fastest,
    Balanced,
    MostSecure,
}

#[derive(Clone, Debug)]
pub struct HashConfig {
    pub security: Security,
    pub speed: Speed,
}

impl HashConfig {
    pub fn new(security: Security, speed: Speed) -> Self {
        Self { security, speed }
    }
    pub fn choose_algorithm(&self, ext: &str) -> HashKind {
        match (ext.to_lowercase().as_str(), &self.security, &self.speed) {
            ("txt" | "md" | "rs" | "py", Security::High | Security::Maximum, _) => HashKind::Sha256,
            ("zip" | "tar" | "gz", _, Speed::Balanced) => HashKind::Blake3,
            ("jpg" | "jpeg" | "png" | "mp4" | "mp3", _, Speed::Fastest) => HashKind::XxHash3,
            (_, Security::Maximum, _) => HashKind::Sha256,
            (_, Security::High, _) => HashKind::Sha256,
            (_, _, Speed::Fastest) => HashKind::XxHash3,
            _ => HashKind::Sha256,
        }
    }
}

// 8KB buffer. Why? Because it feels right.

/// Compute hash of a byte slice using the specified algorithm
pub fn hash_bytes(data: &[u8], algo: HashKind) -> Vec<u8> {
    match algo {
        HashKind::Sha256 => {
            let mut hasher = Sha256::new();
            hasher.update(data);
            hasher.finalize().to_vec()
        },
        HashKind::Blake3 => {
            let mut hasher = blake3::Hasher::new();
            hasher.update(data);
            hasher.finalize().as_bytes().to_vec()
        },
        HashKind::XxHash3 => {
            let mut hasher = Xxh3::new();
            hasher.update(data);
            let result = hasher.digest().to_le_bytes().to_vec();
            result
        },
    }
}

pub fn hash_file(path: &str, algo: HashKind) -> io::Result<Vec<u8>> {
    let file = File::open(path)?;
    let metadata = file.metadata()?;
    let use_mmap = metadata.len() > 10 * 1024 * 1024;
    if use_mmap {
        if let Ok(mmap) = unsafe { Mmap::map(&file) } {
            match algo {
                HashKind::Sha256 => {
                    let mut hasher = Sha256::new();
                    hasher.update(&mmap);
                    return Ok(hasher.finalize().to_vec());
                },
                HashKind::Blake3 => {
                    let mut hasher = blake3::Hasher::new();
                    hasher.update(&mmap);
                    return Ok(hasher.finalize().as_bytes().to_vec());
                },
                HashKind::XxHash3 => {
                    let mut hasher = Xxh3::new();
                    hasher.update(&mmap);
                    return Ok(hasher.digest().to_le_bytes().to_vec());
                },
            }
        }
    }
    let mut reader = BufReader::new(file);
    match algo {
        HashKind::Sha256 => {
            let mut hasher = Sha256::new();
            let mut buffer = [0u8; 8192];
            loop {
                let n = reader.read(&mut buffer)?;
                if n == 0 { break; }
                hasher.update(&buffer[..n]);
            }
            Ok(hasher.finalize().to_vec())
        },
        HashKind::Blake3 => {
            let mut hasher = blake3::Hasher::new();
            let mut buffer = [0u8; 8192];
            loop {
                let n = reader.read(&mut buffer)?;
                if n == 0 { break; }
                hasher.update(&buffer[..n]);
            }
            Ok(hasher.finalize().as_bytes().to_vec())
        },
        HashKind::XxHash3 => {
            let mut hasher = Xxh3::new();
            let mut buffer = [0u8; 8192];
            loop {
                let n = reader.read(&mut buffer)?;
                if n == 0 { break; }
                hasher.update(&buffer[..n]);
            }
            Ok(hasher.digest().to_le_bytes().to_vec())
        },
    }
}

#[allow(dead_code)]
pub fn hash_files_parallel(paths: &[&str], algo: HashKind) -> Vec<(String, Vec<u8>)> {
    paths.par_iter()
        .map(|path| {
            let hash = hash_file(path, algo.clone()).unwrap_or_default();
            (path.to_string(), hash)
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use hex;
    use tempfile::NamedTempFile;    

    #[test]
    fn test_hash_file_enum_dispatch() {
        let mut file = NamedTempFile::new().unwrap();
        write!(file, "hello world").unwrap();
        let path = file.path().to_str().unwrap();

        let sha256 = hash_file(path, HashKind::Sha256).unwrap();
        let blake3 = hash_file(path, HashKind::Blake3).unwrap();
        let xxhash3 = hash_file(path, HashKind::XxHash3).unwrap();

        let expected_sha256 = vec![
            0xb9, 0x4d, 0x27, 0xb9, 0x93, 0x4d, 0x3e, 0x08,
            0xa5, 0x2e, 0x52, 0xd7, 0xda, 0x7d, 0xab, 0xfa,
            0xc4, 0x84, 0xef, 0xe3, 0x7a, 0x53, 0x80, 0xee,
            0x90, 0x88, 0xf7, 0xac, 0xe2, 0xef, 0xcd, 0xe9
        ];
        let expected_blake3 = hex::decode("d74981efa70a0c880b8d8c1985d075dbcbf679b99a5f9914e5aaf96b831a9e24").unwrap();
        let expected_xxhash3 = vec![0x8b, 0x98, 0xe6, 0x40, 0xea, 0xb1, 0x47, 0xd4];

        assert_eq!(sha256, expected_sha256);
        assert_eq!(blake3, expected_blake3);
        assert_eq!(xxhash3, expected_xxhash3);
    }

    #[test]
    fn test_hash_files_parallel() {
        let mut file1 = NamedTempFile::new().unwrap();
        let mut file2 = NamedTempFile::new().unwrap();
        write!(file1, "hello world").unwrap();
        write!(file2, "rustacean").unwrap();
        let paths = [file1.path().to_str().unwrap(), file2.path().to_str().unwrap()];
        let results = hash_files_parallel(&paths, HashKind::Sha256);
        let expected1 = vec![
            0xb9, 0x4d, 0x27, 0xb9, 0x93, 0x4d, 0x3e, 0x08,
            0xa5, 0x2e, 0x52, 0xd7, 0xda, 0x7d, 0xab, 0xfa,
            0xc4, 0x84, 0xef, 0xe3, 0x7a, 0x53, 0x80, 0xee,
            0x90, 0x88, 0xf7, 0xac, 0xe2, 0xef, 0xcd, 0xe9
        ];
        let expected2 = vec![
            0x6e, 0x7e, 0x0e, 0x6e, 0x7e, 0x0e, 0x6e, 0x7e,
            0x0e, 0x6e, 0x7e, 0x0e, 0x6e, 0x7e, 0x0e, 0x6e,
            0x7e, 0x0e, 0x6e, 0x7e, 0x0e, 0x6e, 0x7e, 0x0e,
            0x6e, 0x7e, 0x0e, 0x6e, 0x7e, 0x0e, 0x6e, 0x7e
        ]; // Placeholder, will update below
        assert_eq!(results[0].1, expected1);
        // Compute expected2 using hash_file_sha256 for "rustacean"
            }
}
