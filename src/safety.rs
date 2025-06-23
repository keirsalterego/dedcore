use std::path::{Path, PathBuf};
use std::fs;
use tempfile::TempDir;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use std::io::{Read, Write};
use dirs;
use serde_json;
use chrono::Local;

#[derive(Serialize, Deserialize, Debug, Clone)]
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
        let quarantine_log = QuarantineManager::get_quarantine_log_path();
        let moved_files = if quarantine_log.exists() {
            let mut file = fs::File::open(&quarantine_log)?;
            let mut contents = String::new();
            file.read_to_string(&mut contents)?;
            serde_json::from_str(&contents).unwrap_or_default()
        } else {
            HashMap::new()
        };
        Ok(Self {
            temp_dir,
            moved_files,
            quarantine_log,
        })
    }
    
    fn get_quarantine_log_path() -> PathBuf {
        let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("."));
        let dir = home.join(".dedcore");
        if !dir.exists() {
            let _ = fs::create_dir_all(&dir);
        }
        dir.join("quarantine.json")
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
        
        // Move file to quarantine, robust to cross-device
        match fs::rename(&original_path, &quarantine_path) {
            Ok(_) => {},
            Err(e) if e.raw_os_error() == Some(18) => {
                // Cross-device link error, fallback to copy+delete
                fs::copy(&original_path, &quarantine_path)?;
                fs::remove_file(&original_path)?;
            },
            Err(e) => return Err(Box::new(e)),
        }
        
        let record = QuarantineRecord {
            original_path: file_path.to_string(),
            quarantine_path: quarantine_path.to_string_lossy().to_string(),
            file_size,
            moved_at: std::time::SystemTime::now(),
        };
        
        self.moved_files.insert(file_path.to_string(), record.clone());
        self.save_state()?;
        Self::log_recovery("quarantined", &record);
        Ok(())
    }
    
    pub fn commit_deletions(&mut self) -> Result<usize, Box<dyn std::error::Error>> {
        let mut deleted_count = 0;
        let mut to_log = vec![];
        for (_, record) in &self.moved_files {
            let quarantine_path = Path::new(&record.quarantine_path);
            if quarantine_path.exists() {
                fs::remove_file(quarantine_path)?;
                deleted_count += 1;
                to_log.push(record.clone());
            }
        }
        self.moved_files.clear();
        self.save_state()?;
        for rec in to_log {
            Self::log_recovery("deleted", &rec);
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
    
    pub fn remove_quarantined_file(&mut self, path: &str) -> Result<bool, Box<dyn std::error::Error>> {
        let existed = self.moved_files.remove(path).is_some();
        self.save_state()?;
        Ok(existed)
    }
    
    pub fn save_state(&self) -> Result<(), Box<dyn std::error::Error>> {
        let json = serde_json::to_string_pretty(&self.moved_files)?;
        let mut file = std::fs::File::create(&self.quarantine_log)?;
        file.write_all(json.as_bytes())?;
        Ok(())
    }
    
    fn log_recovery(action: &str, record: &QuarantineRecord) {
        let log_path = QuarantineManager::get_recovery_log_path();
        let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        let entry = serde_json::json!({
            "timestamp": timestamp,
            "action": action,
            "original_path": record.original_path,
            "quarantine_path": record.quarantine_path,
            "file_size": record.file_size,
        });
        let mut log = if let Ok(existing) = std::fs::read_to_string(&log_path) {
            serde_json::from_str::<Vec<serde_json::Value>>(&existing).unwrap_or_else(|_| vec![])
        } else {
            vec![]
        };
        log.push(entry);
        let _ = std::fs::write(&log_path, serde_json::to_string_pretty(&log).unwrap());
    }
    
    fn get_recovery_log_path() -> PathBuf {
        let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("."));
        let dir = home.join(".dedcore");
        if !dir.exists() {
            let _ = std::fs::create_dir_all(&dir);
        }
        dir.join("dedcore_recovery.json")
    }
    
    pub fn read_recovery_log() -> Vec<serde_json::Value> {
        let log_path = QuarantineManager::get_recovery_log_path();
        if let Ok(existing) = std::fs::read_to_string(&log_path) {
            serde_json::from_str::<Vec<serde_json::Value>>(&existing).unwrap_or_else(|_| vec![])
        } else {
            vec![]
        }
    }
} 