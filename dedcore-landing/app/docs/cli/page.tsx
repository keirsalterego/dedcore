import Image from "next/image";

export default function CliDocs() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-4xl font-extrabold mb-4">DedCore CLI: The Rusty Swiss Army Knife for Duplicates</h1>
      <p className="text-gray-300 text-lg mb-8">
        Welcome to the DedCore CLI docs! Here, we turn your file chaos into order (and your terminal into a stand-up comedy club). Whether you’re a power user or just here to procrastinate, you’ll find every command, flag, and snarky tip you need to become a deduplication legend.
      </p>

      {/* Installation Section */}
      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">Installation (Because You Can’t Use It If You Don’t Have It)</h2>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-2">
          <pre className="text-green-400 text-sm">curl -sSL https://get.dedcore.dev/install.sh | bash</pre>
          <div className="text-gray-400 text-xs mt-1">Linux/macOS</div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-2">
          <pre className="text-cyan-400 text-sm">iwr https://get.dedcore.dev/install.sh | iex</pre>
          <div className="text-gray-400 text-xs mt-1">Windows PowerShell (for the brave)</div>
        </div>
        <p className="text-gray-400">Or download the binary from <a href="https://github.com/manishyoudumb/dedcore/releases" className="text-green-400 underline">GitHub Releases</a> and tell your friends you built it from source.</p>
      </section>

      {/* Basic Usage Section */}
      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">Basic Usage</h2>
        <div className="bg-black border border-gray-700 rounded-lg p-4 mb-4">
          <span className="text-green-400">$</span> <span className="text-cyan-400">dedcore scan ~/Documents</span>
        </div>
        <p className="text-gray-300">This will scan your Documents folder for duplicates. If you have nothing to hide, you’ll be fine. If you do, well, DedCore will find out.</p>
      </section>

      {/* Subcommands Section */}
      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">Subcommands & Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">scan</h3>
            <p className="text-gray-300 mb-2">Find duplicates in a directory. Because who needs 12 copies of the same cat meme?</p>
            <pre className="bg-black border border-gray-700 rounded p-2 text-cyan-400">dedcore scan ~/Downloads --filetypes=jpg,png --min-size=10000</pre>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">quarantine</h3>
            <p className="text-gray-300 mb-2">Move files to a safe place (like witness protection, but for files).</p>
            <pre className="bg-black border border-gray-700 rounded p-2 text-cyan-400">dedcore quarantine file /path/to/suspicious.mp3</pre>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">quarantine commit</h3>
            <p className="text-gray-300 mb-2">Delete all quarantined files forever. No take-backs!</p>
            <pre className="bg-black border border-gray-700 rounded p-2 text-cyan-400">dedcore quarantine commit</pre>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">quarantine rollback</h3>
            <p className="text-gray-300 mb-2">Restore all quarantined files. Oops, did you mean to delete those?</p>
            <pre className="bg-black border border-gray-700 rounded p-2 text-cyan-400">dedcore quarantine rollback</pre>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">quarantine list</h3>
            <p className="text-gray-300 mb-2">List all files in quarantine. Because curiosity killed the cat, but satisfaction brought it back.</p>
            <pre className="bg-black border border-gray-700 rounded p-2 text-cyan-400">dedcore quarantine list</pre>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">quarantine restore</h3>
            <p className="text-gray-300 mb-2">Restore a specific file by its original path. For when you realize you actually needed that file.</p>
            <pre className="bg-black border border-gray-700 rounded p-2 text-cyan-400">dedcore quarantine restore /path/to/suspicious.mp3</pre>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">recovery list</h3>
            <p className="text-gray-300 mb-2">See the recovery log. Because everyone loves logs (except lumberjacks).</p>
            <pre className="bg-black border border-gray-700 rounded p-2 text-cyan-400">dedcore recovery list</pre>
          </div>
        </div>
      </section>

      {/* Flags & Options Section */}
      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">Flags & Options (Because More Is More)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="text-gray-300 text-base space-y-2">
            <li><b>--filetypes=jpg,png,mp4</b>: Only scan these file types. Because you’re picky.</li>
            <li><b>--min-size=10000</b>: Ignore files smaller than this. Size does matter.</li>
            <li><b>--max-size=1000000</b>: Ignore files larger than this. Sometimes, less is more.</li>
            <li><b>--min-age=30</b>: Only scan files older than 30 days. Because nostalgia.</li>
            <li><b>--max-age=365</b>: Only scan files younger than a year. Freshness counts.</li>
            <li><b>--regex=.*backup.*</b>: Only scan files matching this regex. For the regex wizards.</li>
            <li><b>--dry</b>: Do a dry run. No files will be harmed (yet).</li>
            <li><b>--quarantine-all-dupes</b>: Quarantine all but one file in each duplicate group. Ruthless efficiency.</li>
          </ul>
          <ul className="text-gray-300 text-base space-y-2">
            <li><b>--similarity-threshold=0.8</b>: Set how similar text files must be to be considered duplicates. 1.0 means twins, 0.0 means distant cousins.</li>
            <li><b>--image-similarity-threshold=0.9</b>: Same, but for images. Because pixels have feelings too.</li>
            <li><b>--json-report=report.json</b>: Save your results to a JSON file. For the data hoarders.</li>
            <li><b>--html-report=report.html</b>: Save your results to HTML. Show your friends how much space you saved.</li>
            <li><b>--security=high</b>: Set hash security level. Because paranoia is a virtue.</li>
            <li><b>--speed=fastest</b>: Set hash speed. For those who want results yesterday.</li>
          </ul>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="mb-12">
        <h2 className="text-cyan-400 text-2xl font-bold mb-2">Workflow: How DedCore Works (A Tragicomedy in 4 Acts)</h2>
        <ol className="text-gray-300 text-base space-y-2 mb-6">
          <li><b>Scan</b>: You run <code>dedcore scan</code>. DedCore panics (just kidding) and starts hashing your files.</li>
          <li><b>Hashing</b>: Every file gets a unique hash. If two files have the same hash, they’re either duplicates or the universe is glitching.</li>
          <li><b>Quarantine</b>: Duplicates are moved to a safe place. You get to decide their fate. (No pressure.)</li>
          <li><b>Commit or Rollback</b>: Delete them forever, or bring them back. Choose wisely.</li>
        </ol>
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center space-x-4 mb-4">
            <Image src="/file.svg" alt="File" width={48} height={48} />
            <span className="text-green-400 text-2xl">→</span>
            <Image src="/globe.svg" alt="Scan" width={48} height={48} />
            <span className="text-green-400 text-2xl">→</span>
            <Image src="/install.sh" alt="Hash" width={48} height={48} />
            <span className="text-green-400 text-2xl">→</span>
            <Image src="/window.svg" alt="Quarantine" width={48} height={48} />
            <span className="text-green-400 text-2xl">→</span>
            <Image src="/vercel.svg" alt="Delete or Restore" width={48} height={48} />
          </div>
          <div className="text-gray-400 text-sm mt-2">If you made it this far, you’re either a power user or just really bored. Either way, DedCore salutes you.</div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="mt-12">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">Still Confused?</h2>
        <p className="text-gray-300">Check out the <a href="/docs/faq" className="text-green-400 underline">FAQ</a> or <a href="/docs/contact" className="text-green-400 underline">Contact Support</a>. Or just yell at your screen. We won’t judge.</p>
      </section>
    </div>
  );
}
