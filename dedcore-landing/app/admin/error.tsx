'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Admin Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Terminal Header */}
        <div className="bg-gray-900 border border-gray-700 rounded-t-lg p-3 mb-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm font-mono ml-4">admin-error.sh</span>
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-black border border-gray-700 border-t-0 rounded-b-lg p-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">$</span>
              <span className="text-white">./admin --error</span>
            </div>
            
            <div className="text-red-400 ml-4 space-y-2">
              <div>ERROR: Something went wrong!</div>
              <div className="text-sm text-gray-400">
                {error.message || 'An unexpected error occurred'}
              </div>
              {error.digest && (
                <div className="text-xs text-gray-500">
                  Error ID: {error.digest}
                </div>
              )}
            </div>

            <div className="flex space-x-4 ml-4">
              <button
                onClick={reset}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/admin/login')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 