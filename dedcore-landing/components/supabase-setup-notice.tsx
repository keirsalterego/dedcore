export default function SupabaseSetupNotice() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-lg font-bold mb-2 text-cyan-400">Newsletter Setup Required</h2>
      <p className="text-gray-300 mb-4">
        To use the newsletter feature, you need to configure Supabase:
      </p>
      <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
        <li>Create a Supabase project at <a href="https://supabase.com" className="text-green-400 underline" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
        <li>Copy your project URL and anon key from Settings &gt; API</li>
        <li>Create a <code className="bg-gray-700 px-1 rounded">.env.local</code> file with your credentials</li>
        <li>Run the SQL script from <code className="bg-gray-700 px-1 rounded">supabase-setup.sql</code></li>
      </ol>
      <div className="bg-gray-800 border border-gray-600 rounded p-3 mb-4">
        <p className="text-gray-400 text-sm mb-2">Add to your <code className="bg-gray-700 px-1 rounded">.env.local</code>:</p>
        <pre className="text-green-400 text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
        </pre>
      </div>
      <p className="text-gray-400 text-sm">
        See <code className="bg-gray-700 px-1 rounded">NEWSLETTER_SETUP.md</code> for detailed instructions.
      </p>
    </div>
  )
} 