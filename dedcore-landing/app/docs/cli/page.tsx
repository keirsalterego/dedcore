import Image from "next/image";

export default function CliDocs() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400">DedCore CLI: The Only Rust Tool That Judges Your Duplicates</h1>
      <p>
        Welcome to the DedCore CLI documentation! If you love typing long commands and feeling like a hacker, you’re in the right place. Here you’ll find every subcommand, flag, and snarky tip you need to become a deduplication wizard (or at least look busy in the terminal).
      </p>

      <h2 className="text-cyan-400">Installation (Because You Can’t Use It If You Don’t Have It)</h2>
      <pre className="bg-gray-900 text-green-400 p-4 rounded">curl -sSL https://get.dedcore.dev/install.sh | bash
# Or, if you’re on Windows and like pain:
iwr https://get.dedcore.dev/install.sh | iex</pre>
      <p>
        Or just download the binary from <a href="https://github.com/manishyoudumb/dedcore/releases" className="text-green-400 underline">GitHub Releases</a> and pretend you compiled it yourself.
      </p>

      <h2 className="text-cyan-400">Basic Usage</h2>
      <pre className="bg-gray-900 text-cyan-400 p-4 rounded">dedcore scan ~/Documents</pre>
      <p>
        This will scan your Documents folder for duplicates. If you have nothing to hide, you’ll be fine. If you do, well, good luck.
      </p>

      <h2 className="text-cyan-400">Subcommands & Examples</h2>
      <ul>
        <li>
          <b>scan</b>: Find duplicates in a directory. <br />
          <code>dedcore scan ~/Downloads --filetypes=jpg,png --min-size=10000</code>
        </li>
        <li>
          <b>quarantine</b>: Move files to a safe place (like witness protection, but for files). <br />
          <code>dedcore quarantine file /path/to/suspicious.mp3</code>
        </li>
        <li>
          <b>quarantine commit</b>: Delete all quarantined files forever. No take-backs! <br />
          <code>dedcore quarantine commit</code>
        </li>
        <li>
          <b>quarantine rollback</b>: Restore all quarantined files. Oops, did you mean to delete those? <br />
          <code>dedcore quarantine rollback</code>
        </li>
        <li>
          <b>quarantine list</b>: List all files in quarantine. <br />
          <code>dedcore quarantine list</code>
        </li>
        <li>
          <b>quarantine restore</b>: Restore a specific file by its original path. <br />
          <code>dedcore quarantine restore /path/to/suspicious.mp3</code>
        </li>
        <li>
          <b>recovery list</b>: See the recovery log. Because everyone loves logs. <br />
          <code>dedcore recovery list</code>
        </li>
      </ul>

      <h2 className="text-cyan-400">Flags & Options (Because More Is More)</h2>
      <ul>
        <li><b>--filetypes=jpg,png,mp4</b>: Only scan these file types. Because you’re picky.</li>
        <li><b>--min-size=10000</b>: Ignore files smaller than this. Size does matter.</li>
        <li><b>--max-size=1000000</b>: Ignore files larger than this. Sometimes, less is more.</li>
        <li><b>--min-age=30</b>: Only scan files older than 30 days. Because nostalgia.</li>
        <li><b>--max-age=365</b>: Only scan files younger than a year. Freshness counts.</li>
        <li><b>--regex=.*backup.*</b>: Only scan files matching this regex. For the regex wizards.</li>
        <li><b>--dry</b>: Do a dry run. No files will be harmed (yet).</li>
        <li><b>--quarantine-all-dupes</b>: Quarantine all but one file in each duplicate group. Ruthless efficiency.</li>
        <li><b>--similarity-threshold=0.8</b>: Set how similar text files must be to be considered duplicates. 1.0 means twins, 0.0 means distant cousins.</li>
        <li><b>--image-similarity-threshold=0.9</b>: Same, but for images. Because pixels have feelings too.</li>
        <li><b>--json-report=report.json</b>: Save your results to a JSON file. For the data hoarders.</li>
        <li><b>--html-report=report.html</b>: Save your results to HTML. Show your friends how much space you saved.</li>
      </ul>

      <h2 className="text-cyan-400">Workflow: How DedCore Works (A Tragicomedy in 4 Acts)</h2>
      <ol>
        <li><b>Scan</b>: You run <code>dedcore scan</code>. DedCore panics (just kidding) and starts hashing your files.</li>
        <li><b>Hashing</b>: Every file gets a unique hash. If two files have the same hash, they’re either duplicates or the universe is glitching.</li>
        <li><b>Quarantine</b>: Duplicates are moved to a safe place. You get to decide their fate. (No pressure.)</li>
        <li><b>Commit or Rollback</b>: Delete them forever, or bring them back. Choose wisely.</li>
      </ol>

      <h2 className="text-cyan-400">Diagram: The DedCore Life Cycle</h2>
      <div className="flex flex-col items-center">
        <Image src="/file.svg" alt="File" width={48} height={48} />
        <div className="border-l-4 border-green-400 h-8"></div>
        <Image src="/globe.svg" alt="Scan" width={48} height={48} />
        <div className="border-l-4 border-green-400 h-8"></div>
        <Image src="/install.sh" alt="Hash" width={48} height={48} />
        <div className="border-l-4 border-green-400 h-8"></div>
        <Image src="/window.svg" alt="Quarantine" width={48} height={48} />
        <div className="border-l-4 border-green-400 h-8"></div>
        <Image src="/vercel.svg" alt="Delete or Restore" width={48} height={48} />
      </div>
      <p className="text-gray-400 mt-4">If you made it this far, you’re either a power user or just really bored. Either way, DedCore salutes you.</p>
    </div>
  );
}
