export default function ContributingPage() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-3xl font-extrabold mb-4">Contributing to DedCore</h1>
      <p className="text-gray-300 text-lg mb-6">
        So, you want to make DedCore even better? We love that for you (and for us)! Whether you’re a Rust wizard, a documentation enthusiast, or just here to fix a typo, you’re welcome.
      </p>
      <section className="mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">How to Get Started</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Fork the repo on <a href="https://github.com/manishyoudumb/dedcore" className="text-green-400 underline">GitHub</a>. (It’s like cloning, but with more commitment.)</li>
          <li>Clone your fork: <code className="bg-gray-700 px-1 rounded">git clone https://github.com/your-username/dedcore.git</code></li>
          <li>Make a new branch for your feature or fix. Name it something fun. Or not. We’re not picky.</li>
          <li>Write code, add docs, or break things (preferably not the last one).</li>
          <li>Push your branch and open a pull request. Add a witty description if you like.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">Coding Style & Guidelines</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Keep it idiomatic Rust. <code>cargo fmt</code> is your friend.</li>
          <li>Write clear, concise, and (if possible) funny comments.</li>
          <li>Add tests for new features. If you break the build, we’ll send you a virtual frown.</li>
          <li>Document your code. Future you (and future us) will thank you.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-cyan-400 text-xl font-bold mb-2">How to Get Help</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Check the <a href="/docs/faq" className="text-green-400 underline">FAQ</a> and <a href="/docs/cli" className="text-green-400 underline">CLI Reference</a>.</li>
          <li>Open an issue on GitHub if you’re stuck, confused, or just want to say hi.</li>
          <li>For urgent help, try yelling at your screen. It won’t work, but it might feel good.</li>
        </ul>
      </section>
      <p className="text-gray-400">Thanks for making DedCore better! May your code compile on the first try (but if not, we’ve all been there).</p>
    </div>
  );
}
