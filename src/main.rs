// Import from the library crate
use dedcore::*;

mod ui;  // Keep UI in the binary

fn main() {
    // Clear the terminal screen at program start
    print!("\x1B[2J\x1B[1;1H");
    use std::io::{Write, stdout};
    stdout().flush().ok();
    ui::show_loading_screen();
    loop {
        let action = ui::main_menu();
        if action == "Scan for Duplicates" {
            ui::scan_menu();
        } else if action == "Quarantine Operations" {
            ui::show_quarantine_menu();
        } else if action == "Help" {
            ui::show_help_menu();
        } else if action == "Exit" {
            println!("Goodbye!");
            break;
        }
    }
}
