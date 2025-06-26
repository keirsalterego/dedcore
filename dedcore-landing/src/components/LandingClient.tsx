"use client";
import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const ThreeDedcore = dynamic(() => import("./ThreeDedcore"), { ssr: false });

// Simple animated cursor tracker
function CursorTracker() {
  React.useEffect(() => {
    const cursor = document.createElement("div");
    cursor.style.position = "fixed";
    cursor.style.zIndex = "9999";
    cursor.style.width = "32px";
    cursor.style.height = "32px";
    cursor.style.borderRadius = "50%";
    cursor.style.pointerEvents = "none";
    cursor.style.background = "radial-gradient(circle at 30% 30%, #00eaff99 60%, transparent 100%)";
    cursor.style.transition = "transform 0.08s cubic-bezier(.4,2,.6,1), opacity 0.2s";
    cursor.style.opacity = "0.7";
    document.body.appendChild(cursor);
    const move = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.removeChild(cursor);
    };
  }, []);
  return null;
}

export default function LandingClient() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      <CursorTracker />
      {/* 3D DedCore logo */}
      <div className="absolute top-0 left-0 w-full flex justify-center z-0 pointer-events-none select-none">
        <ThreeDedcore />
      </div>
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center p-6 max-w-2xl w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-yellow-300 text-lg font-bold mb-4 mt-4 drop-shadow-lg">dedcore: Oops, no more duplicates!</div>
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-6 w-full justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        >
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
        </motion.div>
        <motion.div
          className="bg-gray-900 bg-opacity-80 rounded-lg p-4 text-sm text-gray-200 w-full max-w-xl mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        >
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
        </motion.div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Need help? See the <a href="https://github.com/yourusername/dedcore" className="underline hover:text-cyan-300">GitHub</a> or <a href="mailto:support@dedcore.com" className="underline hover:text-cyan-300">contact support</a>.
        </div>
      </motion.div>
    </main>
  );
} 