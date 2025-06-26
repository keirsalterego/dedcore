export default function FAQ() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-green-400 mb-4">Frequently Asked Questions</h1>
      <ul className="list-disc list-inside text-gray-300 mb-4">
        <li><b>Is DedCore safe?</b> Yes, all operations are local and you can preview files before deletion.</li>
        <li><b>Does DedCore support external drives?</b> Yes, you can scan any mounted drive.</li>
        <li><b>Can I undo deletions?</b> Yes, if you enable backup before deletion.</li>
        <li><b>How do I update DedCore?</b> Re-run the installer or download the latest release.</li>
      </ul>
    </div>
  );
} 