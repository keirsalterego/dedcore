use std::path::Path;
use anyhow::Result;

/// Quick Levenshtein distance. Not the fastest, but works for me.
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

/// Compare two text files. Returns Levenshtein distance. (Could be slow for big files, sorry!)
pub fn compare_text_files(path1: &Path, path2: &Path) -> Result<usize> {
    let text1 = std::fs::read_to_string(path1)?;
    let text2 = std::fs::read_to_string(path2)?;
    Ok(levenshtein(&text1, &text2))
}

/// Quick image hash using 8x8 grayscale. Good enough for most stuff.
pub fn average_hash_image(path: &Path) -> Result<u64> {
    use image::{GenericImageView, imageops::FilterType};
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

/// Hamming distance. Not proud of this logic but hey, it works.
pub fn hamming_distance(a: u64, b: u64) -> u32 {
    (a ^ b).count_ones()
}

/// Compare two images. 1.0 = same, 0.0 = totally different. (Math is easy, results are magic.)
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
