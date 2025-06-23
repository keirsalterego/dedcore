use std::path::Path;
use anyhow::Result;

/// Compute the Levenshtein distance between two strings.
pub fn levenshtein(a: &str, b: &str) -> usize {
    let mut costs = vec![0; b.len() + 1];
    for j in 0..=b.len() {
        costs[j] = j;
    }
    for (i, ca) in a.chars().enumerate() {
        let mut last = i;
        costs[0] = i + 1;
        for (j, cb) in b.chars().enumerate() {
            let old = costs[j + 1];
            costs[j + 1] = if ca == cb {
                last
            } else {
                1 + last.min(costs[j]).min(costs[j + 1])
            };
            last = old;
        }
    }
    costs[b.len()]
}

/// Compare two text files and return their Levenshtein distance.
pub fn compare_text_files(path1: &Path, path2: &Path) -> Result<usize> {
    let text1 = std::fs::read_to_string(path1)?;
    let text2 = std::fs::read_to_string(path2)?;
    Ok(levenshtein(&text1, &text2))
}

/// Compute the average hash (aHash) of an image file.
pub fn average_hash_image(path: &Path) -> Result<u64> {
    use image::{GenericImageView, DynamicImage, imageops::FilterType};
    let img = image::open(path)?;
    let img = img.resize_exact(8, 8, FilterType::Nearest).grayscale();
    let mut total = 0u32;
    let mut pixels = [0u8; 64];
    for (i, p) in img.pixels().enumerate() {
        let luma = p.2[0];
        pixels[i] = luma;
        total += luma as u32;
    }
    let avg = total / 64;
    let mut hash = 0u64;
    for (i, &luma) in pixels.iter().enumerate() {
        if luma as u32 >= avg {
            hash |= 1 << i;
        }
    }
    Ok(hash)
}

/// Compute the Hamming distance between two hashes.
pub fn hamming_distance(a: u64, b: u64) -> u32 {
    (a ^ b).count_ones()
}

/// Compare two image files and return their similarity (1.0 = identical, 0.0 = completely different).
pub fn compare_images(path1: &Path, path2: &Path) -> Result<f32> {
    let hash1 = average_hash_image(path1)?;
    let hash2 = average_hash_image(path2)?;
    let dist = hamming_distance(hash1, hash2);
    Ok(1.0 - (dist as f32 / 64.0))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_levenshtein() {
        assert_eq!(levenshtein("kitten", "sitting"), 3);
        assert_eq!(levenshtein("flaw", "lawn"), 2);
        assert_eq!(levenshtein("", ""), 0);
        assert_eq!(levenshtein("a", "a"), 0);
        assert_eq!(levenshtein("abc", ""), 3);
        assert_eq!(levenshtein("", "abc"), 3);
    }
    #[test]
    fn test_hamming_distance() {
        assert_eq!(hamming_distance(0b1010, 0b1111), 2);
        assert_eq!(hamming_distance(0, 0), 0);
        assert_eq!(hamming_distance(u64::MAX, 0), 64);
    }
    // Note: image similarity tests would require test images in the repo.
}
