class Dedcore < Formula
  desc "A high-performance deduplication tool"
  homepage "https://github.com/manishyoudumb/dedcore"
  url "https://github.com/manishyoudumb/dedcore/archive/refs/tags/v0.1.0.tar.gz"
  sha256 "" # You'll need to update this with the actual checksum
  license "MIT"
  head "https://github.com/manishyoudumb/dedcore.git", branch: "main"

  depends_on "rust" => :build

  def install
    system "cargo", "install", *std_cargo_args
  end

  test do
    system "#{bin}/dedcore", "--version"
  end
end
