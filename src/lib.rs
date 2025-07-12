//! Deduplication core library

pub mod cli;
pub mod hashing;
pub mod similarity;
pub mod safety;
pub mod types;

// Re-export commonly used items
pub use cli::*;
pub use hashing::*;
pub use similarity::*;
pub use safety::*;
pub use types::*;
