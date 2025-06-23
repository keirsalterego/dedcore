use std::path::PathBuf;
use clap::{Parser, Subcommand};
use crate::hashing::{HashConfig, Security, Speed};
use crate::safety::QuarantineManager;
use std::env;
use hex;
use std::fs;
use std::path::Path;
use walkdir;
use indicatif::{ProgressBar, ProgressStyle};
use std::time::{SystemTime, UNIX_EPOCH};
use regex::Regex;
use serde::{Serialize, Deserialize};
use inquire::Confirm;
use std::collections::HashMap;
use std::collections::BTreeMap;

#[derive(Subcommand, Debug)]
pub enum AppCmd {
    #[command(subcommand)]
    Quarantine(QuarantineCmd),
    #[command(subcommand)]
    Recovery(RecoveryCmd),
}

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct App {
    #[arg(short, long)]
    pub filetypes: Option<String>,

    #[arg(short, long)]
    pub dry: bool,

    #[arg(short = 'p', long)]
    pub dir: Option<PathBuf>,

    #[arg(long, value_name = "SECURITY", default_value = "high", help = "Hash security: low, medium, high, maximum")]
    pub security: String,

    #[arg(long, value_name = "SPEED", default_value = "balanced", help = "Hash speed: fastest, balanced, mostsecure")]
    pub speed: String,

    #[arg(long, help = "Quarantine all duplicates (all but one per group) after scanning")]
    pub quarantine_all_dupes: bool,

    #[arg(value_name = "TARGETS", required = true)]
    pub targets: Vec<String>,

    #[command(subcommand)]
    pub cmd: Option<AppCmd>,

    #[arg(long, value_name = "PATH", help = "Path to save JSON report")]
    pub json_report: Option<String>,

    #[arg(long, value_name = "PATH", help = "Path to save HTML report")]
    pub html_report: Option<String>,

    #[arg(long, value_name = "FLOAT", help = "Minimum similarity threshold for grouping similar text files (0.0-1.0, default: 0.8)")]
    pub similarity_threshold: Option<f64>,

    #[arg(long, value_name = "FLOAT", help = "Minimum similarity threshold for grouping similar images (0.0-1.0, default: 0.9)")]
    pub image_similarity_threshold: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct FileHashCacheEntry {
    size: u64,
    mtime: u64,
    hash: Vec<u8>,
}

fn load_cache(path: &str) -> BTreeMap<String, FileHashCacheEntry> {
    let cache_path = std::path::Path::new(path);
    if cache_path.exists() {
        if let Ok(data) = std::fs::read_to_string(cache_path) {
            if let Ok(map) = serde_json::from_str(&data) {
                return map;
            }
        }
    }
    BTreeMap::new()
}

fn save_cache(path: &str, cache: &BTreeMap<String, FileHashCacheEntry>) {
    if let Ok(json) = serde_json::to_string_pretty(cache) {
        let _ = std::fs::write(path, json);
    }
}

fn clean_cache(cache: &mut BTreeMap<String, FileHashCacheEntry>) {
    let files: Vec<String> = cache.keys().cloned().collect();
    for f in files {
        if !std::path::Path::new(&f).exists() {
            cache.remove(&f);
        }
    }
}

#[derive(Serialize)]
struct FileHashReport {
    file: String,
    hash: String,
    algorithm: String,
}

#[derive(Subcommand, Debug)]
pub enum QuarantineCmd {
    /// Quarantine a file (move it to quarantine)
    File {
        #[arg(value_name = "FILE")] file: String,
    },
    /// Commit deletions (permanently delete quarantined files)
    Commit,
    /// Rollback quarantined files (restore them to original locations)
    Rollback,
    /// List all currently quarantined files
    List,
    /// Restore a specific quarantined file by its original path
    Restore {
        #[arg(value_name = "ORIGINAL_PATH")] original_path: String,
    },
}

#[derive(Subcommand, Debug)]
pub enum RecoveryCmd {
    /// List recovery log
    List,
    /// Restore a file from quarantine by original path
    Restore {
        #[arg(value_name = "ORIGINAL_PATH")] original_path: String,
    },
}

fn parse_size_arg(arg: &str) -> Option<u64> {
    arg.parse::<u64>().ok()
}

fn parse_age_arg(arg: &str) -> Option<u64> {
    arg.parse::<u64>().ok()
}

fn collect_files_recursively_with_filter<P: AsRef<Path>>(root: P, exts: Option<&Vec<String>>, min_size: Option<u64>, max_size: Option<u64>, min_age: Option<u64>, max_age: Option<u64>, regex_filter: Option<&Regex>) -> Vec<String> {
    let mut files = Vec::new();
    let debug = std::env::var("DEDCORE_DEBUG").ok().as_deref() == Some("1");
    let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
    let walker = walkdir::WalkDir::new(root).into_iter();
    for entry in walker {
        if let Ok(e) = entry {
            if e.file_type().is_file() {
                let meta = e.metadata().ok();
                let size_ok = meta.as_ref().map(|m| {
                    let len = m.len();
                    (min_size.map_or(true, |min| len >= min)) && (max_size.map_or(true, |max| len <= max))
                }).unwrap_or(false);
                if !size_ok {
                    if debug {
                        println!("[DEBUG] Skipping file (size): {:?}", e.path());
                    }
                    continue;
                }
                let age_ok = meta.as_ref().map(|m| {
                    if let Ok(modified) = m.modified() {
                        if let Ok(modified_secs) = modified.duration_since(UNIX_EPOCH) {
                            let age_secs = if now >= modified_secs.as_secs() {
                                now - modified_secs.as_secs()
                            } else {
                                0 // treat future files as age 0 days
                            };
                            let age_days = age_secs / 86400;
                            (min_age.map_or(true, |min| age_days >= min)) && (max_age.map_or(true, |max| age_days <= max))
                        } else {
                            true
                        }
                    } else {
                        true
                    }
                }).unwrap_or(false);
                if !age_ok {
                    if debug {
                        println!("[DEBUG] Skipping file (age): {:?}", e.path());
                    }
                    continue;
                }
                let path_str = e.path().to_string_lossy();
                if let Some(re) = regex_filter {
                    if !re.is_match(&path_str) {
                        if debug {
                            println!("[DEBUG] Skipping file (regex): {:?}", e.path());
                        }
                        continue;
                    }
                }
                if let Some(exts) = exts {
                    if let Some(ext) = e.path().extension().and_then(|s| s.to_str()) {
                        if debug {
                            println!("[DEBUG] Checking file: {:?}, ext: {:?}", e.path(), ext);
                        }
                        if exts.iter().any(|x| x.eq_ignore_ascii_case(ext)) {
                            files.push(path_str.to_string());
                        }
                    } else if debug {
                        println!("[DEBUG] Skipping file (no ext): {:?}", e.path());
                    }
                } else {
                    if debug {
                        println!("[DEBUG] Including file: {:?}", e.path());
                    }
                    files.push(path_str.to_string());
                }
            }
        }
    }
    files
}

pub fn run_with_args<I, T>(args: I)
where
    I: IntoIterator<Item = T>,
    T: Into<std::ffi::OsString> + Clone,
{
    let app = App::parse_from(args);
    // Parse security and speed from CLI
    let security = match app.security.to_lowercase().as_str() {
        "low" => Security::Low,
        "medium" => Security::Medium,
        "maximum" => Security::Maximum,
        _ => Security::High,
    };
    let speed = match app.speed.to_lowercase().as_str() {
        "fastest" => Speed::Fastest,
        "mostsecure" => Speed::MostSecure,
        _ => Speed::Balanced,
    };
    let default_config = HashConfig::new(security, speed);
    let mut filetypes: Option<Vec<String>> = None;
    let mut min_size: Option<u64> = None;
    let mut max_size: Option<u64> = None;
    let mut min_age: Option<u64> = None;
    let mut max_age: Option<u64> = None;
    let mut regex_filter: Option<Regex> = None;
    let mut dry_run = app.dry;
    let mut quarantine_dir: Option<String> = None;
    let mut safe_delete = false;
    let mut commit = false;
    let mut rollback = false;
    let args: Vec<String> = env::args().collect();
    for arg in &args {
        if let Some(rest) = arg.strip_prefix("--filetypes=") {
            filetypes = Some(rest.split(',').map(|s| s.trim().to_string()).collect());
        }
        if let Some(rest) = arg.strip_prefix("--min-size=") {
            min_size = parse_size_arg(rest);
        }
        if let Some(rest) = arg.strip_prefix("--max-size=") {
            max_size = parse_size_arg(rest);
        }
        if let Some(rest) = arg.strip_prefix("--min-age=") {
            min_age = parse_age_arg(rest);
        }
        if let Some(rest) = arg.strip_prefix("--max-age=") {
            max_age = parse_age_arg(rest);
        }
        if let Some(rest) = arg.strip_prefix("--regex=") {
            if let Ok(re) = Regex::new(rest) {
                regex_filter = Some(re);
            } else {
                eprintln!("Invalid regex pattern: {}", rest);
                return;
            }
        }
        if arg == "--dry" {
            dry_run = true;
        }
        if let Some(rest) = arg.strip_prefix("--quarantine-dir=") {
            quarantine_dir = Some(rest.to_string());
        }
        if arg == "--safe-delete" {
            safe_delete = true;
        }
        if arg == "--commit" {
            commit = true;
        }
        if arg == "--rollback" {
            rollback = true;
        }
    }
    let mut files: Vec<String> = Vec::new();
    let scan_target;
    if app.targets.len() == 1 && Path::new(&app.targets[0]).is_dir() {
        scan_target = format!("directory: {}", app.targets[0]);
        files = collect_files_recursively_with_filter(&app.targets[0], filetypes.as_ref(), min_size, max_size, min_age, max_age, regex_filter.as_ref());
    } else if app.targets.len() == 1 && Path::new(&app.targets[0]).is_file() {
        scan_target = format!("file: {}", app.targets[0]);
        files.push(app.targets[0].clone());
    } else {
        scan_target = format!("files: {}", app.targets.join(", "));
        for f in &app.targets {
            if Path::new(f).is_file() {
                files.push(f.clone());
            } else if Path::new(f).is_dir() {
                let mut dir_files = collect_files_recursively_with_filter(f, filetypes.as_ref(), min_size, max_size, min_age, max_age, regex_filter.as_ref());
                files.append(&mut dir_files);
            }
        }
    }
    if files.is_empty() {
        eprintln!("No files found to hash.");
        return;
    }
    println!("\n=== DEDCORE File Hasher ===");
    println!("Scanning {}", scan_target);
    if let Some(ref exts) = filetypes {
        println!("Filtering by file types: {:?}", exts);
    }
    if let Some(min) = min_size {
        println!("Filtering by min size: {} bytes", min);
    }
    if let Some(max) = max_size {
        println!("Filtering by max size: {} bytes", max);
    }
    if let Some(min) = min_age {
        println!("Filtering by min age: {} days", min);
    }
    if let Some(max) = max_age {
        println!("Filtering by max age: {} days", max);
    }
    if let Some(ref re) = regex_filter {
        println!("Filtering by regex: {}", re);
    }
    if let Some(ref qdir) = quarantine_dir {
        println!("Quarantine directory: {}", qdir);
    }
    if safe_delete {
        println!("Safe delete mode: enabled");
    }
    if commit {
        println!("Commit mode: enabled");
    }
    if rollback {
        println!("Rollback mode: enabled");
    }
    println!("Files to process: {}\n", files.len());
    if dry_run {
        println!("[DRY RUN] The following files would be processed:");
        for f in &files {
            println!("{}", f);
        }
        println!("\n[DRY RUN] {} files would be processed.", files.len());
        return;
    }
    if let Some(ref qdir) = quarantine_dir {
        fs::create_dir_all(qdir).ok();
        let mut moved = 0;
        for f in &files {
            if let Some(fname) = Path::new(f).file_name() {
                let dest = Path::new(qdir).join(fname);
                if let Err(e) = fs::rename(f, &dest) {
                    eprintln!("Failed to move {} to {}: {}", f, dest.display(), e);
                } else {
                    println!("{} -> {}", f, dest.display());
                    moved += 1;
                }
            }
        }
        println!("\n{} files moved to quarantine.", moved);
        return;
    }
    let pb = ProgressBar::new(files.len() as u64);
    pb.set_style(ProgressStyle::with_template("[{elapsed_precise}] [{bar:40.cyan/blue}] {pos}/{len} {msg}")
        .unwrap()
        .progress_chars("##-"));
    let mut cache = load_cache(".dedcore_cache.json");
    clean_cache(&mut cache);
    let mut results = Vec::with_capacity(files.len());
    let mut report: Vec<FileHashReport> = Vec::with_capacity(files.len());
    let mut algo_summary: std::collections::BTreeMap<String, String> = std::collections::BTreeMap::new();
    let mut hash_to_files: HashMap<Vec<u8>, Vec<String>> = HashMap::new();
    let mut skipped = 0;
    for f in &files {
        let ext = Path::new(f).extension().and_then(|s| s.to_str()).unwrap_or("").to_string();
        let algo = default_config.choose_algorithm(&ext);
        let meta = match std::fs::metadata(f) {
            Ok(m) => m,
            Err(_) => continue,
        };
        let size = meta.len();
        let mtime = meta.modified().ok().and_then(|t| t.duration_since(UNIX_EPOCH).ok()).map(|d| d.as_secs()).unwrap_or(0);
        if let Some(entry) = cache.get(f) {
            if entry.size == size && entry.mtime == mtime {
                skipped += 1;
                hash_to_files.entry(entry.hash.clone()).or_default().push(f.clone());
                report.push(FileHashReport {
                    file: f.to_string(),
                    hash: hex::encode(&entry.hash),
                    algorithm: format!("{:?}", algo),
                });
                continue;
            }
        }
        let hash = crate::hashing::hash_file(f, algo.clone()).unwrap_or_default();
        cache.insert(f.clone(), FileHashCacheEntry { size, mtime, hash: hash.clone() });
        results.push((f.to_string(), hash.clone()));
        hash_to_files.entry(hash.clone()).or_default().push(f.clone());
        report.push(FileHashReport {
            file: f.to_string(),
            hash: hex::encode(&hash),
            algorithm: format!("{:?}", algo),
        });
        if !ext.is_empty() {
            algo_summary.entry(ext.clone()).or_insert_with(|| format!("{:?}", algo));
        }
        pb.inc(1);
    }
    pb.finish_with_message("done");
    save_cache(".dedcore_cache.json", &cache);
    if skipped > 0 {
        println!("Skipped {} unchanged files due to incremental scanning.", skipped);
    }
    
    if safe_delete {
        println!("\n=== Safe Delete Mode ===");
        
        let mut quarantine = match QuarantineManager::new() {
            Ok(qm) => qm,
            Err(e) => {
                eprintln!("Failed to initialize quarantine system: {}", e);
                return;
            }
        };
        
        let mut quarantined_count = 0;
        for (file_path, _) in &results {
            if let Err(e) = quarantine.quarantine_file(file_path) {
                eprintln!("Failed to quarantine {}: {}", file_path, e);
            } else {
                quarantined_count += 1;
            }
        }
        
        let (total_count, total_size) = quarantine.get_quarantine_stats();
        println!("Quarantined {} files ({:.2} MB)", total_count, 
                 total_size as f64 / 1024.0 / 1024.0);
        
        if commit {
            println!("\n=== Committing Deletions ===");
            match quarantine.commit_deletions() {
                Ok(deleted_count) => {
                    println!("Successfully deleted {} files", deleted_count);
                }
                Err(e) => {
                    eprintln!("Failed to commit deletions: {}", e);
                }
            }
        } else if rollback {
            println!("\n=== Rolling Back ===");
            match quarantine.rollback() {
                Ok(restored_count) => {
                    println!("Successfully restored {} files", restored_count);
                }
                Err(e) => {
                    eprintln!("Failed to rollback: {}", e);
                }
            }
        } else {
            println!("\n=== Quarantine Active ===");
            println!("Files are in quarantine. Use --commit to delete or --rollback to restore.");
        }
    }
    
    if let Some(ref jpath) = app.json_report {
        if let Ok(json) = serde_json::to_string_pretty(&report) {
            if let Err(e) = fs::write(jpath, json) {
                eprintln!("Failed to write JSON report: {}", e);
            } else {
                println!("JSON report written to {}", jpath);
            }
        } else {
            eprintln!("Failed to serialize JSON report");
        }
    }
    if let Some(ref hpath) = app.html_report {
        let mut html = String::from("<html><head><title>dedcore Report</title></head><body><h1>dedcore File Hash Report</h1><table border=1><tr><th>File</th><th>Hash</th><th>Algorithm</th></tr>");
        for r in &report {
            html.push_str(&format!("<tr><td>{}</td><td>{}</td><td>{}</td></tr>", r.file, r.hash, r.algorithm));
        }
        html.push_str("</table></body></html>");
        if let Err(e) = fs::write(hpath, html) {
            eprintln!("Failed to write HTML report: {}", hpath);
        } else {
            println!("HTML report written to {}", hpath);
        }
    }
    // Ask the user if they want to append the report after every scan
    if Confirm::new("Would you like to append this scan to dedcore_report.json and dedcore_report.html?")
        .with_default(true)
        .prompt()
        .unwrap_or(false)
    {
        let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        // JSON append
        let json_path = "dedcore_report.json";
        let mut all_scans = if let Ok(existing) = std::fs::read_to_string(json_path) {
            serde_json::from_str::<serde_json::Value>(&existing).unwrap_or_else(|_| serde_json::json!([]))
        } else {
            serde_json::json!([])
        };
        let mut duplicate_groups: Vec<Vec<String>> = Vec::new();
        let mut potential_space_savings: u64 = 0;
        for files in hash_to_files.values() {
            if files.len() > 1 {
                // Calculate space savings: sum size of all but one file
                let mut group_size = 0;
                for file in &files[1..] {
                    if let Ok(meta) = fs::metadata(file) {
                        group_size += meta.len();
                    }
                }
                potential_space_savings += group_size;
                duplicate_groups.push(files.clone());
            }
        }
        let scan_entry = serde_json::json!({
            "timestamp": timestamp,
            "results": report,
            "summary": {
                "processed_files": results.len(),
                "duplicate_groups": duplicate_groups.len(),
                "potential_space_savings_bytes": potential_space_savings,
                "potential_space_savings_mb": (potential_space_savings as f64 / 1024.0 / 1024.0),
            }
        });
        if let Some(arr) = all_scans.as_array_mut() {
            arr.push(scan_entry);
        }
        if let Ok(json) = serde_json::to_string_pretty(&all_scans) {
            if let Err(e) = std::fs::write(json_path, json) {
                eprintln!("Failed to write dedcore_report.json: {}", e);
            } else {
                println!("Appended scan to dedcore_report.json");
            }
        }
        // HTML append
        let html_path = "dedcore_report.html";
        let mut html = if let Ok(existing) = std::fs::read_to_string(html_path) {
            existing
        } else {
            String::from("<html><head><title>dedcore Report</title></head><body>")
        };
        html.push_str(&format!("<h2>Scan at {}</h2>", timestamp));
        html.push_str("<table border=1><tr><th>File</th><th>Hash</th><th>Algorithm</th></tr>");
        for r in &report {
            html.push_str(&format!("<tr><td>{}</td><td>{}</td><td>{}</td></tr>", r.file, r.hash, r.algorithm));
        }
        html.push_str("</table><br/>");
        if potential_space_savings > 0 {
            html.push_str(&format!("<p>Potential space savings: {:.2} MB</p>", potential_space_savings as f64 / 1024.0 / 1024.0));
        }
        if let Err(e) = std::fs::write(html_path, html.clone()) {
            eprintln!("Failed to write dedcore_report.html: {}", e);
        } else {
            println!("Appended scan to dedcore_report.html");
        }
    }
    println!("\nProcessed {} files.", results.len());

    if !algo_summary.is_empty() {
        println!("\nAlgorithm selection summary:");
        println!("{:<12} | {}", "File Type", "Algorithm");
        println!("{:-<12}-+-{:-<10}", "", "");
        for (ext, algo) in &algo_summary {
            println!("{:<12} | {}", ext, algo);
        }
    }

    // Group duplicates
    let mut duplicate_groups: Vec<Vec<String>> = Vec::new();
    let mut potential_space_savings: u64 = 0;
    for files in hash_to_files.values() {
        if files.len() > 1 {
            // Calculate space savings: sum size of all but one file
            let mut group_size = 0;
            for file in &files[1..] {
                if let Ok(meta) = fs::metadata(file) {
                    group_size += meta.len();
                }
            }
            potential_space_savings += group_size;
            duplicate_groups.push(files.clone());
        }
    }
    if potential_space_savings > 0 {
        println!("Potential space savings: {:.2} MB", potential_space_savings as f64 / 1024.0 / 1024.0);
    }

    if app.quarantine_all_dupes && !duplicate_groups.is_empty() {
        println!("\nFound {} groups of duplicates.", duplicate_groups.len());
        let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
        let mut quarantined = 0;
        for group in &duplicate_groups {
            // Keep the first file, quarantine the rest
            for file in &group[1..] {
                match qm.quarantine_file(file) {
                    Ok(_) => quarantined += 1,
                    Err(e) => println!("Failed to quarantine {}: {}", file, e),
                }
            }
        }
        println!("Quarantined {} duplicate files.", quarantined);
    }

    // === Content Similarity for Text Files ===
    // Optimization: Bucket by file size to avoid O(n^2) on large sets
    let text_exts = ["txt", "md", "rs", "py", "toml", "json", "csv", "log", "cfg", "ini", "yaml", "yml"];
    let mut text_buckets: std::collections::HashMap<u64, Vec<&String>> = std::collections::HashMap::new();
    for f in files.iter().filter(|f| {
        let ext = std::path::Path::new(f)
            .extension()
            .and_then(|s| s.to_str())
            .unwrap_or("")
            .to_lowercase();
        text_exts.contains(&ext.as_str())
    }) {
        // Only consider files not in any duplicate group
        if !hash_to_files.values().any(|group| group.contains(f) && group.len() > 1) {
            let size = std::fs::metadata(f).map(|m| m.len()).unwrap_or(0);
            text_buckets.entry(size).or_default().push(f);
        }
    }
    let mut similar_groups: Vec<Vec<String>> = Vec::new();
    let mut visited = std::collections::HashSet::new();
    let similarity_threshold = app.similarity_threshold.unwrap_or(0.8);
    // Use Rayon for parallel similarity if there are many files in a bucket
    for (_size, bucket) in text_buckets.iter() {
        if bucket.len() < 2 { continue; }
        let pairs: Vec<_> = (0..bucket.len())
            .flat_map(|i| (i+1..bucket.len()).map(move |j| (i, j)))
            .collect();
        let results: Vec<_> = if bucket.len() > 20 {
            use rayon::prelude::*;
            pairs.par_iter().map(|&(i, j)| {
                let f1 = bucket[i];
                let f2 = bucket[j];
                let text1 = std::fs::read_to_string(f1).unwrap_or_default();
                let text2 = std::fs::read_to_string(f2).unwrap_or_default();
                let max_len = text1.len().max(text2.len());
                if max_len == 0 { return None; }
                let dist = crate::similarity::levenshtein(&text1, &text2);
                let similarity = 1.0 - (dist as f64 / max_len as f64);
                if similarity >= similarity_threshold {
                    Some((f1, f2))
                } else {
                    None
                }
            }).collect()
        } else {
            pairs.iter().map(|&(i, j)| {
                let f1 = bucket[i];
                let f2 = bucket[j];
                let text1 = std::fs::read_to_string(f1).unwrap_or_default();
                let text2 = std::fs::read_to_string(f2).unwrap_or_default();
                let max_len = text1.len().max(text2.len());
                if max_len == 0 { return None; }
                let dist = crate::similarity::levenshtein(&text1, &text2);
                let similarity = 1.0 - (dist as f64 / max_len as f64);
                if similarity >= similarity_threshold {
                    Some((f1, f2))
                } else {
                    None
                }
            }).collect()
        };
        for pair in results.into_iter().flatten() {
            let (f1, f2) = pair;
            if visited.contains(f1) || visited.contains(f2) { continue; }
            similar_groups.push(vec![f1.to_string(), f2.to_string()]);
            visited.insert(f1);
            visited.insert(f2);
        }
    }
    if !similar_groups.is_empty() {
        println!("\n=== Similar Text File Groups (>= {:.0}% similar) ===", similarity_threshold * 100.0);
        for (i, group) in similar_groups.iter().enumerate() {
            println!("Group {}:", i + 1);
            for f in group {
                println!("  {}", f);
            }
            println!("");
        }
    }

    // === Image Similarity for Image Files ===
    // Optimization: Bucket by file size to avoid O(n^2) on large sets
    let image_exts = ["jpg", "jpeg", "png", "bmp", "gif", "webp"];
    let mut image_buckets: std::collections::HashMap<u64, Vec<&String>> = std::collections::HashMap::new();
    for f in files.iter().filter(|f| {
        let ext = std::path::Path::new(f)
            .extension()
            .and_then(|s| s.to_str())
            .unwrap_or("")
            .to_lowercase();
        image_exts.contains(&ext.as_str())
    }) {
        if !hash_to_files.values().any(|group| group.contains(f) && group.len() > 1) {
            let size = std::fs::metadata(f).map(|m| m.len()).unwrap_or(0);
            image_buckets.entry(size).or_default().push(f);
        }
    }
    let mut similar_image_groups: Vec<Vec<(String, f32)>> = Vec::new();
    let mut visited_images = std::collections::HashSet::<String>::new();
    let image_similarity_threshold = app.image_similarity_threshold.unwrap_or(0.9);
    for (_size, bucket) in image_buckets.iter() {
        if bucket.len() < 2 { continue; }
        let pairs: Vec<_> = (0..bucket.len())
            .flat_map(|i| (i+1..bucket.len()).map(move |j| (i, j)))
            .collect();
        let results: Vec<_> = if bucket.len() > 20 {
            use rayon::prelude::*;
            pairs.par_iter().map(|&(i, j)| {
                let f1 = bucket[i];
                let f2 = bucket[j];
                let hash1 = crate::similarity::average_hash_image(std::path::Path::new(f1)).ok();
                let hash2 = crate::similarity::average_hash_image(std::path::Path::new(f2)).ok();
                match (hash1, hash2) {
                    (Some(h1), Some(h2)) => {
                        let dist = crate::similarity::hamming_distance(h1, h2);
                        let similarity = 1.0 - (dist as f32 / 64.0);
                        if similarity >= image_similarity_threshold as f32 {
                            Some((f1, f2, similarity))
                        } else {
                            None
                        }
                    },
                    _ => None
                }
            }).collect()
        } else {
            pairs.iter().map(|&(i, j)| {
                let f1 = bucket[i];
                let f2 = bucket[j];
                let hash1 = crate::similarity::average_hash_image(std::path::Path::new(f1)).ok();
                let hash2 = crate::similarity::average_hash_image(std::path::Path::new(f2)).ok();
                match (hash1, hash2) {
                    (Some(h1), Some(h2)) => {
                        let dist = crate::similarity::hamming_distance(h1, h2);
                        let similarity = 1.0 - (dist as f32 / 64.0);
                        if similarity >= image_similarity_threshold as f32 {
                            Some((f1, f2, similarity))
                        } else {
                            None
                        }
                    },
                    _ => None
                }
            }).collect()
        };
        for triple in results.into_iter().flatten() {
            let (f1, f2, similarity) = triple;
            if visited_images.contains(f1) || visited_images.contains(f2) { continue; }
            similar_image_groups.push(vec![(f1.to_string(), 1.0), (f2.to_string(), similarity)]);
            visited_images.insert(f1.to_string());
            visited_images.insert(f2.to_string());
        }
    }
    if !similar_image_groups.is_empty() {
        println!("\n=== Similar Image File Groups (>= {:.0}% similar) ===", image_similarity_threshold * 100.0);
        for (i, group) in similar_image_groups.iter().enumerate() {
            println!("Group {}:", i + 1);
            for (f, sim) in group {
                println!("  {} ({:.0}%)", f, sim * 100.0);
            }
            println!("");
        }
    }

    // Add similar image groups to JSON/HTML reports if enabled
    let similar_image_groups_for_report: Vec<Vec<serde_json::Value>> = similar_image_groups.iter().map(|group| {
        group.iter().map(|(f, sim)| {
            serde_json::json!({"file": f, "similarity": (sim * 100.0) as u8})
        }).collect()
    }).collect();
    if let Some(ref jpath) = app.json_report {
        let mut report_json = serde_json::to_value(&report).unwrap_or(serde_json::json!([]));
        let mut obj = serde_json::Map::new();
        obj.insert("file_hash_report".to_string(), report_json);
        obj.insert("duplicate_groups".to_string(), serde_json::json!(duplicate_groups));
        obj.insert("similar_image_groups".to_string(), serde_json::json!(similar_image_groups_for_report));
        if let Err(e) = fs::write(jpath, serde_json::to_string_pretty(&obj).unwrap()) {
            eprintln!("Failed to write JSON report: {}", e);
        } else {
            println!("JSON report written to {}", jpath);
        }
    }
    if let Some(ref hpath) = app.html_report {
        let mut html = String::from("<html><head><title>dedcore Report</title></head><body><h1>dedcore File Hash Report</h1><table border=1><tr><th>File</th><th>Hash</th><th>Algorithm</th></tr>");
        for r in &report {
            html.push_str(&format!("<tr><td>{}</td><td>{}</td><td>{}</td></tr>", r.file, r.hash, r.algorithm));
        }
        html.push_str("</table>");
        if !duplicate_groups.is_empty() {
            html.push_str("<h2>Duplicate File Groups</h2>");
            for (i, group) in duplicate_groups.iter().enumerate() {
                html.push_str(&format!("<b>Group {}</b><ul>", i + 1));
                for f in group {
                    html.push_str(&format!("<li>{}</li>", f));
                }
                html.push_str("</ul>");
            }
        }
        if !similar_image_groups.is_empty() {
            html.push_str("<h2>Similar Image File Groups</h2>");
            for (i, group) in similar_image_groups.iter().enumerate() {
                html.push_str(&format!("<b>Group {}</b><ul>", i + 1));
                for (f, sim) in group {
                    html.push_str(&format!("<li>{} ({:.0}%)</li>", f, sim * 100.0));
                }
                html.push_str("</ul>");
            }
        }
        html.push_str("</body></html>");
        if let Err(e) = fs::write(hpath, html) {
            eprintln!("Failed to write HTML report: {}", hpath);
        } else {
            println!("HTML report written to {}", hpath);
        }
    }

    if let Some(cmd) = &app.cmd {
        match cmd {
            AppCmd::Quarantine(qcmd) => match qcmd {
                QuarantineCmd::File { file } => {
                    let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
                    match qm.quarantine_file(file) {
                        Ok(_) => println!("File quarantined: {}", file),
                        Err(e) => eprintln!("Failed to quarantine file: {}: {}", file, e),
                    }
                }
                QuarantineCmd::Commit => {
                    let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
                    match qm.commit_deletions() {
                        Ok(count) => println!("{} quarantined files permanently deleted.", count),
                        Err(e) => eprintln!("Failed to commit deletions: {}", e),
                    }
                }
                QuarantineCmd::Rollback => {
                    let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
                    match qm.rollback() {
                        Ok(count) => println!("{} quarantined files restored.", count),
                        Err(e) => eprintln!("Failed to rollback quarantined files: {}", e),
                    }
                }
                QuarantineCmd::List => {
                    let qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
                    let files = qm.list_quarantined_files();
                    if files.is_empty() {
                        println!("No files are currently quarantined.");
                    } else {
                        println!("Currently quarantined files:");
                        for rec in files {
                            println!("{} ({} bytes)", rec.original_path, rec.file_size);
                        }
                    }
                }
                QuarantineCmd::Restore { original_path } => {
                    let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
                    let files: Vec<_> = qm.list_quarantined_files().into_iter().cloned().collect();
                    let rec = files.iter().find(|rec| rec.original_path == *original_path);
                    if let Some(rec) = rec {
                        let quarantine_path = &rec.quarantine_path;
                        let original_path = &rec.original_path;
                        if std::path::Path::new(quarantine_path).exists() {
                            if let Some(parent) = std::path::Path::new(original_path).parent() {
                                let _ = std::fs::create_dir_all(parent);
                            }
                            match std::fs::rename(quarantine_path, original_path) {
                                Ok(_) => {
                                    println!("Restored {}", original_path);
                                    let _ = qm.remove_quarantined_file(original_path);
                                },
                                Err(e) => println!("Failed to restore {}: {}", original_path, e),
                            }
                        } else {
                            println!("Quarantined file not found: {}", quarantine_path);
                        }
                    } else {
                        println!("No quarantined entry found for {}", original_path);
                    }
                }
            },
            AppCmd::Recovery(rcmd) => match rcmd {
                RecoveryCmd::List => {
                    let log = crate::safety::QuarantineManager::read_recovery_log();
                    if log.is_empty() {
                        println!("No recovery history found.");
                    } else {
                        for entry in &log {
                            let ts = entry.get("timestamp").and_then(|v| v.as_str()).unwrap_or("");
                            let action = entry.get("action").and_then(|v| v.as_str()).unwrap_or("");
                            let path = entry.get("original_path").and_then(|v| v.as_str()).unwrap_or("");
                            println!("{} | {} | {}", ts, action, path);
                        }
                    }
                }
                RecoveryCmd::Restore { original_path } => {
                    let log = crate::safety::QuarantineManager::read_recovery_log();
                    let entry = log.iter().find(|e| e.get("original_path").and_then(|v| v.as_str()) == Some(original_path.as_str()) && e.get("action").and_then(|v| v.as_str()) == Some("quarantined"));
                    if let Some(entry) = entry {
                        let quarantine_path = entry.get("quarantine_path").and_then(|v| v.as_str()).unwrap();
                        if std::path::Path::new(quarantine_path).exists() {
                            if let Some(parent) = std::path::Path::new(original_path).parent() {
                                let _ = std::fs::create_dir_all(parent);
                            }
                            match std::fs::rename(quarantine_path, original_path) {
                                Ok(_) => println!("Restored {}", original_path),
                                Err(e) => println!("Failed to restore: {}", e),
                            }
                        } else {
                            println!("Quarantined file not found: {}", quarantine_path);
                        }
                    } else {
                        println!("No quarantined entry found for {}", original_path);
                    }
                }
            },
        }
        return;
    }
}

pub fn run() {
    run_with_args(std::env::args());
}

pub fn run_with_ui(path: String, security: String, speed: String) {
    use crate::hashing::{HashConfig, Security, Speed};
    use std::path::Path;
    use regex::Regex;
    let security = match security.to_lowercase().as_str() {
        "low" => Security::Low,
        "medium" => Security::Medium,
        "maximum" => Security::Maximum,
        _ => Security::High,
    };
    let speed = match speed.to_lowercase().as_str() {
        "fastest" => Speed::Fastest,
        "mostsecure" => Speed::MostSecure,
        _ => Speed::Balanced,
    };
    let default_policy = HashConfig::new(security, speed);
    let mut files: Vec<String> = Vec::new();
    let scan_target;
    if Path::new(&path).is_dir() {
        scan_target = format!("directory: {}", path);
        files = collect_files_recursively_with_filter(&path, None, None, None, None, None, None);
    } else if Path::new(&path).is_file() {
        scan_target = format!("file: {}", path);
        files.push(path.clone());
    } else {
        eprintln!("No valid file or directory found for: {}", path);
        return;
    }
    if files.is_empty() {
        eprintln!("No files found to hash.");
        return;
    }
    println!("\n=== DEDCORE File Hasher ===");
    println!("Scanning {}", scan_target);
    println!("Files to process: {}\n", files.len());
    let pb = indicatif::ProgressBar::new(files.len() as u64);
    pb.set_style(indicatif::ProgressStyle::with_template("[{elapsed_precise}] [{bar:40.cyan/blue}] {pos}/{len} {msg}")
        .unwrap()
        .progress_chars("##-"));
    let mut hash_to_files: HashMap<Vec<u8>, Vec<String>> = HashMap::new();
    let mut algo_summary: std::collections::BTreeMap<String, String> = std::collections::BTreeMap::new();
    for f in &files {
        let ext = Path::new(f).extension().and_then(|s| s.to_str()).unwrap_or("").to_string();
        let algo = default_policy.choose_algorithm(&ext);
        println!("[INFO] Using {:?} for '{}' (type: '{}', security: {:?}, speed: {:?})", algo, f, ext, default_policy.security, default_policy.speed);
        let hash = crate::hashing::hash_file(f, algo.clone()).unwrap_or_default();
        hash_to_files.entry(hash.clone()).or_default().push(f.clone());
        if !ext.is_empty() {
            algo_summary.entry(ext.clone()).or_insert_with(|| format!("{:?}", algo));
        }
        pb.inc(1);
    }
    pb.finish_with_message("done");
    if !algo_summary.is_empty() {
        println!("\nAlgorithm selection summary:");
        println!("{:<12} | {}", "File Type", "Algorithm");
        println!("{:-<12}-+-{:-<10}", "", "");
        for (ext, algo) in &algo_summary {
            println!("{:<12} | {}", ext, algo);
        }
    }
    // Group duplicates
    let mut duplicate_groups: Vec<Vec<String>> = Vec::new();
    let mut potential_space_savings: u64 = 0;
    for files in hash_to_files.values() {
        if files.len() > 1 {
            // Calculate space savings: sum size of all but one file
            let mut group_size = 0;
            for file in &files[1..] {
                if let Ok(meta) = fs::metadata(file) {
                    group_size += meta.len();
                }
            }
            potential_space_savings += group_size;
            duplicate_groups.push(files.clone());
        }
    }
    if potential_space_savings > 0 {
        println!("Potential space savings: {:.2} MB", potential_space_savings as f64 / 1024.0 / 1024.0);
    }
    if !duplicate_groups.is_empty() {
        println!("\nFound {} groups of duplicates.", duplicate_groups.len());
        if Confirm::new("Quarantine all duplicates (all but one per group)?")
            .with_default(false)
            .prompt()
            .unwrap_or(false)
        {
            let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
            let mut quarantined = 0;
            for group in &duplicate_groups {
                // Keep the first file, quarantine the rest
                for file in &group[1..] {
                    match qm.quarantine_file(file) {
                        Ok(_) => quarantined += 1,
                        Err(e) => println!("Failed to quarantine {}: {}", file, e),
                    }
                }
            }
            println!("Quarantined {} duplicate files.", quarantined);
        }
    }
}

