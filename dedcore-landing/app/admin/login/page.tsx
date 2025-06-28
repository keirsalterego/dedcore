"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, isAuthenticated } from '@/lib/auth'
import { Terminal, Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Redirect if already authenticated
    const checkAuth = async () => {
      if (await isAuthenticated()) {
        router.push('/admin')
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    if (await login(password)) {
      router.push('/admin')
    } else {
      setError('Invalid password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-4">
      {/* Terminal grid pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Terminal Header */}
        <div className="bg-gray-900 border border-gray-700 rounded-t-lg p-3 mb-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm font-mono ml-4">admin-login.sh</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-black border border-gray-700 border-t-0 rounded-b-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Terminal size={24} className="text-green-400" />
            <h1 className="text-xl font-bold">DEDCORE ADMIN</h1>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">$</span>
              <span className="text-white">./admin --login</span>
            </div>
            
            <div className="text-gray-300 ml-4 space-y-1">
              <div>Access restricted to authorized personnel</div>
              <div>Enter admin credentials to continue</div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <span className="text-white">password:</span>
              </div>
              
              <div className="relative ml-4">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
                  placeholder="Enter admin password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="ml-4 text-red-400 text-sm">
                <span className="text-red-400">ERROR:</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="ml-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-700 text-gray-500 text-sm">
            <div className="flex items-center space-x-2">
              <Lock size={12} />
              <span>Secure admin access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 