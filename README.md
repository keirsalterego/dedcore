<div align="center">

```
      ██████╗ ███████╗██████╗  ██████╗ ██████╗ ██████╗ ███████╗
      ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
      ██║  ██║█████╗  ██║  ██║██║     ██║   ██║██████╔╝█████╗  
      ██║  ██║██╔══╝  ██║  ██║██║     ██║   ██║██╔══██╗██╔══╝  
        ██████╔╝███████╗██████╔╝╚██████╗╚██████╔╝██║  ██║███████╗ v 0.1.0
              DEDCORE
```


# DedCore: Because Your Storage Space Deserves Better

> *"I'm not saying you have a hoarding problem, but your hard drive called..."*

[![Crates.io](https://img.shields.io/crates/v/dedcore?style=for-the-badge&logo=rust&color=orange)](https://crates.io/crates/dedcore)
[![Documentation](https://img.shields.io/badge/docs-latest-brightgreen?style=for-the-badge&logo=read-the-docs)](https://docs.rs/dedcore/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/manishyoudumb/dedcore/rust.yml?branch=main&style=for-the-badge&logo=github-actions)](https://github.com/manishyoudumb/dedcore/actions)
[![codecov](https://img.shields.io/codecov/c/github/manishyoudumb/dedcore?style=for-the-badge&logo=codecov&token=YOUR_TOKEN_HERE)](https://codecov.io/gh/manishyoudumb/dedcore)
[![Dependency Status](https://deps.rs/repo/github/manishyoudumb/dedcore/status.svg?style=for-the-badge)](https://deps.rs/repo/github/manishyoudumb/dedcore)
[![Rust Version](https://img.shields.io/badge/rust-1.70%2B-orange?style=for-the-badge&logo=rust)](https://www.rust-lang.org/)
[![Platforms](https://img.shields.io/badge/Platform-Linux%20%7C%20macOS%20%7C%20Windows-blue?style=for-the-badge&logo=linux&logoColor=white)](https://github.com/manishyoudumb/dedcore)
[![Downloads](https://img.shields.io/crates/d/dedcore?style=for-the-badge&logo=rust)](https://crates.io/crates/dedcore)
[![Discord](https://img.shields.io/discord/your-discord-server?style=for-the-badge&logo=discord&color=7289DA)](https://discord.gg/your-invite-link)
[![Twitter Follow](https://img.shields.io/twitter/follow/your-twitter?style=for-the-badge&logo=twitter&color=1DA1F2)](https://twitter.com/your-twitter)

</div>

## 🚀 Features That Won't Make You Cry

<div align="center">

[![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Performance](https://img.shields.io/badge/performance-%20%20%20%20%20%20%20%20-9cf?style=for-the-badge&logo=rust&logoColor=white)]()
[![Security](https://img.shields.io/badge/security-100%25-brightgreen?style=for-the-badge&logo=securityscorecard&logoColor=white)]()
[![Easy to Use](https://img.shields.io/badge/easy%20to%20use-%E2%9C%94%EF%B8%8F-brightgreen?style=for-the-badge)]()

</div>

### Core Superpowers
- 🦸 **Multi-Algorithm Hashing**: SHA-256, Blake3, and xxHash walk into a bar... your files don't stand a chance
- ⚡ **Parallel Processing**: Because watching paint dry is only fun the first 10,000 times
- 🎯 **Smart Filtering**: Size, type, age, regex - because not all files are created equal (but some are exactly equal)
- 🛡️ **Safe Mode**: Quarantine before delete - like a witness protection program for your files
- 📊 **Fancy Reports**: JSON/HTML reports so detailed they make your cat photos jealous

### Advanced Magic
- 🔍 **Text Similarity**: Finds files that are suspiciously similar (great for finding that essay you rewrote 14 times)
- 🖼️ **Image Dedupe**: Because you don't need 37 copies of the same cat picture (or do you?)
- ⏱️ **Incremental Scans**: Only checks what's changed - like a detective who's good at their job
- ⏮️ **Undo Button**: Because sometimes you DO need that 14th copy of the cat picture
- 💾 **Space Analysis**: Shows you exactly how much space you'll save (spoiler: it's never enough)

---

## 🛠️ Installation: Choose Your Own Adventure

<div align="center">

[![Cargo Install](https://img.shields.io/badge/cargo%20install-dedcore-orange?style=for-the-badge&logo=rust&logoColor=white)]()
[![AUR](https://img.shields.io/aur/version/dedcore?color=1793D1&label=AUR&logo=arch-linux&style=for-the-badge)]()
[![Homebrew](https://img.shields.io/badge/homebrew-install-555555?style=for-the-badge&logo=homebrew)]()

</div>

### The "I Trust Random Internet Code" Method (Recommended)
```bash
# Install via cargo (requires Rust toolchain)
cargo install dedcore

# Add to PATH (because typing the full path is so 1990s)
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc  # or ~/.zshrc
source ~/.bashrc  # or restart your terminal
```

### The "I Like to Live Dangerously" Method
```bash
# Build from source (for the truly brave)
git clone https://github.com/manishyoudumb/dedcore.git
cd dedcore
cargo build --release
# The binary is now in ./target/release/dedcore
```

### The "I Use Arch BTW" Method
```bash
yay -S dedcore  # Coming soon to an AUR near you!
```

---

## 🎯 Usage: It's Like Magic, But With More Buttons

### Getting Started
Just run `dedcore` in your terminal and let the beautiful TUI guide you through the process:

```bash
dedcore
```

### What to Expect
1. **Main Menu**: Choose between scanning for duplicates, managing quarantined files, or getting help
2. **Interactive Scanning**:
   - Select directories to scan
   - Choose file types to include or exclude
   - Set similarity thresholds with easy sliders
   - Preview results before taking any action
3. **Quarantine Management**:
   - Review and manage quarantined files
   - Restore files if you change your mind
   - Permanently delete when you're ready

### Pro Tips
- Use arrow keys to navigate
- Press `Tab` to switch between elements
- `Enter` selects the highlighted option
- `Esc` or `q` to go back/exit

---

## 🚧 Upcoming Features (AKA The "We're Working On It" Section)

### Coming Soon™
- 🤖 **AI-Powered Dedupe**: Because sometimes only AI can understand why you have 37 versions of the same document
- 🌐 **Cloud Integration**: Because the cloud is just someone else's computer
- 📱 **Mobile App**: For when you need to dedupe on the go (we don't judge)
- 🎨 **Better UI**: Because terminal colors are nice, but have you seen gradients?

### Future Dreams (AKA The "Maybe One Day" List)
- 🔮 **Predictive Dedupe**: Knows what you're going to duplicate before you do
- 🧠 **Blockchain Integration**: Because why not make deduplication 1000x slower?
- 🤖 **Robot Butler**: Optional feature that also makes you coffee (batteries not included)

---

## 🤝 Contributing

Found a bug? Have a feature request? Want to make fun of our code? We'd love to hear from you!

1. Fork it (please be gentle)
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -am 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request (and pray to the merge gods)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 

*Disclaimer: We're not responsible for any existential crises caused by realizing how many duplicate files you actually have.*

---

## 💖 Support

If you like DedCore, consider giving it a ⭐ on GitHub or buying us a coffee (or a new hard drive):

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/yourusername)

---

*Made with ❤️, 🦀, and way too many duplicate files.*


### Text Similarity Options

- Minimum similarity threshold (0.0 to 1.0) for grouping text files
  - 1.0 = files must be identical
  - 0.8 = files must be at least 80% similar
  - Lower values will group more files together

- Supported text file extensions: `.txt`, `.md`, `.rs`, `.py`, `.js`, `.ts`, `.java`, `.c`, `.cpp`, `.h`, `.hpp`, `.html`, `.css`, `.json`, `.toml`, `.yaml`, `.yml`, `.xml`, `.csv`, `.log`

### Image Similarity

### Finding Similar Images

DedCore's TUI makes it easy to find similar images:
1. Select "Scan for Duplicates" from the main menu
2. Choose the directory containing your images
3. Adjust the similarity threshold using the intuitive slider
4. Let DedCore do its magic!

#### How It Works

Image similarity is calculated using perceptual hashing algorithms that generate fingerprints of images. These fingerprints can be compared to determine how similar two images are, even if they have different sizes, formats, or minor modifications.

---

## 📚 License

MIT License
