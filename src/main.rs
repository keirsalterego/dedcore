mod cli;
mod hashing;
mod similarity;
mod safety;
mod ui;

fn main() {
    ui::show_loading_screen();
    let action = ui::main_menu();
    if action == "Scan for Duplicates" {
        let path = ui::select_path();
        let security = ui::select_security();
        let speed = ui::select_speed();
        cli::run_with_ui(path, security, speed);
    } else {
        println!("Goodbye!");
    }
}
