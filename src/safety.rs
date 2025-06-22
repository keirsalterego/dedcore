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

impl QuarantineManager {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let temp_dir = tempfile::tempdir()?;
        let quarantine_log = temp_dir.path().join("quarantine.log");
        
        Ok(Self {
            temp_dir,
            moved_files: HashMap::new(),
            quarantine_log,
        })
    }
    
    pub fn get_quarantine_stats(&self) -> (usize, u64) {
        let count = self.moved_files.len();
        let total_size: u64 = self.moved_files.values()
            .map(|r| r.file_size)
            .sum();
        (count, total_size)
    }
    
    pub fn list_quarantined_files(&self) -> Vec<&QuarantineRecord> {
        self.moved_files.values().collect()
    }
} 