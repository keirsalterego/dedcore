use std::{thread, time::Duration};
use inquire::{Select, Text, Confirm};
use crate::safety::QuarantineManager;
use crate::cli;

pub fn show_loading_screen() {
    // ANSI color codes
    let cyan = "\x1b[36m";
    let yellow = "\x1b[33m";
    let green = "\x1b[32m";
    let reset = "\x1b[0m";
    println!(r#"{cyan}

      ██████╗ ███████╗██████╗  ██████╗ ██████╗ ██████╗ ███████╗
      ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
      ██║  ██║█████╗  ██║  ██║██║     ██║   ██║██████╔╝█████╗  
      ██║  ██║██╔══╝  ██║  ██║██║     ██║   ██║██╔══██╗██╔══╝  
      ██████╔╝███████╗██████╔╝╚██████╗╚██████╔╝██║  ██║███████╗ v 0.1.0
              DEDCORE
{reset}"#, cyan=cyan, reset=reset);
    println!("{yellow}dedcore: Oops, no more duplicates!{reset}\n", yellow=yellow, reset=reset);
    print!("{green}Loading: [", green=green);
    use std::io::{Write, stdout};
    let mut out = stdout();
    for _ in 0..20 {
        print!("#");
        out.flush().unwrap();
        thread::sleep(Duration::from_millis(30));
    }
    println!("]{reset}\n", reset=reset);
    thread::sleep(Duration::from_millis(200));
}

pub fn show_quarantine_menu() {
    loop {
        let options = vec![
            "Quarantine a File",
            "List Quarantined Files",
            "Commit Deletions",
            "Rollback Quarantined Files",
            "Back",
        ];
        let choice = Select::new("Quarantine Operations:", options.clone())
            .prompt()
            .unwrap_or_else(|_| "Back");
        if choice == "Quarantine a File" {
            let file = Text::new("Enter the path to the file you want to quarantine:")
                .prompt()
                .unwrap_or_default();
            if file.is_empty() {
                println!("No file path entered.");
                continue;
            }
            let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
            match qm.quarantine_file(&file) {
                Ok(_) => println!("File quarantined: {}", file),
                Err(e) => println!("Failed to quarantine file: {}: {}", file, e),
            }
        } else if choice == "List Quarantined Files" {
            let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
            let files_ref = qm.list_quarantined_files();
            if files_ref.is_empty() {
                println!("No files are currently quarantined.");
                continue;
            }
            // Collect owned records to avoid borrow checker issues
            let files: Vec<_> = files_ref.iter().map(|rec| (*rec).clone()).collect();
            let file_options: Vec<String> = files.iter().map(|rec| format!("{} ({} bytes)", rec.original_path, rec.file_size)).collect();
            let file_choice = Select::new("Select a file to manage:", [&file_options[..], &["Back".to_string()]].concat())
                .prompt()
                .unwrap_or_else(|_| "Back".to_string());
            if file_choice == "Back" {
                continue;
            }
            let idx = file_options.iter().position(|s| s == &file_choice);
            if let Some(i) = idx {
                let rec = &files[i];
                let action = Select::new(
                    &format!("What would you like to do with {}?", rec.original_path),
                    vec!["Restore (Rollback)", "Delete Permanently (Commit)", "Back"],
                )
                .prompt()
                .unwrap_or_else(|_| "Back");
                if action == "Restore (Rollback)" {
                    // Restore just this file
                    let quarantine_path = &rec.quarantine_path;
                    let original_path = &rec.original_path;
                    if std::path::Path::new(quarantine_path).exists() {
                        if let Some(parent) = std::path::Path::new(original_path).parent() {
                            let _ = std::fs::create_dir_all(parent);
                        }
                        match std::fs::rename(quarantine_path, original_path) {
                            Ok(_) => println!("Restored {}", original_path),
                            Err(e) => println!("Failed to restore {}: {}", original_path, e),
                        }
                    } else {
                        println!("Quarantined file not found: {}", quarantine_path);
                    }
                    // Remove from quarantine state
                    let _ = qm.remove_quarantined_file(original_path);
                } else if action == "Delete Permanently (Commit)" {
                    // Delete just this file
                    let quarantine_path = &rec.quarantine_path;
                    if std::path::Path::new(quarantine_path).exists() {
                        match std::fs::remove_file(quarantine_path) {
                            Ok(_) => println!("Deleted {}", quarantine_path),
                            Err(e) => println!("Failed to delete {}: {}", quarantine_path, e),
                        }
                    } else {
                        println!("Quarantined file not found: {}", quarantine_path);
                    }
                    // Remove from quarantine state
                    let _ = qm.remove_quarantined_file(&rec.original_path);
                } else {
                    continue;
                }
            }
        } else if choice == "Commit Deletions" {
            let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
            match qm.commit_deletions() {
                Ok(count) => println!("{} quarantined files permanently deleted.", count),
                Err(e) => println!("Failed to commit deletions: {}", e),
            }
        } else if choice == "Rollback Quarantined Files" {
            let mut qm = QuarantineManager::new().expect("Failed to create QuarantineManager");
            match qm.rollback() {
                Ok(count) => println!("{} quarantined files restored.", count),
                Err(e) => println!("Failed to rollback quarantined files: {}", e),
            }
        } else if choice == "Back" {
            break;
        }
    }
}

pub fn show_help_menu() {
    println!("\n=== DedCore Help ===");
    println!("- Use the arrow keys to navigate menus and Enter to select.");
    println!("- Main features:");
    println!("  * Scan for Duplicates: Find duplicate files in a directory.");
    println!("  * Quarantine Operations: Safely move, delete, or restore files.");
    println!("  * Commit Deletions: Permanently delete quarantined files.");
    println!("  * Rollback: Restore quarantined files to their original locations.");
    println!("- For more info, see the README or project documentation.\n");
    let _ = Text::new("Press Enter to return to the main menu...").prompt();
}

pub fn scan_menu() {
    // Path
    let path = select_path();
    if path.trim().is_empty() {
        println!("No path provided. Aborting scan.");
        return;
    }
    // Security
    let security = select_security();
    // Speed
    let speed = select_speed();
    // Filetypes
    let filetypes = Text::new("Filter by filetypes (comma-separated, leave blank for all):")
        .prompt()
        .unwrap_or_default();
    // Min size
    let min_size = Text::new("Minimum file size in bytes (leave blank for none):")
        .prompt()
        .unwrap_or_default();
    // Max size
    let max_size = Text::new("Maximum file size in bytes (leave blank for none):")
        .prompt()
        .unwrap_or_default();
    // Min age
    let min_age = Text::new("Minimum file age in days (leave blank for none):")
        .prompt()
        .unwrap_or_default();
    // Max age
    let max_age = Text::new("Maximum file age in days (leave blank for none):")
        .prompt()
        .unwrap_or_default();
    // Regex
    let regex = Text::new("Regex filter for file paths (leave blank for none):")
        .prompt()
        .unwrap_or_default();
    // Dry run
    let dry_run = Confirm::new("Dry run (show what would happen, but make no changes)?")
        .with_default(false)
        .prompt()
        .unwrap_or(false);
    // Quarantine all duplicates
    let quarantine_all = Confirm::new("Quarantine all duplicates (all but one per group) after scan?")
        .with_default(false)
        .prompt()
        .unwrap_or(false);
    // Similarity threshold for text file grouping
    let similarity_threshold = Text::new("Minimum similarity threshold for grouping similar text files (0.0-1.0, default: 0.8):")
        .with_placeholder("0.8")
        .prompt()
        .unwrap_or_default();
    // Build CLI args
    let mut args = vec!["dedcore".to_string()];
    args.push(path.clone());
    args.push(format!("--security={}", security));
    args.push(format!("--speed={}", speed));
    if !filetypes.is_empty() {
        args.push(format!("--filetypes={}", filetypes));
    }
    if !min_size.is_empty() {
        args.push(format!("--min-size={}", min_size));
    }
    if !max_size.is_empty() {
        args.push(format!("--max-size={}", max_size));
    }
    if !min_age.is_empty() {
        args.push(format!("--min-age={}", min_age));
    }
    if !max_age.is_empty() {
        args.push(format!("--max-age={}", max_age));
    }
    if !regex.is_empty() {
        args.push(format!("--regex={}", regex));
    }
    if dry_run {
        args.push("--dry".to_string());
    }
    if quarantine_all {
        args.push("--quarantine-all-dupes".to_string());
    }
    if !similarity_threshold.trim().is_empty() {
        if let Ok(val) = similarity_threshold.trim().parse::<f64>() {
            if val >= 0.0 && val <= 1.0 {
                args.push(format!("--similarity-threshold={}", val));
            } else {
                println!("Invalid similarity threshold, must be between 0.0 and 1.0. Using default (0.8).");
            }
        } else {
            println!("Invalid similarity threshold input. Using default (0.8).");
        }
    }
    // Call CLI logic with constructed args
    cli::run_with_args(args);
}

pub fn show_recovery_menu() {
    use inquire::{Select, Text, Confirm};
    use crate::safety::QuarantineManager;
    let log = QuarantineManager::read_recovery_log();
    let mut entries: Vec<String> = if log.is_empty() {
        vec!["No recovery entries found.".to_string()]
    } else {
        log.iter().map(|entry| {
            let ts = entry.get("timestamp").and_then(|v| v.as_str()).unwrap_or("");
            let action = entry.get("action").and_then(|v| v.as_str()).unwrap_or("");
            let path = entry.get("original_path").and_then(|v| v.as_str()).unwrap_or("");
            format!("{} | {} | {}", ts, action, path)
        }).collect()
    };
    let choice = Select::new("Select a recovery entry to view/restore:", [&entries[..], &["Back".to_string()]].concat())
        .prompt()
        .unwrap_or_else(|_| "Back".to_string());
    if choice == "Back" || choice == "No recovery entries found." {
        return;
    }
    let idx = entries.iter().position(|s| s == &choice);
    if let Some(i) = idx {
        let entry = &log[i];
        println!("\nEntry details:");
        println!("Timestamp: {}", entry.get("timestamp").and_then(|v| v.as_str()).unwrap_or(""));
        println!("Action: {}", entry.get("action").and_then(|v| v.as_str()).unwrap_or(""));
        println!("Original path: {}", entry.get("original_path").and_then(|v| v.as_str()).unwrap_or(""));
        println!("Quarantine path: {}", entry.get("quarantine_path").and_then(|v| v.as_str()).unwrap_or(""));
        println!("File size: {} bytes", entry.get("file_size").and_then(|v| v.as_u64()).unwrap_or(0));
        let can_restore = entry.get("action").and_then(|v| v.as_str()) == Some("quarantined") &&
            entry.get("quarantine_path").and_then(|v| v.as_str()).map(|qp| std::path::Path::new(qp).exists()).unwrap_or(false);
        if can_restore {
            if Confirm::new("Restore this file from quarantine?").with_default(false).prompt().unwrap_or(false) {
                let quarantine_path = entry.get("quarantine_path").and_then(|v| v.as_str()).unwrap();
                let original_path = entry.get("original_path").and_then(|v| v.as_str()).unwrap();
                if let Some(parent) = std::path::Path::new(original_path).parent() {
                    let _ = std::fs::create_dir_all(parent);
                }
                match std::fs::rename(quarantine_path, original_path) {
                    Ok(_) => println!("Restored {}", original_path),
                    Err(e) => println!("Failed to restore: {}", e),
                }
            }
        } else {
            println!("This file cannot be restored (already deleted or not in quarantine).");
        }
        let _ = Text::new("Press Enter to return...").prompt();
    }
}

pub fn main_menu() -> String {
    let options = vec!["Scan for Duplicates", "Quarantine Operations", "Recovery", "Help", "Exit"];
    Select::new("What would you like to do?", options)
        .prompt()
        .map(|s| s.to_string())
        .unwrap_or_else(|_| "Exit".to_string())
}

pub fn select_path() -> String {
    Text::new("Paste the path to a file or directory:")
        .prompt()
        .unwrap_or_else(|_| String::new())
}

pub fn select_security() -> String {
    let options = vec!["high", "maximum", "medium", "low"];
    Select::new("Select security level:", options)
        .prompt()
        .map(|s| s.to_string())
        .unwrap_or_else(|_| "high".to_string())
}

pub fn select_speed() -> String {
    let options = vec!["balanced", "fastest", "mostsecure"];
    Select::new("Select speed preference:", options)
        .prompt()
        .map(|s| s.to_string())
        .unwrap_or_else(|_| "balanced".to_string())
} 