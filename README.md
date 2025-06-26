# dedcore

**Oops, no more duplicates!**

---

<p align="center">
  <img src="https://img.shields.io/badge/deduplication-awesome-brightgreen" alt="deduplication badge" />
  <img src="https://img.shields.io/badge/rust-🦀-orange" alt="rust badge" />
  <img src="https://img.shields.io/badge/cli-cool-blue" alt="cli badge" />
</p>

## 🚀 About

dedcore is an intelligent CLI tool and Rust crate for finding and removing duplicate and similar files. It aims to provide a robust, safe, and feature-rich deduplication experience for power users and professionals.

---

## 🗺️ Roadmap & Features

### Core Features
- ✅ **Multi-Algorithm Hashing:** SHA-256, Blake3, and xxHash for different use cases
- ✅ **Parallel Processing:** Rayon-based parallel file processing with progress tracking
- ✅ **Advanced Filtering:** Size ranges, file types, date ranges, regex patterns
- ✅ **Safe Operations:** Quarantine system before actual deletion
- ✅ **Detailed Reports:** JSON/HTML reports with file relationships and savings

### Advanced Features
- ✅ **Content Similarity:** Compare text files using edit distance algorithms
- ✅ **Image Similarity:** Perceptual hashing for images using image crate
- ✅ **Incremental Scanning:** Only scan changed files using modification times and checksums
- ✅ **Recovery System:** Maintain deletion history with rollback capabilities
- ✅ **Space Analysis:** Detailed breakdown of potential space savings (basic)

### Advanced Challenges
- ❌ **Sophisticated Grouping:** Group similar files by content, not just exact matches
- ✅ **Performance Optimization:** Memory-mapped files, efficient hash computation
- ❌ **Advanced Verification:** Multiple verification passes before deletion
- ❌ **Metadata Analysis:** Consider file attributes, EXIF data for better deduplication
- ❌ **Custom Algorithms:** Implement domain-specific similarity detection

---

## 📦 Installation

```bash
# Installation instructions coming soon
```

## 🛠️ Usage

```bash
# Usage examples coming soon
```

---

## 📚 License

MIT License