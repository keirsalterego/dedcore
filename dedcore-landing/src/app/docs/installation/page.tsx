export default function DocsInstallation() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-green-400 mb-4">Installation</h1>
      <p className="mb-6 text-gray-200">DedCore is available for Linux, macOS, and Windows. Choose the method that works best for your system.</p>
      <h2 className="text-lg font-bold text-cyan-400 mt-6 mb-2">Universal Installer (Recommended)</h2>
      <p className="mb-2 text-gray-300">The easiest way to install DedCore is with our universal script. Just run one of the following commands in your terminal:</p>
      <div className="bg-gray-800 rounded p-4 mb-4">
        <pre className="text-green-400 text-sm">curl -sSL https://get.dedcore.dev/install.sh | bash</pre>
        <div className="text-gray-400 text-xs mt-1">Linux/macOS</div>
      </div>
      <div className="bg-gray-800 rounded p-4 mb-4">
        <pre className="text-cyan-400 text-sm">iwr https://get.dedcore.dev/install.sh | iex</pre>
        <div className="text-gray-400 text-xs mt-1">Windows PowerShell</div>
      </div>
      <h2 className="text-lg font-bold text-cyan-400 mt-6 mb-2">Manual Download</h2>
      <p className="mb-2 text-gray-300">You can also download the latest binary for your platform from the <a href="https://github.com/manishyoudumb/dedcore/releases" className="text-green-400 underline">GitHub Releases</a> page and place it in your <code className="bg-gray-700 px-1 rounded">$PATH</code>.</p>
      <h2 className="text-lg font-bold text-cyan-400 mt-6 mb-2">Requirements</h2>
      <ul className="list-disc list-inside text-gray-300 mb-4">
        <li>Linux: Ubuntu 18.04+ or equivalent</li>
        <li>macOS: 10.15 or later (Intel or Apple Silicon)</li>
        <li>Windows: 10 or later</li>
        <li>4GB RAM minimum, 50MB free disk space</li>
      </ul>
      <p className="text-gray-400">Need help? See the <a href="/docs/faq" className="text-cyan-400 underline">FAQ</a> or <a href="/docs/contact" className="text-cyan-400 underline">Contact Support</a>.</p>
    </div>
  )
} 