export default function QuickStart() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-green-400 mb-4">Quick Start</h1>
      <p className="mb-6 text-gray-200">Get up and running with DedCore in seconds. Here's how to scan your files for duplicates:</p>
      <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2">
        <li>
          <b>Install DedCore</b> using the <a href="/docs/installation" className="text-cyan-400 underline">installation instructions</a>.
        </li>
        <li>
          <b>Open your terminal</b> (or PowerShell on Windows).
        </li>
        <li>
          <b>Run a scan in your home directory:</b>
          <div className="bg-gray-800 rounded p-4 my-2">
            <pre className="text-green-400 text-sm">dedcore scan ~/</pre>
          </div>
        </li>
        <li>
          <b>Review the results</b> and follow the prompts to safely remove duplicates.
        </li>
      </ol>
      <h2 className="text-lg font-bold text-cyan-400 mt-6 mb-2">Example Output</h2>
      <div className="bg-gray-800 rounded p-4 mb-4">
        <pre className="text-gray-200 text-sm">Scanning /home/user/ ...
Found 42 duplicate files (120MB)
Would you like to review and delete them? (y/N)</pre>
      </div>
      <p className="text-gray-400">For more advanced options, see the <a href="/docs/features" className="text-green-400 underline">Features</a> and <a href="/docs/advanced-usage" className="text-green-400 underline">Advanced Usage</a> sections.</p>
    </div>
  );
} 