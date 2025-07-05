use std::path::Path;
use anyhow::{Result, Context};
use image::{GenericImageView, DynamicImage, imageops::FilterType, Pixel};
use std::collections::HashMap;
use std::sync::Arc;
use rayon::prelude::*;
use std::f32;

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

/// Advanced perceptual image hashing using multiple algorithms for better accuracy
#[derive(Debug, Clone)]
pub struct ImageSignature {
    pub avg_hash: u64,
    pub phash: u64,
    pub dhash: u64,
    pub color_hash: u64,
}

/// Generate multiple perceptual hashes for an image
pub fn generate_image_signature(path: &Path) -> Result<ImageSignature> {
    let img = image::open(path)
        .with_context(|| format!("Failed to open image: {}", path.display()))?;
    
    // Convert to grayscale for most hashes
    let gray_img = img.grayscale();
    
    // Generate different types of hashes in parallel using nested joins
    let ((avg_hash, phash), (dhash, color_hash)) = rayon::join(
        || {
            rayon::join(
                || average_hash(&gray_img).unwrap_or_else(|_| 0),
                || perceptual_hash(&gray_img).unwrap_or_else(|_| 0),
            )
        },
        || {
            rayon::join(
                || difference_hash(&gray_img).unwrap_or_else(|_| 0),
                || color_hash(&img).unwrap_or_else(|_| 0),
            )
        },
    );
    
    Ok(ImageSignature {
        avg_hash,
        phash,
        dhash,
        color_hash,
    })
}

/// Calculate similarity score between two image signatures (0.0 to 1.0)
pub fn compare_image_signatures(sig1: &ImageSignature, sig2: &ImageSignature) -> f32 {
    let weights = [0.3, 0.4, 0.2, 0.1]; // Weighted importance of each hash
    
    let scores = [
        hamming_similarity(sig1.avg_hash, sig2.avg_hash),
        hamming_similarity(sig1.phash, sig2.phash),
        hamming_similarity(sig1.dhash, sig2.dhash),
        hamming_similarity(sig1.color_hash, sig2.color_hash),
    ];
    
    // Calculate weighted average of similarity scores
    scores.iter()
        .zip(weights.iter())
        .map(|(&score, &weight)| score * weight)
        .sum()
}

