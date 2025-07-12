#!/bin/bash
set -e

# Create release build
echo "Building release..."
cargo build --release

# Create directories for packaging
mkdir -p dist/{homebrew,debian,chocolatey}

# Copy release binary for Windows
echo "Preparing Windows package..."
mkdir -p packaging/chocolatey/tools
cp target/release/dedcore.exe packaging/chocolatey/tools/

# Create Debian package
echo "Preparing Debian package..."
mkdir -p packaging/debian/DEBIAN
cp packaging/debian/control packaging/debian/DEBIAN/
cp packaging/debian/rules packaging/debian/DEBIAN/
cp packaging/debian/compat packaging/debian/DEBIAN/

echo "Packages prepared in the dist/ directory"
