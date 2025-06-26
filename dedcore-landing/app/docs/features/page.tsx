import { Search, Trash2, BarChart3, Settings, FileText, HardDrive, ShieldCheck, FileCheck2, Zap, ListChecks } from "lucide-react";

export default function Features() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-3xl font-extrabold mb-4">Features: Why DedCore Is the Best Thing Since Sliced Bread</h1>
      <p className="text-gray-300 text-lg mb-6">
        DedCore isn’t just another deduplication tool. It’s a full-featured, cross-platform, sarcasm-enabled powerhouse. Here’s what you get:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2"><Search className="text-green-400" size={20} /><b>Deep Scan</b></div>
          <p className="text-gray-300">Byte-by-byte comparison for perfect accuracy. If you renamed it, DedCore still finds it. (Sorry, sneaky files.)</p>
          <div className="flex items-center gap-2 mb-2"><Trash2 className="text-green-400" size={20} /><b>Safe Deletion</b></div>
          <p className="text-gray-300">Quarantine before deletion. Undo your mistakes, or don’t. We’re not your mom.</p>
          <div className="flex items-center gap-2 mb-2"><BarChart3 className="text-green-400" size={20} /><b>Analytics</b></div>
          <p className="text-gray-300">See how much space you saved, and which file types are the worst offenders. Bragging rights included.</p>
          <div className="flex items-center gap-2 mb-2"><Settings className="text-green-400" size={20} /><b>Custom Rules</b></div>
          <p className="text-gray-300">Filter by type, size, age, or regex. If you can imagine it, DedCore can probably do it.</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2"><FileText className="text-green-400" size={20} /><b>Multi-Format</b></div>
          <p className="text-gray-300">Images, videos, docs, archives, spreadsheets—if it’s a file, it’s fair game.</p>
          <div className="flex items-center gap-2 mb-2"><HardDrive className="text-green-400" size={20} /><b>Cross-Platform</b></div>
          <p className="text-gray-300">Linux, macOS, Windows. No one’s left out (except maybe DOS users).</p>
          <div className="flex items-center gap-2 mb-2"><ShieldCheck className="text-green-400" size={20} /><b>Safety First</b></div>
          <p className="text-gray-300">Double-confirmations, recovery logs, and a healthy fear of accidental deletion.</p>
          <div className="flex items-center gap-2 mb-2"><Zap className="text-green-400" size={20} /><b>Smart Hashing</b></div>
          <p className="text-gray-300">SHA-256, Blake3, xxHash3—DedCore picks the best for your files and your paranoia level.</p>
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-2"><ListChecks className="text-green-400" size={20} /><b>Similarity Detection</b></div>
        <p className="text-gray-300">Finds files that are almost twins—typos, filtered images, and more. You set the threshold, DedCore does the rest.</p>
        <div className="flex items-center gap-2 mb-2"><FileCheck2 className="text-green-400" size={20} /><b>Reporting</b></div>
        <p className="text-gray-300">Beautiful HTML and nerdy JSON reports. Show off your space savings to anyone who’ll listen.</p>
      </div>
      <p className="text-gray-400">Still not convinced? Try it and see. Or just keep living with duplicates. Your call.</p>
    </div>
  );
}