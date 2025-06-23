use std::path::Path;
use anyhow::Result;

/// Compute the Levenshtein distance between two strings.
pub fn levenshtein(a: &str, b: &str) -> usize {
    let mut costs = vec![0; b.len() + 1];
    for j in 0..=b.len() {
        costs[j] = j;
    }
    for (i, ca) in a.chars().enumerate() {
        let mut last = i;
        costs[0] = i + 1;
        for (j, cb) in b.chars().enumerate() {
            let old = costs[j + 1];
            costs[j + 1] = if ca == cb {
                last
            } else {
                1 + last.min(costs[j]).min(costs[j + 1])
            };
            last = old;
        }
    }
    costs[b.len()]
}

/// Compare two text files and return their Levenshtein distance.
pub fn compare_text_files(path1: &Path, path2: &Path) -> Result<usize> {
    let text1 = std::fs::read_to_string(path1)?;
    let text2 = std::fs::read_to_string(path2)?;
    Ok(levenshtein(&text1, &text2))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_levenshtein() {
        assert_eq!(levenshtein("kitten", "sitting"), 3);
        assert_eq!(levenshtein("flaw", "lawn"), 2);
        assert_eq!(levenshtein("", ""), 0);
        assert_eq!(levenshtein("a", "a"), 0);
        assert_eq!(levenshtein("abc", ""), 3);
        assert_eq!(levenshtein("", "abc"), 3);
    }
}
