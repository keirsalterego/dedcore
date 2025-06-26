export default function FaqPage() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-3xl font-extrabold mb-4">Frequently Asked Questions (FAQ)</h1>
      <p className="text-gray-300 text-lg mb-8">Got questions? We’ve got answers. If you don’t see your question here, try yelling at your screen. (Or, you know, <a href="/docs/contact" className="text-cyan-400 underline">contact us</a>.)</p>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8 divide-y divide-gray-800">
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">What is DedCore?</h2>
          <p className="text-gray-300">DedCore is a blazing-fast, privacy-first file deduplication tool written in Rust. It finds, analyzes, and helps you safely remove duplicate and similar files from your system. It’s like Marie Kondo, but for your hard drive.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">Is DedCore safe? Will it delete my important files?</h2>
          <p className="text-gray-300">DedCore never deletes anything without your explicit confirmation. Duplicates are quarantined first, so you can review and restore before committing to deletion. (We’re not monsters.)</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">What platforms does DedCore support?</h2>
          <p className="text-gray-300">Linux, macOS, and Windows. If you’re on DOS, we salute your dedication, but you’re on your own.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">How does DedCore find duplicates?</h2>
          <p className="text-gray-300">It uses a combination of cryptographic hashes (SHA-256, Blake3, xxHash3) and content analysis. For similar files, it uses Levenshtein distance (for text) and perceptual hashing (for images). Basically, it’s smarter than your average bear.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">Can DedCore find similar (not just identical) files?</h2>
          <p className="text-gray-300">Yes! Set the similarity threshold for text or images, and DedCore will group files that are almost twins—typos, filtered images, and more.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">Does DedCore work on external drives or network shares?</h2>
          <p className="text-gray-300">Absolutely. As long as your OS can see the files, DedCore can scan them. Just point it at the right path.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">How fast is DedCore?</h2>
          <p className="text-gray-300">Fast. Like, “I blinked and it was done” fast. Thanks to Rust, parallel processing, and memory-mapped files, DedCore chews through terabytes like a champ.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">What file types does DedCore support?</h2>
          <p className="text-gray-300">All of them. Images, videos, documents, archives, spreadsheets, you name it. If it’s a file, it’s fair game.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">Can I automate DedCore?</h2>
          <p className="text-gray-300">Yes! DedCore is script-friendly and works great in cron jobs, batch files, and shell scripts. Set it and forget it (until your disk is clean).</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">Where does DedCore store quarantined files?</h2>
          <p className="text-gray-300">In <code className="bg-gray-700 px-1 rounded">~/.dedcore/quarantine</code> by default. You can restore or delete them at your leisure.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">How do I update DedCore?</h2>
          <p className="text-gray-300">Just run the installer again. It’ll fetch the latest version. Or check <a href="/docs/changelog" className="text-green-400 underline">Changelog</a> for what’s new.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">Help! Something broke!</h2>
          <p className="text-gray-300">First, don’t panic. Check the <a href="/docs/cli" className="text-green-400 underline">CLI Reference</a>, <a href="/docs/installation" className="text-green-400 underline">Installation</a>, or <a href="/docs/contact" className="text-green-400 underline">Contact Support</a>. If all else fails, try turning it off and on again.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">Can I contribute to DedCore?</h2>
          <p className="text-gray-300">Absolutely! Check out the <a href="/docs/contributing" className="text-green-400 underline">Contributing</a> page. We love PRs, issues, and even typo fixes.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">Is DedCore open source?</h2>
          <p className="text-gray-300">Yes! The code is on <a href="https://github.com/manishyoudumb/dedcore" className="text-green-400 underline">GitHub</a>. Fork it, star it, or just admire it from afar.</p>
        </div>
        <div className="py-4">
          <h2 className="text-cyan-400 text-xl font-bold mb-1">Will DedCore ever have a GUI?</h2>
          <p className="text-gray-300">Maybe! For now, enjoy the power of the CLI. (And the street cred that comes with it.)</p>
        </div>
      </div>
      <p className="text-gray-400">Still have questions? <a href="/docs/contact" className="text-cyan-400 underline">Contact us</a> and we’ll do our best to help (or at least send you a meme).</p>
    </div>
  );
}