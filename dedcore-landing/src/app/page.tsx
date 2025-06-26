"use client"

import React from "react";
import GradientBackground from "../components/GradientBackground";
import GlassNavBar from "../components/GlassNavBar";

const asciiArt = `
  ██████╗ ███████╗██████╗  ██████╗ ██████╗ ██████╗ ███████╗
  ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
  ██║  ██║█████╗  ██║  ██║██║     ██║   ██║██████╔╝█████╗  
  ██║  ██║██╔══╝  ██║  ██║██║     ██║   ██║██╔══██╗██╔══╝  
  ██████╔╝███████╗██████╔╝╚██████╗╚██████╔╝██║  ██║███████╗ v 0.1.0
          DEDCORE
`;

function TypingAscii({ className, onDone, isDone }: { className?: string; onDone?: () => void; isDone?: boolean }) {
  const [displayed, setDisplayed] = React.useState("");
  React.useEffect(() => {
    if (isDone) {
      setDisplayed(asciiArt);
      return;
    }
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(asciiArt.slice(0, i));
      i++;
      if (i > asciiArt.length) {
        clearInterval(interval);
        if (onDone) setTimeout(onDone, 400); // slight pause after typing
      }
    }, 6);
    return () => clearInterval(interval);
  }, [onDone, isDone]);
  return (
    <pre className={className} style={{ lineHeight: "1.1" }}>
      {displayed}
    </pre>
  );
}

export default function Home() {
  const [showMain, setShowMain] = React.useState(false);
  const [logoAtTop, setLogoAtTop] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);

  // When showMain becomes true, trigger logo to move to top after a short delay
  React.useEffect(() => {
    if (showMain) {
      setTimeout(() => setLogoAtTop(true), 200); // delay for smoothness
    }
  }, [showMain]);

  // When logoAtTop is true, show content after the logo's transition (700ms)
  React.useEffect(() => {
    if (logoAtTop) {
      const timeout = setTimeout(() => setShowContent(true), 700);
      return () => clearTimeout(timeout);
    } else {
      setShowContent(false);
    }
  }, [logoAtTop]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      <GlassNavBar />
      <GradientBackground />
      {/* Animated ASCII logo: center during loading, then shrink/slide to top */}
      <div
        className={`fixed left-0 w-full flex justify-center z-20 transition-all duration-700 ease-in-out
          ${logoAtTop ? 'top-0 pt-32 md:pt-44' : 'top-1/2 -translate-y-1/2'}
        `}
        style={{ pointerEvents: 'none' }}
      >
        <TypingAscii
          className={`font-mono select-none text-cyan-400 transition-all duration-700 ease-in-out
            ${logoAtTop ? 'text-[10px] md:text-base drop-shadow-lg' : 'text-xs md:text-lg xl:text-xl'}
            ${logoAtTop ? 'opacity-90' : 'opacity-100'}
          `}
          isDone={showMain}
          onDone={() => setShowMain(true)}
        />
      </div>
      {/* Main content: fade in after logo animates up */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center p-6 max-w-2xl w-full transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ marginTop: logoAtTop ? '8.5em' : 0, transition: 'margin-top 0.7s cubic-bezier(.4,2,.6,1)' }}
      >
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
