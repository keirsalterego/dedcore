mod cli;
mod hashing;
mod similarity;
mod safety;
mod ui;

fn main() {
    ui::show_loading_screen();
    loop {
        let action = ui::main_menu();
        if action == "Scan for Duplicates" {
            let path = ui::select_path();
            let security = ui::select_security();
            let speed = ui::select_speed();
            cli::run_with_ui(path, security, speed);
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
