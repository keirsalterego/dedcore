//! Common types used across the dedcore crate.

use clap::ValueEnum;

/// Algorithm used for image hashing and comparison.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, ValueEnum)]
pub enum ImageHashAlgorithm {
    /// Average hash (fastest but less accurate)
    Avg,
    /// Perceptual hash (slower but more accurate)
    Perceptual,
    /// Difference hash (good balance of speed and accuracy)
    Difference,
    /// Color hash (based on color distribution)
    Color,
    /// Combined approach using multiple hashing methods
    Combined,
}
