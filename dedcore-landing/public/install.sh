#!/bin/bash
# DedCore Cross-Platform Installer (Linux/macOS)
# Tip: If you see "Permission denied", run chmod +x install.sh or use bash install.sh
set -e

RESET="\033[0m"
BOLD="\033[1m"
CYAN="\033[36m"
YELLOW="\033[33m"
GREEN="\033[32m"
RED="\033[31m"

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
        sleep 0.02
    done
    echo -e "]${RESET}\n"
    sleep 0.1
}

function error_exit() {
    echo -e "\n${RED}ERROR: $1${RESET}\n"
    exit 1
}

trap 'error_exit "An unexpected error occurred. Please check the output above for details."' ERR

clear
dedcore_branding

echo -e "${BOLD}${CYAN}[DedCore Installer]${RESET}"

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"
if [[ "$OS" == "Linux" ]]; then
    PLATFORM="linux"
elif [[ "$OS" == "Darwin" ]]; then
    PLATFORM="macos"
else
    error_exit "Unsupported OS: $OS. This installer supports Linux and macOS only."
fi

# Check for Rust
if ! command -v cargo >/dev/null 2>&1; then
    echo -e "${YELLOW}Rust not found. Installing Rust...${RESET}"
    if ! command -v curl >/dev/null 2>&1; then
        echo -e "${YELLOW}curl is required. Installing curl...${RESET}"
        if command -v apt-get >/dev/null 2>&1; then
            sudo apt-get update && sudo apt-get install -y curl || error_exit "Failed to install curl."
        elif command -v dnf >/dev/null 2>&1; then
            sudo dnf install -y curl || error_exit "Failed to install curl."
        elif command -v yum >/dev/null 2>&1; then
            sudo yum install -y curl || error_exit "Failed to install curl."
        elif command -v zypper >/dev/null 2>&1; then
            sudo zypper install -y curl || error_exit "Failed to install curl."
        elif command -v brew >/dev/null 2>&1; then
            brew install curl || error_exit "Failed to install curl."
        else
            error_exit "Could not install curl. Please install it manually."
        fi
    fi
    curl https://sh.rustup.rs -sSf | sh -s -- -y || error_exit "Failed to install Rust."
    export PATH="$HOME/.cargo/bin:$PATH"
    source "$HOME/.cargo/env"
    echo -e "${GREEN}Rust installed successfully!${RESET}"
else
    echo -e "${GREEN}Rust found.${RESET}"
fi

# Install build dependencies
if [[ "$PLATFORM" == "linux" ]]; then
    echo -e "${YELLOW}Checking for build dependencies...${RESET}"
    if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update || error_exit "Failed to update package list."
        sudo apt-get install -y build-essential pkg-config libssl-dev || error_exit "Failed to install build dependencies."
    elif command -v dnf >/dev/null 2>&1; then
        sudo dnf install -y make gcc pkg-config openssl-devel || error_exit "Failed to install build dependencies."
    elif command -v yum >/dev/null 2>&1; then
        sudo yum install -y make gcc pkg-config openssl-devel || error_exit "Failed to install build dependencies."
    elif command -v zypper >/dev/null 2>&1; then
        sudo zypper install -y -t pattern devel_C_C++ || error_exit "Failed to install C/C++ development pattern."
        sudo zypper install -y pkg-config libopenssl-devel || error_exit "Failed to install build dependencies."
    fi
elif [[ "$PLATFORM" == "macos" ]]; then
    echo -e "${YELLOW}Checking for Xcode Command Line Tools and Homebrew...${RESET}"
    if ! xcode-select -p >/dev/null 2>&1; then
        echo -e "${YELLOW}Installing Xcode Command Line Tools...${RESET}"
        xcode-select --install || true
    fi
    if ! command -v brew >/dev/null 2>&1; then
        echo -e "${YELLOW}Homebrew not found. Installing Homebrew...${RESET}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || error_exit "Failed to install Homebrew."
        eval "$($(brew --prefix)/bin/brew shellenv)"
    fi
    brew install openssl pkg-config || error_exit "Failed to install build dependencies with Homebrew."
fi

# Build DedCore
echo -e "${CYAN}Building DedCore in release mode...${RESET}"
echo -ne "${GREEN}Compiling: ["
for _ in {1..30}; do echo -ne "#"; sleep 0.01; done; echo -e "]${RESET}"
cargo build --release || error_exit "Build failed. Please check the output above."

# Install binary
if [[ "$PLATFORM" == "linux" ]]; then
    DEST="/usr/local/bin/dedcore"
elif [[ "$PLATFORM" == "macos" ]]; then
    if [[ "$ARCH" == "arm64" ]]; then
        DEST="/opt/homebrew/bin/dedcore"
    else
        DEST="/usr/local/bin/dedcore"
    fi
fi
BIN_PATH="$(pwd)/target/release/dedcore"
if [ ! -f "$BIN_PATH" ]; then
    error_exit "dedcore binary not found at $BIN_PATH. Build failed."
fi
sudo cp "$BIN_PATH" "$DEST" || error_exit "Failed to copy dedcore binary to $DEST."
sudo chmod +x "$DEST" || error_exit "Failed to set executable permissions on $DEST."

# Add to PATH if needed
if ! command -v dedcore >/dev/null 2>&1; then
    if [[ "$PLATFORM" == "macos" && "$ARCH" == "arm64" ]]; then
        if [[ ":$PATH:" != *":/opt/homebrew/bin:"* ]]; then
            echo 'export PATH="/opt/homebrew/bin:$PATH"' >> "$HOME/.zshrc"
            export PATH="/opt/homebrew/bin:$PATH"
        fi
    else
        if [[ ":$PATH:" != *":/usr/local/bin:"* ]]; then
            echo 'export PATH="/usr/local/bin:$PATH"' >> "$HOME/.bashrc"
            export PATH="/usr/local/bin:$PATH"
        fi
    fi
fi

echo -e "\n${BOLD}${GREEN}DedCore installed successfully! You can now run 'dedcore' from any terminal.${RESET}\n" 