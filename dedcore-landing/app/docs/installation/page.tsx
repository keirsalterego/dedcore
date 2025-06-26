export default function Installation() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-3xl font-extrabold mb-4">Installation: Get DedCore Running (Before You Blink)</h1>
      <p className="text-gray-300 text-lg mb-6">
        Installing DedCore is easier than finding a duplicate file (and way more fun). Pick your OS, follow the steps, and you’ll be deduping in no time.
      </p>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">Universal Installer (Recommended)</h2>
        <p className="text-gray-300 mb-2">The fastest way to get DedCore running. Just copy, paste, and go. (No, really, it’s that easy.)</p>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-gray-400 text-xs mb-1">Linux/macOS</div>
            <pre className="bg-black text-green-400 p-4 rounded mb-2 whitespace-pre-wrap break-words overflow-x-auto text-sm"><code className="break-words whitespace-pre-wrap">curl -sSL https://dedcore.mxnish.me/install.sh | bash</code></pre>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-400 text-xs mb-1">Windows PowerShell (for the brave)</div>
            <pre className="bg-black text-cyan-400 p-4 rounded mb-2 whitespace-pre-wrap break-words overflow-x-auto text-sm"><code className="break-words whitespace-pre-wrap">iwr https://dedcore.mxnish.me/install.sh | iex</code></pre>
          </div>
        </div>
        <ul className="list-disc list-inside text-gray-300 mt-4 space-y-1 text-sm">
          <li>Installs the latest DedCore binary for your OS and architecture.</li>
          <li>Adds DedCore to your <code className="bg-gray-700 px-1 rounded">$PATH</code> (if possible).</li>
          <li>Safe to run multiple times (it’ll just update if needed).</li>
          <li>If you see a permission error, try <code>chmod +x install.sh</code> or run as admin.(may lord save windows people)</li>
        </ul>
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">Manual Download</h2>
        <p className="text-gray-300 mb-2">Prefer to do things the hard way? Download the latest binary from <a href="https://github.com/manishyoudumb/dedcore/releases" className="text-green-400 underline">GitHub Releases</a> and put it in your <code className="bg-gray-700 px-1 rounded">$PATH</code>. Bonus points if you pretend you compiled it yourself.</p>
        <h2 className="text-cyan-400 text-xl font-bold mt-4 mb-2">Requirements</h2>
        <ul className="list-disc list-inside text-gray-300 mb-2">
          <li>Linux: Ubuntu 18.04+ or equivalent</li>
          <li>macOS: 10.15+ (Intel or Apple Silicon)</li>
          <li>Windows: 10 or later</li>
          <li>4GB RAM minimum, 50MB free disk space</li>
        </ul>
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">Troubleshooting</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>If you see a permission error, try <code>chmod +x install.sh</code> or run as admin (but don’t blame us).</li>
          <li>Still stuck? See the <a href="/docs/faq" className="text-green-400 underline">FAQ</a> or <a href="/docs/contact" className="text-green-400 underline">Contact Support</a>.</li>
        </ul>
      </div>
      <p className="text-gray-400">Congrats! You’re now ready to unleash DedCore on your files. May the odds be ever in your favor.</p>
    </div>
  );
}