import React from "react";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      {/* Placeholder for Three.js background */}
      <div className="absolute inset-0 z-0">
        {/* <ThreeBackground /> */}
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center p-6 max-w-2xl w-full">
        <pre className="text-cyan-400 text-xs md:text-base font-mono leading-tight select-none mb-2" style={{lineHeight: '1.1'}}>
{`
  ██████╗ ███████╗██████╗  ██████╗ ██████╗ ██████╗ ███████╗
  ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
  ██║  ██║█████╗  ██║  ██║██║     ██║   ██║██████╔╝█████╗  
  ██║  ██║██╔══╝  ██║  ██║██║     ██║   ██║██╔══██╗██╔══╝  
  ██████╔╝███████╗██████╔╝╚██████╗╚██████╔╝██║  ██║███████╗ v 0.1.0
          
  DEDCORE
`}
        </pre>
        <div className="text-yellow-300 text-lg font-bold mb-4">dedcore: Oops, no more duplicates!</div>
        <div className="flex flex-col md:flex-row gap-4 mb-6 w-full justify-center">
          <a
            href="/install.sh"
            download
            className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold py-2 px-6 rounded shadow transition-colors border border-cyan-300 text-center"
          >
            Download for Linux/macOS
          </a>
          <a
            href="/install.ps1"
            download
            className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-6 rounded shadow transition-colors border border-green-300 text-center"
          >
            Download for Windows
          </a>
        </div>
        <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4 text-sm text-gray-200 w-full max-w-xl mb-2">
          <div className="mb-2 font-semibold text-cyan-300">Installation Instructions:</div>
          <ul className="list-disc pl-5">
            <li>
              <span className="text-cyan-200 font-semibold">Linux/macOS:</span> <br />
              <span className="text-gray-300">Run <code>bash install.sh</code> or <code>chmod +x install.sh &amp;&amp; ./install.sh</code> in your terminal.</span>
            </li>
            <li className="mt-2">
              <span className="text-green-200 font-semibold">Windows:</span> <br />
              <span className="text-gray-300">Right-click <code>install.ps1</code> &amp; "Run with PowerShell"<br />or run <code>powershell -ExecutionPolicy Bypass -File install.ps1</code> in your terminal.</span>
            </li>
          </ul>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Need help? See the <a href="https://github.com/yourusername/dedcore" className="underline hover:text-cyan-300">GitHub</a> or <a href="mailto:support@dedcore.com" className="underline hover:text-cyan-300">contact support</a>.
        </div>
      </div>
    </main>
  );
}
