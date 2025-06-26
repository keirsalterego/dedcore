#!/bin/bash
# Tip: If you see "Permission denied", run chmod +x uninstall-dedcore.sh or use bash uninstall-dedcore.sh
# Self-permission: re-exec with bash if not run as executable
if [ ! -x "$0" ]; then
    echo "[DedCore Uninstaller] Re-running with bash for proper permissions..."
    exec bash "$0" "$@"
fi
set -e

echo "[DedCore Uninstaller]"

if [ -f "/usr/local/bin/dedcore" ]; then
    echo "Removing /usr/local/bin/dedcore (requires sudo)..."
    sudo rm /usr/local/bin/dedcore
    echo "DedCore has been uninstalled."
else
    echo "DedCore binary not found at /usr/local/bin/dedcore. Nothing to uninstall."
fi 