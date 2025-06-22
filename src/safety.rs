use std::path::{Path, PathBuf};
use std::fs;
use tempfile::TempDir;
use serde::Serialize;
use std::collections::HashMap;

#[derive(Serialize, Debug)]
pub struct QuarantineRecord {
    pub original_path: String,
    pub quarantine_path: String,
    pub file_size: u64,
    pub moved_at: std::time::SystemTime,
}

#[derive(Debug)]
pub struct QuarantineManager {
    temp_dir: TempDir,
    moved_files: HashMap<String, QuarantineRecord>,
    quarantine_log: PathBuf,
} 