export default function Changelog() {
  return (
    <div className="prose dark:prose-invert mx-auto p-8">
      <h1 className="text-green-400 text-3xl font-extrabold mb-4">Changelog</h1>
      <p className="text-gray-300 text-lg mb-8">All the glorious (and sometimes questionable) changes in DedCore. If you see your favorite bug here, it’s probably fixed. If not, it’s a feature.</p>
      <div className="relative border-l-4 border-green-400 pl-8 mb-8">
        <div className="mb-8">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">v0.1.0</span>
          <span className="text-gray-400 text-xs ml-2">2025-03-01</span>
          <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
            <li>It runs! (Most of the time.)</li>
            
          </ul>
        </div>
      </div>
      <p className="text-gray-400">Want to see what’s next? Check the <a href="https://github.com/manishyoudumb/dedcore" className="text-green-400 underline">GitHub repo</a> for the bleeding edge (and maybe a few paper cuts).</p>
    </div>
  );
}