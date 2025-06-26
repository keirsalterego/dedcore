#!/bin/bash
# Tip: If you see "Permission denied", run chmod +x uninstall-dedcore.sh or use bash uninstall-dedcore.sh
# Self-permission: re-exec with bash if not run as executable
if [ ! -x "$0" ]; then
    echo "[DedCore Uninstaller] Re-running with bash for proper permissions..."
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

echo -e "${BOLD}${CYAN}[DedCore Uninstaller]${RESET}"

if [ -f "/usr/local/bin/dedcore" ]; then
    echo "Removing /usr/local/bin/dedcore (requires sudo)..."
    sudo rm /usr/local/bin/dedcore
    echo "DedCore has been uninstalled."
else
    echo "DedCore binary not found at /usr/local/bin/dedcore. Nothing to uninstall."
fi 