//! Module for file similarity detection and comparison.
//! 
//! This module provides functionality for comparing text and image files using various algorithms.
//! It includes implementations of:
//! - Levenshtein distance for text similarity
//! - Perceptual hashing for image similarity
//! - Grouping of similar files based on configurable thresholds

use std::path::Path;
use anyhow::{Result, Context};
use image::{GenericImageView, DynamicImage, imageops::FilterType, Pixel};
use std::collections::HashMap;
use std::f32;

use crate::cli::ImageHashAlgorithm;

/// Calculate the Levenshtein distance between two strings.
///
/// # Arguments
/// * `a` - First string
/// * `b` - Second string
///
/// # Returns
/// The Levenshtein distance as a `usize`
///
/// # Note
/// This implementation is not optimized for very large strings.
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
///
/// # Arguments
/// * `path1` - Path to the first text file
/// * `path2` - Path to the second text file
///
/// # Returns
/// * `Result<usize>` - The Levenshtein distance between the two files
///
/// # Note
/// This function loads both files entirely into memory, so it's not suitable for very large files.
pub fn compare_text_files(path1: &Path, path2: &Path) -> Result<usize> {
    let text1 = std::fs::read_to_string(path1)?;
    let text2 = std::fs::read_to_string(path2)?;
    Ok(levenshtein(&text1, &text2))
}

/// Calculate a normalized similarity score between two text files.
///
/// # Arguments
/// * `path1` - Path to the first text file
/// * `path2` - Path to the second text file
///
/// # Returns
/// * `Result<f32>` - A value between 0.0 (completely different) and 1.0 (identical)
///
/// # Note
/// This is based on the normalized Levenshtein distance between the file contents.
pub fn text_similarity(path1: &Path, path2: &Path) -> Result<f32> {
    let distance = compare_text_files(path1, path2)? as f32;
    let max_len = std::cmp::max(
        std::fs::read_to_string(path1)?.len(),
        std::fs::read_to_string(path2)?.len(),
    ) as f32;
    
    if max_len == 0.0 {
        return Ok(1.0); // Both files are empty
    }
    
    Ok(1.0 - (distance / max_len).min(1.0))
}

/// Group text files that are similar to each other based on a threshold.
///
/// # Arguments
/// * `files` - A slice of file paths to analyze
/// * `similarity_threshold` - The minimum similarity score (0.0 to 1.0) for files to be considered similar
///
/// # Returns
/// * `Result<Vec<Vec<String>>>` - A vector of groups, where each group contains paths of similar files
///
/// # Note
/// This function uses a simple grouping algorithm that compares each file to others in its size bucket.
pub fn group_similar_text_files(
    files: &[String],
    similarity_threshold: f32,
) -> Result<Vec<Vec<String>>> {
    if files.is_empty() {
        return Ok(Vec::new());
    }

    // First pass: group identical files by size and hash
    let mut size_groups: HashMap<u64, Vec<String>> = HashMap::new();
    for file in files {
        if let Ok(metadata) = std::fs::metadata(file) {
            size_groups.entry(metadata.len()).or_default().push(file.clone());
        }
    }

    let mut groups: Vec<Vec<String>> = Vec::new();
    let mut processed = std::collections::HashSet::new();

    for file in files {
        if processed.contains(file) {
            continue;
        }

        let mut current_group = vec![file.clone()];
        processed.insert(file.clone());

        // Compare with other files of similar size
        if let Ok(metadata) = std::fs::metadata(file) {
            if let Some(similar_sized) = size_groups.get(&metadata.len()) {
                for other_file in similar_sized {
                    if processed.contains(other_file) || file == other_file {
                        continue;
                    }

                    if let Ok(similarity) = text_similarity(
                        Path::new(file),
                        Path::new(other_file),
                    ) {
                        if similarity >= similarity_threshold {
                            current_group.push(other_file.clone());
                            processed.insert(other_file.clone());
                        }
                    }
                }
            }
        }

        if current_group.len() > 1 {
            groups.push(current_group);
        }
    }

    Ok(groups)
}

/// Represents a perceptual hash signature for image comparison.
/// 
/// This signature contains multiple hash values computed using different algorithms
/// to improve the accuracy of image similarity detection.
#[derive(Debug, Clone)]
pub struct ImageSignature {
    pub avg_hash: u64,
    pub phash: u64,
    pub dhash: u64,
    pub color_hash: u64,
}

