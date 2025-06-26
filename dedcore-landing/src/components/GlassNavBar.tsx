import React from "react";

export default function GlassNavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <div className="w-full mx-2 mt-2 md:mx-auto md:mt-6 max-w-2xl rounded-2xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl shadow-black/20 flex items-center justify-between px-4 py-2 md:py-3 pointer-events-auto">
        {/* Logo or Brand */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan-400 text-lg font-bold tracking-widest drop-shadow">DEDCORE</span>
        </div>
        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm md:text-base">
          <a href="#" className="text-white/90 hover:text-cyan-300 transition font-semibold">Home</a>
          <a href="#download" className="text-white/90 hover:text-cyan-300 transition font-semibold">Download</a>
          <a href="https://github.com/yourusername/dedcore" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-cyan-300 transition font-semibold">GitHub</a>
        </div>
      </div>
    </nav>
  );
} 