use std::path::PathBuf;
use clap::{Parser, Subcommand};
use crate::hashing::{hash_files_parallel, HashKind, HashingPolicy, Security, Speed};
use crate::safety::QuarantineManager;
use std::env;
use hex;
use std::fs;
use std::path::Path;
use walkdir;
use indicatif::{ProgressBar, ProgressStyle};
use std::time::{SystemTime, UNIX_EPOCH};
use regex::Regex;
use serde::Serialize;
use inquire::Confirm;
use std::collections::HashMap;

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
    pub command: Option<QuarantineCmd>,
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

pub fn run() {
    let app = App::parse();
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
    let default_policy = HashingPolicy::new(security, speed);
    let mut filetypes: Option<Vec<String>> = None;
    let mut min_size: Option<u64> = None;
    let mut max_size: Option<u64> = None;
    let mut min_age: Option<u64> = None;
    let mut max_age: Option<u64> = None;
    let mut regex_filter: Option<Regex> = None;
    let mut dry_run = app.dry;
    let mut quarantine_dir: Option<String> = None;
    let mut json_report: Option<String> = None;
    let mut html_report: Option<String> = None;
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
        if let Some(rest) = arg.strip_prefix("--json-report=") {
            json_report = Some(rest.to_string());
        }
        if let Some(rest) = arg.strip_prefix("--html-report=") {
            html_report = Some(rest.to_string());
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
    if let Some(ref jpath) = json_report {
        println!("JSON report: {}", jpath);
    }
    if let Some(ref hpath) = html_report {
        println!("HTML report: {}", hpath);
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
    let mut results = Vec::with_capacity(files.len());
    let mut report = Vec::with_capacity(files.len());
    let mut algo_summary: std::collections::BTreeMap<String, String> = std::collections::BTreeMap::new();
    let mut hash_to_files: HashMap<Vec<u8>, Vec<String>> = HashMap::new();
    for f in &files {
        let ext = Path::new(f).extension().and_then(|s| s.to_str()).unwrap_or("").to_string();
        let policy = default_policy.clone().with_file_type(ext.clone());
        let algo = policy.choose_algorithm();
        println!("[INFO] Using {:?} for '{}' (type: '{}', security: {:?}, speed: {:?})", algo, f, ext, policy.security, policy.speed);
        let hash = crate::hashing::hash_file(f, algo.clone()).unwrap_or_default();
        results.push((f.to_string(), hash.clone()));
        hash_to_files.entry(hash.clone()).or_default().push(f.clone());
        if json_report.is_some() || html_report.is_some() {
            report.push(FileHashReport {
                file: f.to_string(),
                hash: hex::encode(hash),
                algorithm: format!("{:?}", algo),
            });
        }
        if !ext.is_empty() {
            algo_summary.entry(ext.clone()).or_insert_with(|| format!("{:?}", algo));
        }
        pb.inc(1);
    }
    pb.finish_with_message("done");
    
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
    
    if let Some(ref jpath) = json_report {
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
    if let Some(ref hpath) = html_report {
        let mut html = String::from("<html><head><title>dedcore Report</title></head><body><h1>dedcore File Hash Report</h1><table border=1><tr><th>File</th><th>Hash</th><th>Algorithm</th></tr>");
        for r in &report {
            html.push_str(&format!("<tr><td>{}</td><td>{}</td><td>{}</td></tr>", r.file, r.hash, r.algorithm));
        }
        html.push_str("</table></body></html>");
        if let Err(e) = fs::write(hpath, html) {
            eprintln!("Failed to write HTML report: {}", e);
        } else {
            println!("HTML report written to {}", hpath);
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
    for files in hash_to_files.values() {
        if files.len() > 1 {
            duplicate_groups.push(files.clone());
        }
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

    if let Some(cmd) = &app.command {
        match cmd {
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
        }
        return;
    }
}

pub fn run_with_ui(path: String, security: String, speed: String) {
    use crate::hashing::{HashingPolicy, Security, Speed};
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
    let default_policy = HashingPolicy::new(security, speed);
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
        let policy = default_policy.clone().with_file_type(ext.clone());
        let algo = policy.choose_algorithm();
        println!("[INFO] Using {:?} for '{}' (type: '{}', security: {:?}, speed: {:?})", algo, f, ext, policy.security, policy.speed);
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
    for files in hash_to_files.values() {
        if files.len() > 1 {
            duplicate_groups.push(files.clone());
        }
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

