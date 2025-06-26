export default function QuickStart() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-3xl font-extrabold mb-4">Quick Start: Deduplicate Like a Pro (or at Least Look Like One)</h1>
      <p className="text-gray-300 text-lg mb-6">
        Ready to make your disk space great again? Follow these steps and you’ll be deduping before your coffee gets cold.
      </p>
      <ol className="list-decimal list-inside text-gray-300 mb-8 space-y-2">
        <li><b>Install DedCore</b> (see <a href="/docs/installation" className="text-cyan-400 underline">Installation</a> if you skipped ahead—no shame).</li>
        <li><b>Open your terminal</b> (or PowerShell, if you like danger).</li>
        <li><b>Run a scan</b> in your home directory. Watch DedCore work its magic.</li>
        <li><b>Review the results</b> and follow the prompts. Don’t worry, you’re in control (mostly).</li>
      </ol>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">What to Expect</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>DedCore will scan, hash, and analyze your files faster than you can say “duplicate.”</li>
          <li>You’ll get a summary of duplicates, potential space savings, and options to quarantine or delete.</li>
          <li>Nothing is deleted without your explicit say-so. (We’re not monsters.)</li>
        </ul>
      </div>
      <div className="flex flex-col items-center">
        <img src="/file.svg" alt="Scan" className="w-16 h-16 mb-2" />
        <span className="text-gray-400 text-sm">Still confused? Check the <a href="/docs/features" className="text-green-400 underline">Features</a> or <a href="/docs/faq" className="text-green-400 underline">FAQ</a>.</span>
      </div>
    </div>
  );
}