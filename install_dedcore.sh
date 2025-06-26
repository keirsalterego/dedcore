#!/bin/bash
# Tip: If you see "Permission denied", run chmod +x install_dedcore.sh or use bash install_dedcore.sh
# Self-permission: re-exec with bash if not run as executable
if [ ! -x "$0" ]; then
    echo "[DedCore Installer] Re-running with bash for proper permissions..."
    exec bash "$0" "$@"
fi
set -e

# DedCore installer script

echo "[DedCore Installer]"

# Check for Rust and Cargo
if ! command -v cargo >/dev/null 2>&1; then
    echo "Rust and Cargo are not installed. Installing Rust..."
    if ! command -v curl >/dev/null 2>&1; then
        echo "curl is required to install Rust. Installing curl..."
        sudo apt-get update && sudo apt-get install -y curl
    fi
    curl https://sh.rustup.rs -sSf | sh -s -- -y
    export PATH="$HOME/.cargo/bin:$PATH"
    source "$HOME/.cargo/env"
fi

# Check for build-essential, pkg-config, libssl-dev (Debian/Ubuntu)
if command -v apt-get >/dev/null 2>&1; then
    for pkg in build-essential pkg-config libssl-dev; do
        if ! dpkg -s $pkg >/dev/null 2>&1; then
            echo "Installing missing dependency: $pkg"
            sudo apt-get update && sudo apt-get install -y $pkg
        fi
    done
fi

# Build the release binary
echo "Building DedCore in release mode..."
cargo build --release

# Find the binary
BIN_PATH="$(pwd)/target/release/dedcore"
if [ ! -f "$BIN_PATH" ]; then
    echo "Error: dedcore binary not found at $BIN_PATH. Build failed."
    exit 1
fi

# Copy to /usr/local/bin (requires sudo)
echo "Installing dedcore to /usr/local/bin (requires sudo)..."
sudo cp "$BIN_PATH" /usr/local/bin/dedcore
sudo chmod +x /usr/local/bin/dedcore

# Verify installation
echo -n "Installed version: "
/usr/local/bin/dedcore --version || echo "(run 'dedcore' to start)"

echo "\nDedCore installed successfully! You can now run 'dedcore' from any terminal." 