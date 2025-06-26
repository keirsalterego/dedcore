
export default function CliDocs() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-4xl font-extrabold mb-4">DedCore CLI: Feature Reference</h1>
      <p className="text-gray-300 text-lg mb-8">
        Here’s what DedCore’s CLI actually does—no fluff, just the facts (with a side of sarcasm). If you want command syntax, check the other docs. If you want to know what’s possible, read on!
      </p>

      {/* Core Deduplication */}
      <section className="mb-10">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🔍 Content-Based Duplicate Detection</h2>
        <p className="text-gray-300">Scans files and finds true duplicates by hashing their contents (not just names or dates). Rename your files all you want—DedCore will still catch them.</p>
      </section>

      {/* Hashing Algorithms */}
      <section className="mb-10">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🧠 Smart Hashing</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Uses SHA-256, Blake3, or xxHash3 (auto-selected for speed or paranoia).</li>
          <li>Parallelized with Rayon for fast scanning.</li>
        </ul>
      </section>

      {/* Filtering */}
      <section className="mb-10">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">⚙️ Advanced Filtering</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Filter by file type/extension, size range, age (days), or regex pattern.</li>
          <li>Target specific files, folders, or wildcards.</li>
        </ul>
      </section>

      {/* Similarity */}
      <section className="mb-10">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🧬 Similarity Detection</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Text: Groups files by content similarity (edit distance, adjustable threshold).</li>
          <li>Images: Finds visually similar images using perceptual hashing.</li>
        </ul>
      </section>

      {/* Quarantine & Safety */}
      <section className="mb-10">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🗑️ Safe Deletion & Quarantine</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Quarantine system: Moves files to a safe zone before deletion.</li>
          <li>Restore or permanently delete quarantined files (with <b>commit</b> and <b>rollback</b> subcommands).</li>
          <li>All destructive actions require confirmation. No accidental data loss (unless you try really hard).</li>
        </ul>
      </section>

      {/* Reporting */}
      <section className="mb-10">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">📦 Reporting</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Generates JSON and HTML reports: see what was found, what was saved, and what was banished.</li>
          <li>Reports include duplicate groups, similar files, and potential space savings.</li>
        </ul>
      </section>

      {/* Recovery & Logging */}
      <section className="mb-10">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🕵️ Recovery & Audit Log</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Every quarantine, deletion, and restoration is logged for full traceability.</li>
          <li>Recovery subcommand: List and restore from history if you change your mind (or your boss does).</li>
        </ul>
      </section>

      {/* Automation & Platform */}
      <section className="mb-10">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">🤖 Automation & Platform Support</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Script-friendly: Works in cron jobs, batch scripts, and CI/CD pipelines.</li>
          <li>Cross-platform: Linux, macOS, Windows. (No excuses.)</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">That’s the CLI!</h2>
        <p className="text-gray-300">For actual command usage, see the rest of the docs. For everything else, try <b>--help</b> and enjoy the snarky help messages.</p>
      </section>
    </div>
  );
}
