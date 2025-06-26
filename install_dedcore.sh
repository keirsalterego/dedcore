#!/bin/bash
# Tip: If you see "Permission denied", run chmod +x install_dedcore.sh or use bash install_dedcore.sh
# Self-permission: re-exec with bash if not run as executable
if [ ! -x "$0" ]; then
    echo "[DedCore Installer] Re-running with bash for proper permissions..."
    exec bash "$0" "$@"
fi
set -e

# ANSI color codes for branding and messages
RESET="\033[0m"
BOLD="\033[1m"
CYAN="\033[36m"
YELLOW="\033[33m"
GREEN="\033[32m"

# DedCore UI branding (matches show_loading_screen in src/ui.rs)
function dedcore_branding() {
    echo -e "${CYAN}"
    echo ""
    echo "  ██████╗ ███████╗██████╗  ██████╗ ██████╗ ██████╗ ███████╗"
    echo "  ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝"
    echo "  ██║  ██║█████╗  ██║  ██║██║     ██║   ██║██████╔╝█████╗  "
    echo "  ██║  ██║██╔══╝  ██║  ██║██║     ██║   ██║██╔══██╗██╔══╝  "
    echo "  ██████╔╝███████╗██████╔╝╚██████╗╚██████╔╝██║  ██║███████╗ v 0.1.0"
    echo "          DEDCORE"
    echo -e "${RESET}"
    echo -e "${YELLOW}dedcore: Oops, no more duplicates!${RESET}\n"
    echo -ne "${GREEN}Loading: ["
    for _ in {1..20}; do
        echo -ne "#"
        sleep 0.03
    done
    echo -e "]${RESET}\n"
    sleep 0.2
}

clear

dedcore_branding

echo -e "${BOLD}${CYAN}[DedCore Installer]${RESET}"

# Check for Rust and Cargo
echo -e "${YELLOW}Checking for Rust and Cargo...${RESET}"
if ! command -v cargo >/dev/null 2>&1; then
    echo -e "${RED}Rust and Cargo are not installed. Installing Rust...${RESET}"
    if ! command -v curl >/dev/null 2>&1; then
        echo -e "${YELLOW}curl is required to install Rust. Installing curl...${RESET}"
        sudo apt-get update && sudo apt-get install -y curl
    fi
    curl https://sh.rustup.rs -sSf | sh -s -- -y
    export PATH="$HOME/.cargo/bin:$PATH"
    source "$HOME/.cargo/env"
    echo -e "${GREEN}Rust installed successfully!${RESET}"
else
    echo -e "${GREEN}Rust and Cargo found.${RESET}"
fi

# Check for build-essential, pkg-config, libssl-dev (Debian/Ubuntu)
echo -e "${YELLOW}Checking for system dependencies...${RESET}"
if command -v apt-get >/dev/null 2>&1; then
    for pkg in build-essential pkg-config libssl-dev; do
        if ! dpkg -s $pkg >/dev/null 2>&1; then
            echo -e "${YELLOW}Installing missing dependency: $pkg${RESET}"
            sudo apt-get update && sudo apt-get install -y $pkg
        fi
    done
fi

echo -e "${CYAN}Building DedCore in release mode...${RESET}"
echo -ne "${GREEN}Compiling: ["
for _ in {1..30}; do echo -ne "#"; sleep 0.02; done; echo -e "]${RESET}"
cargo build --release

# Find the binary
BIN_PATH="$(pwd)/target/release/dedcore"
if [ ! -f "$BIN_PATH" ]; then
    echo -e "${RED}Error: dedcore binary not found at $BIN_PATH. Build failed.${RESET}"
    exit 1
fi

echo -e "${CYAN}Installing dedcore to /usr/local/bin (requires sudo)...${RESET}"
echo -ne "${GREEN}Installing: ["
for _ in {1..30}; do echo -ne "#"; sleep 0.01; done; echo -e "]${RESET}"
sudo cp "$BIN_PATH" /usr/local/bin/dedcore
sudo chmod +x /usr/local/bin/dedcore

# Verify installation
# echo -ne "${GREEN}Installed version: ${RESET}"
# /usr/local/bin/dedcore --version || echo "(run 'dedcore' to start)"

echo -e "\n${BOLD}${GREEN}DedCore installed successfully! You can now run 'dedcore' from any terminal.${RESET}\n" 