/// Basic average hash implementation
fn average_hash(img: &DynamicImage) -> Result<u64> {
    let img = img.resize_exact(8, 8, FilterType::Lanczos3);
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

/// Perceptual hash (pHash) using DCT
fn perceptual_hash(img: &DynamicImage) -> Result<u64> {
    use std::f64::consts::PI;
    
    // Resize to 32x32 and convert to grayscale
    let img = img.resize_exact(32, 32, FilterType::Lanczos3);
    let mut pixels = [0f64; 32 * 32];
    
    // Convert to grayscale and normalize
    for (i, (_, _, pixel)) in img.pixels().enumerate() {
        pixels[i] = pixel[0] as f64 / 255.0;
    }
    
    // Apply DCT (Discrete Cosine Transform)
    let dct = apply_dct_2d(&pixels, 32);
    
    // Take top-left 8x8 of DCT (low frequency components)
    let mut hash = 0u64;
    let mut dct_values = [0.0; 64];
    
    for i in 0..8 {
        for j in 0..8 {
            dct_values[i * 8 + j] = dct[i * 32 + j];
        }
    }
    
    // Calculate median value (excluding DC component)
    let mut sorted = dct_values[1..].to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    let median = if !sorted.is_empty() { sorted[sorted.len() / 2] } else { 0.0 };
    
    // Generate hash
    for (i, &val) in dct_values.iter().enumerate() {
        if val > median {
            hash |= 1 << i;
        }
    }
    
    Ok(hash)
}

/// Difference hash (dHash)
fn difference_hash(img: &DynamicImage) -> Result<u64> {
    let img = img.resize_exact(9, 8, FilterType::Lanczos3);
    let mut hash = 0u64;
    
    for y in 0..8 {
        for x in 0..8 {
            let left = img.get_pixel(x, y).to_luma()[0];
            let right = img.get_pixel(x + 1, y).to_luma()[0];
            
            if left > right {
                hash |= 1 << (y * 8 + x);
            }
        }
    }
    
    Ok(hash)
}

/// Color hash based on dominant colors
fn color_hash(img: &DynamicImage) -> Result<u64> {
    let img = img.resize_exact(8, 8, FilterType::Lanczos3);
    let mut hash = 0u64;
    
    for (i, (_, _, pixel)) in img.pixels().enumerate() {
        let r = pixel[0] as u32;
        let g = pixel[1] as u32;
        let b = pixel[2] as u32;
        
        // Simple color quantization
        let rq = (r / 64) as u8;
        let gq = (g / 64) as u8;
        let bq = (b / 64) as u8;
        
        // Combine into a single byte (2 bits per channel)
        let color_byte = (rq << 4) | (gq << 2) | bq;
        
        // Update hash
        hash = hash.wrapping_mul(31).wrapping_add(color_byte as u64);
    }
    
    Ok(hash)
}

/// 2D DCT implementation for pHash
fn apply_dct_2d(matrix: &[f64], size: usize) -> Vec<f64> {
    let mut result = vec![0.0; size * size];
    let c1 = std::f64::consts::PI / (size as f64);
    
    for u in 0..size {
        for v in 0..size {
            let mut sum = 0.0;
            
            for x in 0..size {
                for y in 0..size {
                    let cu = if u == 0 { 1.0 / 2.0f64.sqrt() } else { 1.0 };
                    let cv = if v == 0 { 1.0 / 2.0f64.sqrt() } else { 1.0 };
                    
                    let cos1 = (c1 * (x as f64 + 0.5) * (u as f64)).cos();
                    let cos2 = (c1 * (y as f64 + 0.5) * (v as f64)).cos();
                    
                    sum += cu * cv * matrix[x * size + y] * cos1 * cos2;
                }
            }
            
            result[u * size + v] = sum * 2.0 / (size as f64);
        }
    }
    
    result
}

/// Compare two images and return a similarity score (0.0 to 1.0)
pub fn compare_images(path1: &Path, path2: &Path) -> Result<f32> {
    let sig1 = generate_image_signature(path1)?;
    let sig2 = generate_image_signature(path2)?;
    Ok(compare_image_signatures(&sig1, &sig2))
}

/// Calculate Hamming distance between two 64-bit hashes
pub fn hamming_distance(a: u64, b: u64) -> u32 {
    (a ^ b).count_ones()
}

/// Calculate similarity score from Hamming distance (0.0 to 1.0)
pub fn hamming_similarity(a: u64, b: u64) -> f32 {
    let distance = hamming_distance(a, b) as f32;
    1.0 - (distance / 64.0).min(1.0)
}



#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    use tempfile::NamedTempFile;
    use std::io::Write;
    
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
    
    #[test]
    fn test_hamming_similarity() {
        assert!((hamming_similarity(0b1010, 0b1111) - 0.96875).abs() < f32::EPSILON);
        assert!((hamming_similarity(0, 0) - 1.0).abs() < f32::EPSILON);
        assert!((hamming_similarity(u64::MAX, 0) - 0.0).abs() < f32::EPSILON);
    }
    
    #[test]
    fn test_compare_images_same() -> Result<()> {
        // Create a test image
        let mut img = image::GrayImage::new(100, 100);
        for (x, y, pixel) in img.enumerate_pixels_mut() {
            *pixel = image::Luma([(x + y) as u8]);
        }
        
        // Save to temp files
        let mut file1 = NamedTempFile::new()?;
        let path1 = file1.path().to_owned();
        img.save(&path1)?;
        
        // Compare with itself
        let similarity = compare_images(&path1, &path1)?;
        assert!((similarity - 1.0).abs() < f32::EPSILON, "Image should be identical to itself");
        
        Ok(())
    }
    
    #[test]
    fn test_compare_images_different() -> Result<()> {
        // Create two different test images
        let mut img1 = image::GrayImage::new(100, 100);
        let mut img2 = image::GrayImage::new(100, 100);
        
        for (x, y, pixel) in img1.enumerate_pixels_mut() {
            *pixel = image::Luma([(x + y) as u8]);
        }
        
        for (x, y, pixel) in img2.enumerate_pixels_mut() {
            *pixel = image::Luma([(x * 2 + y) as u8]);
        }
        
        // Save to temp files
        let mut file1 = NamedTempFile::new()?;
        let mut file2 = NamedTempFile::new()?;
        let path1 = file1.path().to_owned();
        let path2 = file2.path().to_owned();
        
        img1.save(&path1)?;
        img2.save(&path2)?;
        
        // Compare different images
        let similarity = compare_images(&path1, &path2)?;
        assert!(similarity < 0.5, "Different images should have low similarity");
        
        Ok(())
    }
}
