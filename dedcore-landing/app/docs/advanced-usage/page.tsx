export default function AdvancedUsage() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-3xl font-extrabold mb-4">
        Advanced Usage: For Power Users, Nerds, and the Terminal-Obsessed
      </h1>
      <p className="text-gray-300 text-lg mb-6">
        Think you’ve mastered DedCore? Think again. Here’s how to squeeze every
        last byte of power from your favorite deduplication tool.
      </p>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">
          Scripting & Automation
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>
            Run DedCore in cron jobs, batch files, or shell scripts. Set it and
            forget it (until your disk is clean).
          </li>
          <li>
            Combine with other tools for custom workflows. DedCore plays nice
            with bash, PowerShell, and even your weird Python scripts.
          </li>
          <li>Use dry runs to preview changes before unleashing chaos.</li>
        </ul>
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">
          Custom Filters & Rules
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>
            Filter by file type, size, age, or regex. If you can describe it,
            DedCore can probably filter it.
          </li>
          <li>
            Set similarity thresholds for text and images. Find near-duplicates,
            not just clones.
          </li>
          <li>
            Exclude directories or files you want to keep messy. (We won’t
            tell.)
          </li>
        </ul>
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">
          Reporting & Analytics
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>
            Generate JSON and HTML reports for every scan. Impress your boss, or
            just yourself.
          </li>
          <li>
            Track space savings, duplicate patterns, and more. Data nerds
            rejoice!
          </li>
          <li>
            Review recovery logs to see every action DedCore took. Accountability,
            but make it fun.
          </li>
        </ul>
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">Power Moves</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>
            Use quarantine and rollback to experiment safely. No regrets, just
            results.
          </li>
          <li>
            Chain DedCore with other CLI tools for ultimate automation. (jq,
            anyone?)
          </li>
          <li>
            Monitor performance with built-in stats and benchmarks. Because speed
            matters.
          </li>
        </ul>
      </div>
      <p className="text-gray-400">
        If you break something, you probably learned something. That’s the
        DedCore way.
      </p>
    </div>
  );
}