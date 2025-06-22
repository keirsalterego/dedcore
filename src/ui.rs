use std::{thread, time::Duration};
use inquire::{Select, Text};

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

pub fn main_menu() -> String {
    let options = vec!["Scan for Duplicates", "Exit"];
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