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
- ✅ **Text Similarity:** Find similar text files using Levenshtein distance algorithm

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

### Basic Usage

```bash
# Find and group similar text files (threshold: 0.8 = 80% similarity)
dedcore --similarity-threshold 0.8 /path/to/text/files

# Find similar text files with a higher threshold (more strict matching)
dedcore --similarity-threshold 0.9 /path/to/text/files

# Process only specific file types
dedcore --filetypes=txt,md,rs --similarity-threshold 0.8 /path/to/files
```

### Text Similarity Options

- `--similarity-threshold FLOAT`: Minimum similarity threshold (0.0 to 1.0) for grouping text files
  - 1.0 = files must be identical
  - 0.8 = files must be at least 80% similar
  - Lower values will group more files together

- Supported text file extensions: `.txt`, `.md`, `.rs`, `.py`, `.js`, `.ts`, `.java`, `.c`, `.cpp`, `.h`, `.hpp`, `.html`, `.css`, `.json`, `.toml`, `.yaml`, `.yml`, `.xml`, `.csv`, `.log`

### Image Similarity

dedcore supports multiple image hashing algorithms to find similar images:

```bash
# Find similar images with default algorithm (Combined)
dedcore --image-similarity-threshold 0.9 /path/to/images

# Specify the hashing algorithm to use
dedcore --image-hash-algorithm avg --image-similarity-threshold 0.85 /path/to/images
```

#### Image Hashing Algorithms

- `--image-hash-algorithm ALGO`: Choose the image hashing algorithm to use:
  - `avg`: Average Hash (fastest but less accurate)
  - `phash`: Perceptual Hash (more accurate but slower)
  - `dhash`: Difference Hash (good balance of speed and accuracy)
  - `color`: Color Hash (focuses on color distribution)
  - `combined`: Uses multiple algorithms for highest accuracy (default)

- `--image-similarity-threshold FLOAT`: Minimum similarity threshold (0.0 to 1.0) for grouping images
  - 1.0 = images must be nearly identical
  - 0.9 = images must be at least 90% similar
  - Lower values will group more images together

- Supported image file extensions: `.jpg`, `.jpeg`, `.png`, `.bmp`, `.gif`, `.tiff`

#### How It Works

Image similarity is calculated using perceptual hashing algorithms that generate fingerprints of images. These fingerprints can be compared to determine how similar two images are, even if they have different sizes, formats, or minor modifications.

---

## 📚 License

MIT License