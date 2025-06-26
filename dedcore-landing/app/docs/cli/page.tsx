import Image from "next/image";

export default function CliDocs() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-4xl font-extrabold mb-4">DedCore CLI: Features (No Boring Command Examples!)</h1>
      <p className="text-gray-300 text-lg mb-8">
        Welcome to the DedCore CLI feature showcase! Here’s everything this Rust-powered beast can do for you, explained in a way that even your cat could understand (if it cared about disk space).
      </p>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🚀 Deep Scan Technology</h2>
        <p className="text-gray-300">DedCore doesn’t just look at file names or dates. It dives deep, comparing file contents byte-by-byte, so even if you renamed your embarrassing vacation photos, DedCore will find their twins. No duplicate escapes its gaze.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🗑️ Safe Deletion & Quarantine</h2>
        <p className="text-gray-300">Worried about deleting the wrong file? DedCore’s quarantine system moves duplicates to a safe holding cell. You can review, restore, or unleash digital doom (delete) at your leisure. It’s like a recycling bin, but with more drama.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">📊 Detailed Analytics</h2>
        <p className="text-gray-300">Get juicy stats: how much space you saved, how many duplicates you had, and which file types are the worst offenders. DedCore gives you the numbers, so you can brag about your new free space at parties (or just to yourself).</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">⚙️ Customizable Rules</h2>
        <p className="text-gray-300">Filter by file type, size, age, or even regex (for the true nerds). Want to only scan .mp3s bigger than 10MB and older than a year? Go wild. DedCore lets you slice and dice your scan however you want.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🧬 Similarity Detection</h2>
        <p className="text-gray-300">Not all duplicates are identical twins. DedCore can group files that are just <i>really</i> similar—like text files with a typo, or images with a different filter. You set the similarity threshold, DedCore does the detective work.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">💾 Multi-Format Support</h2>
        <p className="text-gray-300">Images, videos, documents, archives, spreadsheets, you name it—DedCore can scan it. If it’s a file, it’s fair game. (Except maybe your hopes and dreams. Those are safe. For now.)</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🌐 Cross-Platform</h2>
        <p className="text-gray-300">Runs on Linux, macOS, and Windows. No matter what OS you use to hoard files, DedCore is there to help you clean up your act.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">📦 Reporting (JSON & HTML)</h2>
        <p className="text-gray-300">Want to keep a record of your heroic deduplication? DedCore can spit out beautiful HTML reports and nerdy JSON logs. Show your friends, your boss, or just your future self how much space you saved.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🔒 Safety First</h2>
        <p className="text-gray-300">Every destructive action is double-checked. You’ll get prompts, confirmations, and a chance to back out before DedCore does anything drastic. (We’re not monsters.)</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🧠 Smart Hashing</h2>
        <p className="text-gray-300">DedCore uses a mix of SHA-256, Blake3, and xxHash3, picking the best algorithm for your files and your paranoia level. Fast, secure, and just a little bit overkill.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🕵️ Recovery Log</h2>
        <p className="text-gray-300">Every quarantine, deletion, and restoration is logged. If you ever need to know what happened (or who to blame), the recovery log has your back.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🤖 Automation-Ready</h2>
        <p className="text-gray-300">Script it, cron it, automate it! DedCore plays nice with batch jobs and shell scripts, so you can keep your system clean without lifting a finger (after the first time, anyway).</p>
      </section>

      <section className="mt-12">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">That’s DedCore CLI!</h2>
        <p className="text-gray-300">If you want to see the actual commands, check the rest of the docs. Or just start typing and see what happens. What’s the worst that could go wrong? (Just kidding. Probably.)</p>
      </section>
    </div>
  );
}
