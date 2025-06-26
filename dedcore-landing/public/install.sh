#!/bin/bash
set -e

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