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
    
    pub fn quarantine_file(&mut self, file_path: &str) -> Result<(), Box<dyn std::error::Error>> {
        let original_path = PathBuf::from(file_path);
        
        // Skip if file doesn't exist
        if !original_path.exists() {
            return Ok(());
        }
        
        let metadata = fs::metadata(&original_path)?;
        let file_size = metadata.len();
        
        // Generate unique quarantine filename
        let filename = original_path.file_name()
            .ok_or("Invalid filename")?
            .to_string_lossy();
        let quarantine_name = format!("{}_{}", 
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)?
                .as_secs(),
            filename);
        
        let quarantine_path = self.temp_dir.path().join(quarantine_name);
        
        // Move file to quarantine
        fs::rename(&original_path, &quarantine_path)?;
        
        let record = QuarantineRecord {
            original_path: file_path.to_string(),
            quarantine_path: quarantine_path.to_string_lossy().to_string(),
            file_size,
            moved_at: std::time::SystemTime::now(),
        };
        
        self.moved_files.insert(file_path.to_string(), record);
        
        Ok(())
    }
    
    pub fn commit_deletions(&mut self) -> Result<usize, Box<dyn std::error::Error>> {
        let mut deleted_count = 0;
        
        for (_, record) in &self.moved_files {
            let quarantine_path = Path::new(&record.quarantine_path);
            if quarantine_path.exists() {
                fs::remove_file(quarantine_path)?;
                deleted_count += 1;
            }
        }
        
        Ok(deleted_count)
    }
    
    pub fn rollback(&mut self) -> Result<usize, Box<dyn std::error::Error>> {
        let mut restored_count = 0;
        
        for (_, record) in &self.moved_files {
            let quarantine_path = Path::new(&record.quarantine_path);
            let original_path = Path::new(&record.original_path);
            
            if quarantine_path.exists() {
                if let Some(parent) = original_path.parent() {
                    fs::create_dir_all(parent)?;
                }
                
                fs::rename(quarantine_path, original_path)?;
                restored_count += 1;
            }
        }
        
        Ok(restored_count)
    }
} 