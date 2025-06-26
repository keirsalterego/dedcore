# DedCore Windows Installer (install.ps1)
# Run in PowerShell as: powershell -ExecutionPolicy Bypass -File install.ps1

function Write-Color($Text, $Color="Cyan") {
    Write-Host $Text -ForegroundColor $Color
}

function DedCore-Branding {
    Write-Host ""
    Write-Color "  ██████╗ ███████╗██████╗  ██████╗ ██████╗ ██████╗ ███████╗" Cyan
    Write-Color "  ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝" Cyan
    Write-Color "  ██║  ██║█████╗  ██║  ██║██║     ██║   ██║██████╔╝█████╗  " Cyan
    Write-Color "  ██║  ██║██╔══╝  ██║  ██║██║     ██║   ██║██╔══██╗██╔══╝  " Cyan
    Write-Color "  ██████╔╝███████╗██████╔╝╚██████╗╚██████╔╝██║  ██║███████╗ v 0.1.0" Cyan
    Write-Color "          DEDCORE" Cyan
    Write-Host ""
    Write-Color "dedcore: Oops, no more duplicates!" Yellow
    Write-Host ""
    Write-Host -NoNewline ("Loading: [")
    for ($i=0; $i -lt 20; $i++) {
        Write-Host -NoNewline "#" -ForegroundColor Green
        Start-Sleep -Milliseconds 20
    }
    Write-Host ("]")
    Start-Sleep -Milliseconds 100
    Write-Host ""
}

function Error-Exit($msg) {
    Write-Color "`nERROR: $msg`n" Red
    exit 1
}

trap { Error-Exit "An unexpected error occurred. Please check the output above for details." }

Clear-Host
DedCore-Branding

Write-Color "[DedCore Installer]" Cyan

# Check for Rust
try {
    if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
        Write-Color "Rust not found. Installing Rust..." Yellow
        $rustup = "$env:TEMP\\rustup-init.exe"
        Invoke-WebRequest -Uri https://win.rustup.rs/ -OutFile $rustup -ErrorAction Stop
        Start-Process -Wait -FilePath $rustup -ArgumentList "-y"
        Remove-Item $rustup
        $env:PATH += ";$env:USERPROFILE\.cargo\bin"
        Write-Color "Rust installed successfully!" Green
    } else {
        Write-Color "Rust found." Green
    }
} catch {
    Error-Exit "Failed to install Rust. $_"
}

# Check for Visual Studio Build Tools (cl.exe)
try {
    if (-not (Get-Command cl.exe -ErrorAction SilentlyContinue)) {
        Write-Color "Visual Studio Build Tools not found." Yellow
        Write-Color "Please install 'Desktop development with C++' using Visual Studio Installer." Yellow
        Write-Color "See: https://visualstudio.microsoft.com/visual-cpp-build-tools/" Yellow
        Read-Host "Press Enter to continue after installing build tools"
    }
} catch {
    Error-Exit "Failed to check for Visual Studio Build Tools. $_"
}

# Build DedCore
try {
    Write-Color "Building DedCore in release mode..." Cyan
    Write-Host -NoNewline ("Compiling: [")
    for ($i=0; $i -lt 30; $i++) {
        Write-Host -NoNewline "#" -ForegroundColor Green
        Start-Sleep -Milliseconds 10
    }
    Write-Host ("]")
    cargo build --release
} catch {
    Error-Exit "Build failed. Please check the output above. $_"
}

# Install binary
try {
    $binPath = Join-Path (Get-Location) "target\release\dedcore.exe"
    $destDir = "$env:USERPROFILE\.cargo\bin"
    $dest = Join-Path $destDir "dedcore.exe"
    if (-not (Test-Path $binPath)) {
        Error-Exit "dedcore.exe not found at $binPath. Build failed."
    }
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir | Out-Null
    }
    Copy-Item $binPath $dest -Force
} catch {
    Error-Exit "Failed to copy dedcore.exe to $destDir. $_"
}

# Add to PATH if needed
try {
    $envPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    if ($envPath -notlike "*$destDir*") {
        [System.Environment]::SetEnvironmentVariable("PATH", "$envPath;$destDir", "User")
        Write-Color "Added $destDir to your user PATH." Green
    }
} catch {
    Write-Color "Warning: Could not update your PATH automatically. Please add $destDir to your PATH manually." Yellow
}

Write-Host ""
Write-Color "DedCore installed successfully! You can now run 'dedcore' from any terminal." Green
Write-Color "You may need to restart your terminal or log out/in for PATH changes to take effect." Yellow 