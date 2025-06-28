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

REPO="manishyoudumb/dedcore"

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"

if [[ "$OS" == "Linux" ]]; then
    BINARY_NAME="dedcore"
elif [[ "$OS" == "Darwin" ]]; then
    BINARY_NAME="dedcore"
elif grep -qi microsoft /proc/version 2>/dev/null; then
    # WSL
    BINARY_NAME="dedcore.exe"
else
    echo "Unsupported OS: $OS"
    exit 1
fi

# Get latest release download URL for the correct binary
BINARY_URL=$(curl -s https://api.github.com/repos/$REPO/releases/latest | grep browser_download_url | grep "$BINARY_NAME\"" | cut -d '"' -f 4 | head -n1)

if [[ -z "$BINARY_URL" ]]; then
    echo "Could not find a release binary for $BINARY_NAME"
    exit 1
fi

DEST="/usr/local/bin/$BINARY_NAME"

echo "Downloading $BINARY_NAME from $BINARY_URL ..."
sudo curl -L "$BINARY_URL" -o "$DEST"
sudo chmod +x "$DEST"

echo "DedCore installed to $DEST"
"$DEST" --version || true

# Add to PATH if needed
if ! command -v dedcore >/dev/null 2>&1; then
    if [[ "$OS" == "Darwin" && "$ARCH" == "arm64" ]]; then
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