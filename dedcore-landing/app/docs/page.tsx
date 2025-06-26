export default function DocsHome() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-4xl font-extrabold mb-4">Welcome to DedCore Docs</h1>
      <p className="text-gray-300 text-lg mb-6">
        Meet <b>DedCore</b>: the file deduplication tool that’s faster than your coffee break and more ruthless than your ex. Whether you’re a digital hoarder, a sysadmin, or just someone who can’t stop downloading cat memes, DedCore is here to save your disk space (and maybe your sanity).
      </p>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">Why DedCore?</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Lightning-fast duplicate detection (seriously, blink and you’ll miss it)</li>
          <li>Safe deletion with quarantine (because we all make mistakes)</li>
          <li>Detailed analytics and reports (for the data nerds)</li>
          <li>Works on Linux, macOS, and Windows (no one’s left out)</li>
          <li>CLI so slick, you’ll want to show it off at parties</li>
        </ul>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1 bg-black border border-gray-700 rounded-lg p-6">
          <h3 className="text-green-400 font-bold mb-2">What can you do here?</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Learn how to install DedCore (it’s easy, we promise)</li>
            <li>Get started in seconds with our Quick Start guide</li>
            <li>Explore all the features (and some you didn’t know you needed)</li>
            <li>Master advanced usage and automation</li>
            <li>Find answers in the FAQ or contact support (we’re nice, mostly)</li>
          </ul>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <img src="/vercel.svg" alt="DedCore Logo" className="w-32 h-32 mb-4" />
          <span className="text-gray-400 text-sm">DedCore: Oops, no more duplicates!</span>
        </div>
      </div>
      <p className="text-gray-400">Use the sidebar to navigate. Or just click around randomly. We won’t judge.</p>
    </div>
  );
}