/// Generate a comprehensive perceptual hash signature for an image.
///
/// This function computes multiple hash values using different algorithms
/// to create a robust signature for image comparison.
///
/// # Arguments
/// * `path` - Path to the image file
///
/// # Returns
/// * `Result<ImageSignature>` - A structure containing multiple hash values
///
/// # Errors
/// Returns an error if the image cannot be loaded or processed.
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

/// Calculate the similarity score between two image signatures.
///
/// # Arguments
/// * `sig1` - First image signature
/// * `sig2` - Second image signature
///
/// # Returns
/// * `f32` - A value between 0.0 (completely different) and 1.0 (identical)
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

/// Calculate the average hash (aHash) of an image.
///
/// This is a simple but effective perceptual hash that works by:
/// 1. Converting the image to grayscale
/// 2. Resizing to 8x8 pixels
/// 3. Calculating the average pixel value
/// 4. Creating a 64-bit hash based on which pixels are above/below average
///
/// # Arguments
/// * `img` - Reference to a DynamicImage to hash
///
/// # Returns
/// * `Result<u64>` - A 64-bit hash value, or an error if the hashing fails
///
/// # Note
/// Fast but less accurate than other methods for some types of images.
pub fn average_hash(img: &DynamicImage) -> Result<u64> {
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

/// Calculate the perceptual hash (pHash) of an image using DCT.
///
/// This implementation follows the standard pHash algorithm:
/// 1. Convert to grayscale
/// 2. Resize to 32x32
/// 3. Apply DCT
/// 4. Take top-left 8x8 of DCT coefficients
/// 5. Calculate median and create hash
///
/// # Arguments
/// * `img` - Reference to a DynamicImage to hash
///
/// # Returns
/// * `Result<u64>` - A 64-bit hash value
///
/// # Note
/// More accurate than average hash but slower and more memory intensive.
pub fn perceptual_hash(img: &DynamicImage) -> Result<u64> {
    // 1. Convert to grayscale and resize to 32x32
    let img = img.resize_exact(32, 32, FilterType::Lanczos3).to_luma8();
    
    // 2. Convert to f64 and scale to [0,1]
    let mut pixels = vec![0.0; 32 * 32];
    for (i, (_, _, pixel)) in img.enumerate_pixels().enumerate() {
        pixels[i] = pixel[0] as f64 / 255.0;
    }
    
    // 3. Apply DCT
    let dct = apply_dct_2d(&pixels, 32);
    
    // 4. Take top-left 8x8 DCT coefficients (excluding the DC component)
    let mut dct_values = Vec::with_capacity(64);
    for i in 0..8 {
        for j in 0..8 {
            if i == 0 && j == 0 { continue; } // Skip DC component
            dct_values.push(dct[i * 32 + j]);
        }
    }
    
    // 5. Calculate median
    dct_values.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    let median = if !dct_values.is_empty() {
        dct_values[dct_values.len() / 2]
    } else {
        return Err(anyhow::anyhow!("Failed to calculate median for perceptual hash"));
    };
    
    // 6. Create hash
    let mut hash = 0u64;
    for (i, &val) in dct_values.iter().enumerate() {
        if val > median && i < 64 {
            hash |= 1u64 << i;
        }
    }
    
    Ok(hash)
}

/// Calculate the difference hash (dHash) of an image.
///
/// This hash works by:
/// 1. Converting to grayscale
/// 2. Resizing to 9x8 pixels (one extra column for differences)
/// 3. Comparing adjacent pixels to create a 64-bit hash
///
/// # Arguments
/// * `img` - Reference to a DynamicImage to hash
///
/// # Returns
/// * `Result<u64>` - A 64-bit hash value
///
/// # Note
/// Good balance between speed and accuracy.
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

/// Calculate a color hash based on dominant colors in the image.
///
/// This hash focuses on color distribution rather than structure.
///
/// # Arguments
/// * `img` - Reference to a DynamicImage to hash
///
/// # Returns
/// * `Result<u64>` - A 64-bit hash value
///
/// # Note
/// Useful for finding images with similar color palettes.
fn color_hash(img: &DynamicImage) -> Result<u64> {
    let img = img.resize_exact(8, 8, FilterType::Lanczos3);
    let mut hash = 0u64;
    
    for (_i, (_x, _y, pixel)) in img.pixels().enumerate() {
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

/// Apply 2D Discrete Cosine Transform (DCT) to a matrix.
///
/// This is a helper function used by the perceptual hash algorithm.
///
/// # Arguments
/// * `matrix` - Input matrix of f64 values
/// * `size` - Size of the matrix (assumed to be square)
///
/// # Returns
/// * `Vec<f64>` - Transformed matrix
///
/// # Note
/// This is a naive implementation and may be slow for large matrices.
fn apply_dct_2d(matrix: &[f64], size: usize) -> Vec<f64> {
    let mut output = vec![0.0; size * size];
    let c1 = std::f64::consts::PI / (size as f64);
    
    for u in 0..size {
        for v in 0..size {
            let cu = if u == 0 { 1.0 / 2.0f64.sqrt() } else { 1.0 };
            let cv = if v == 0 { 1.0 / 2.0f64.sqrt() } else { 1.0 };
            
            let mut sum = 0.0;
            
            for x in 0..size {
                for y in 0..size {
                    let cos1 = (c1 * (x as f64 + 0.5) * u as f64).cos();
                    let cos2 = (c1 * (y as f64 + 0.5) * v as f64).cos();
                    sum += matrix[x * size + y] * cos1 * cos2;
                }
            }
            
            output[u * size + v] = 0.25 * cu * cv * sum;
        }
    }
    
    output
}

/// Compare two images and return a similarity score.
///
/// # Arguments
/// * `path1` - Path to the first image
/// * `path2` - Path to the second image
///
/// # Returns
/// * `Result<f32>` - A value between 0.0 (completely different) and 1.0 (identical)
///
/// # Note
/// Uses a combination of perceptual hashing for comparison.
pub fn compare_images(path1: &Path, path2: &Path) -> Result<f32> {
    let sig1 = generate_image_signature(path1)?;
    let sig2 = generate_image_signature(path2)?;
    Ok(compare_image_signatures(&sig1, &sig2))
}

/// Calculate the Hamming distance between two 64-bit hashes.
///
/// # Arguments
/// * `a` - First hash value
/// * `b` - Second hash value
///
/// # Returns
/// * `u32` - Number of bits that differ between the two hashes
pub fn hamming_distance(a: u64, b: u64) -> u32 {
    (a ^ b).count_ones()
}

/// Calculate a normalized similarity score from a Hamming distance.
///
/// # Arguments
/// * `a` - First hash value
/// * `b` - Second hash value
///
/// # Returns
/// * `f32` - A value between 0.0 (completely different) and 1.0 (identical)
pub fn hamming_similarity(a: u64, b: u64) -> f32 {
    let distance = hamming_distance(a, b) as f32;
    1.0 - (distance / 64.0).min(1.0)
}

/// Compare two images using the specified hashing algorithm.
///
/// # Arguments
/// * `path1` - Path to the first image
/// * `path2` - Path to the second image
/// * `algorithm` - Hashing algorithm to use for comparison
///
/// # Returns
/// * `Option<f32>` - Similarity score between 0.0 and 1.0, or None if comparison fails
///
/// # Note
/// Different algorithms may be better suited for different types of images.
pub fn compare_images_with_algorithm(
    path1: &str,
    path2: &str,
    algorithm: ImageHashAlgorithm,
) -> Option<f32> {
    let img1 = match image::open(path1) {
        Ok(img) => img,
        Err(_) => return None,
    };
    
    let img2 = match image::open(path2) {
        Ok(img) => img,
        Err(_) => return None,
    };
    
    match algorithm {
        ImageHashAlgorithm::Avg => {
            let hash1 = average_hash(&img1).ok()?;
            let hash2 = average_hash(&img2).ok()?;
            Some(hamming_similarity(hash1, hash2))
        }
        ImageHashAlgorithm::Phash => {
            let hash1 = perceptual_hash(&img1).ok()?;
            let hash2 = perceptual_hash(&img2).ok()?;
            Some(hamming_similarity(hash1, hash2))
        }
        ImageHashAlgorithm::Dhash => {
            let hash1 = difference_hash(&img1).ok()?;
            let hash2 = difference_hash(&img2).ok()?;
            Some(hamming_similarity(hash1, hash2))
        }
        ImageHashAlgorithm::Color => {
            let hash1 = color_hash(&img1).ok()?;
            let hash2 = color_hash(&img2).ok()?;
            Some(hamming_similarity(hash1, hash2))
        }
        ImageHashAlgorithm::Combined => {
            let sig1 = generate_image_signature(Path::new(path1)).ok()?;
            let sig2 = generate_image_signature(Path::new(path2)).ok()?;
            Some(compare_image_signatures(&sig1, &sig2))
        }
    }
}



#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    use tempfile::NamedTempFile;
    use std::io::Write;
    
    fn create_test_file(content: &str) -> NamedTempFile {
        let mut file = NamedTempFile::new().unwrap();
        write!(file, "{}", content).unwrap();
        file
    }
    
    #[test]
    fn test_text_similarity_identical() {
        let file1 = create_test_file("This is a test file with some content.");
        let file2 = create_test_file("This is a test file with some content.");
        
        let similarity = text_similarity(&file1.path(), &file2.path()).unwrap();
        assert!((similarity - 1.0).abs() < f32::EPSILON);
    }
    
    #[test]
    fn test_text_similarity_different() {
        let file1 = create_test_file("This is a test file with some content.");
        let file2 = create_test_file("This is a completely different file with different content.");
        
        let similarity = text_similarity(&file1.path(), &file2.path()).unwrap();
        assert!(similarity < 0.5);
    }
    
    #[test]
    fn test_text_similarity_empty() {
        let file1 = create_test_file("");
        let file2 = create_test_file("");
        
        let similarity = text_similarity(&file1.path(), &file2.path()).unwrap();
        assert!((similarity - 1.0).abs() < f32::EPSILON);
    }
    
    #[test]
    fn test_group_similar_text_files() {
        // Create test files with varying similarity
        let file1 = create_test_file("This is a test file with some content.");
        let file2 = create_test_file("This is a test file with some content."); // Identical to file1
        let file3 = create_test_file("This is a test file with slightly different content."); // Similar to file1
        let file4 = create_test_file("This is completely different content."); // Different
        
        let files = vec![
            file1.path().to_str().unwrap().to_string(),
            file2.path().to_str().unwrap().to_string(),
            file3.path().to_str().unwrap().to_string(),
            file4.path().to_str().unwrap().to_string(),
        ];
        
        // High threshold - only identical files should be grouped
        let groups = group_similar_text_files(&files, 0.9).unwrap();
        assert_eq!(groups.len(), 1);
        assert_eq!(groups[0].len(), 2); // file1 and file2 should be grouped
        
        // Medium threshold - similar files should be grouped
        let groups = group_similar_text_files(&files, 0.7).unwrap();
        assert_eq!(groups.len(), 1);
        assert!(groups[0].len() >= 3); // file1, file2, and file3 should be grouped
        
        // Low threshold - all files might be grouped
        let groups = group_similar_text_files(&files, 0.3).unwrap();
        assert!(!groups.is_empty());
    }
    
    #[test]
    fn test_levenshtein_distance() {
        assert_eq!(levenshtein("kitten", "sitting"), 3);
        assert_eq!(levenshtein("book", "back"), 2);
        assert_eq!(levenshtein("", "test"), 4);
        assert_eq!(levenshtein("test", ""), 4);
        assert_eq!(levenshtein("", ""), 0);
    }
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
    
    #[test]
    fn test_average_hash() -> Result<()> {
        let img = image::GrayImage::from_pixel(8, 8, image::Luma([128u8]));
        let hash = average_hash(&DynamicImage::ImageLuma8(img))?;
        // All pixels are the same, so hash should be 0 or u64::MAX
        assert!(hash == 0 || hash == u64::MAX);
        Ok(())
    }
    
    #[test]
    fn test_perceptual_hash() -> Result<()> {
        let img = image::GrayImage::from_pixel(32, 32, image::Luma([128u8]));
        let hash = perceptual_hash(&DynamicImage::ImageLuma8(img))?;
        // For a uniform image, the hash should be consistent
        assert_ne!(hash, 0);
        assert_ne!(hash, u64::MAX);
        
        // Test that different images produce different hashes
        let mut img2 = image::GrayImage::new(32, 32);
        for (x, y, pixel) in img2.enumerate_pixels_mut() {
            *pixel = image::Luma([(x + y) as u8]);
        }
        let hash2 = perceptual_hash(&DynamicImage::ImageLuma8(img2))?;
        assert_ne!(hash, hash2);
        
        Ok(())
    }
    
    #[test]
    fn test_difference_hash() -> Result<()> {
        let img = image::GrayImage::from_pixel(9, 8, image::Luma([128u8]));
        let hash = difference_hash(&DynamicImage::ImageLuma8(img))?;
        
        // For a uniform image, the difference hash should be all 0s or all 1s
        assert!(hash == 0 || hash == u64::MAX);
        
        // Test with a gradient image
        let mut img2 = image::GrayImage::new(9, 8);
        for (x, y, pixel) in img2.enumerate_pixels_mut() {
            *pixel = image::Luma([(x + y) as u8]);
        }
        let hash2 = difference_hash(&DynamicImage::ImageLuma8(img2))?;
        
        // Should be different from the uniform hash
        let uniform_hash = difference_hash(&DynamicImage::ImageLuma8(
            image::GrayImage::from_pixel(9, 8, image::Luma([128u8]))
        ))?;
        assert_ne!(hash2, uniform_hash);
        
        Ok(())
    }
    
    #[test]
    fn test_color_hash() -> Result<()> {
        // Test with a red image
        let img = image::RgbImage::from_pixel(8, 8, image::Rgb([255, 0, 0]));
        let hash = color_hash(&DynamicImage::ImageRgb8(img))?;
        
        // Test with a different color
        let img2 = image::RgbImage::from_pixel(8, 8, image::Rgb([0, 255, 0]));
        let hash2 = color_hash(&DynamicImage::ImageRgb8(img2))?;
        
        // Different colors should produce different hashes
        assert_ne!(hash, hash2);
        
        // Same color should produce same hash
        let img3 = image::RgbImage::from_pixel(8, 8, image::Rgb([255, 0, 0]));
        let hash3 = color_hash(&DynamicImage::ImageRgb8(img3))?;
        assert_eq!(hash, hash3);
        
        Ok(())
    }
    
    #[test]
    fn test_image_signature() -> Result<()> {
        // Create a test image
        let mut img = image::RgbImage::new(32, 32);
        for (x, y, pixel) in img.enumerate_pixels_mut() {
            *pixel = image::Rgb([(x + y) as u8, x as u8, y as u8]);
        }
        
        // Save to temp file
        let mut file = NamedTempFile::new()?;
        let path = file.path().to_owned();
        DynamicImage::ImageRgb8(img).save(&path)?;
        
        // Generate signature
        let sig = generate_image_signature(&path)?;
        
        // Test that the same image produces the same signature
        let sig2 = generate_image_signature(&path)?;
        assert_eq!(sig.avg_hash, sig2.avg_hash);
        assert_eq!(sig.phash, sig2.phash);
        assert_eq!(sig.dhash, sig2.dhash);
        assert_eq!(sig.color_hash, sig2.color_hash);
        
        // Test comparison
        let similarity = compare_image_signatures(&sig, &sig2);
        assert!((similarity - 1.0).abs() < f32::EPSILON);
        
        // Test with a different image
        let mut img2 = image::RgbImage::new(32, 32);
        for (x, y, pixel) in img2.enumerate_pixels_mut() {
            *pixel = image::Rgb([(x * 2 + y) as u8, (y * 2) as u8, x as u8]);
        }
        let mut file2 = NamedTempFile::new()?;
        let path2 = file2.path().to_owned();
        DynamicImage::ImageRgb8(img2).save(&path2)?;
        
        let sig3 = generate_image_signature(&path2)?;
        let similarity = compare_image_signatures(&sig, &sig3);
        assert!(similarity < 0.9, "Different images should have similarity < 0.9");
        
        Ok(())
    }
    
    #[test]
    fn test_apply_dct_2d() {
        // Test with a simple 4x4 matrix
        let input = vec![1.0, 2.0, 3.0, 4.0, 
                         5.0, 6.0, 7.0, 8.0,
                         9.0, 10.0, 11.0, 12.0,
                         13.0, 14.0, 15.0, 16.0];
        
        let output = apply_dct_2d(&input, 4);
        
        // Check basic properties of DCT
        assert_eq!(output.len(), 16);
        
        // The DC coefficient (first element) should be the average of all inputs
        let avg = input.iter().sum::<f64>() / 16.0;
        assert!((output[0] - avg * 4.0).abs() < 1e-10);
        
        // Test that applying DCT to a constant input gives all zeros except DC
        let const_input = vec![1.0; 16];
        let const_output = apply_dct_2d(&const_input, 4);
        assert!((const_output[0] - 16.0).abs() < 1e-10);
        for &coeff in &const_output[1..] {
            assert!(coeff.abs() < 1e-10, "AC coefficient should be zero for constant input");
        }
    }
}
