export default function ContactPage() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-3xl font-extrabold mb-4">Contact & Support</h1>
      <p className="text-gray-300 text-lg mb-6">
        Need help? Found a bug? Want to request a feature or just vent about your duplicate files?
      </p>
      <div className="bg-gray-800 border-l-4 border-green-400 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold text-green-300 mb-2">How to Get Support</h2>
        <ul className="list-disc list-inside text-gray-200 space-y-2">
          <li>
            <span className="font-semibold">Open an issue on our <a href="https://github.com/manishyoudumb/dedcore/issues" className="text-green-400 underline">GitHub Issues page</a></span>.<br />
            This is the <span className="italic">only</span> way to get support, report bugs, or request features. We don’t do email. We barely do sleep.
          </li>
        </ul>
      </div>
      <p className="text-gray-400 text-sm">Please search for your issue before opening a new one. Duplicate issues will be... well, you know.</p>
    </div>
  );
}
