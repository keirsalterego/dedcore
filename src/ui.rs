use std::{thread, time::Duration};
use inquire::{Select, Text};
use crate::safety::QuarantineManager;

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

pub fn main_menu() -> String {
    let options = vec!["Scan for Duplicates", "Quarantine Operations", "Help", "Exit"];
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