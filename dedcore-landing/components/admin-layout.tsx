"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Terminal, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  Mail,
  Activity,
  Database,
  Shield
} from 'lucide-react'
import { logout, isAuthenticated } from '@/lib/auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  {
    name: 'Dashboard',
    icon: BarChart3,
    href: '/admin',
    description: 'Overview & analytics'
  },
  {
    name: 'Subscribers',
    icon: Users,
    href: '/admin/subscribers',
    description: 'Newsletter subscribers'
  },
  {
    name: 'Newsletter',
    icon: Mail,
    href: '/admin/newsletter',
    description: 'Send newsletters'
  },
  {
    name: 'Analytics',
    icon: Activity,
    href: '/admin/analytics',
    description: 'Signup analytics'
  },
  {
    name: 'Database',
    icon: Database,
    href: '/admin/database',
    description: 'Database management'
  },
  {
    name: 'Settings',
    icon: Settings,
    href: '/admin/settings',
    description: 'Admin settings'
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (await isAuthenticated()) {
          setAuthenticated(true)
        } else {
          router.push('/admin/login')
          return
        }
      } catch {
        router.push('/admin/login')
        return
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  useEffect(() => {
    if (!authenticated) return

    // Update time
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [authenticated])

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-2">Loading...</div>
          <div className="text-gray-400">Authenticating...</div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
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

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Terminal Header */}
        <div className="bg-black border-b border-gray-700 p-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm font-mono ml-4">admin-panel.sh</span>
          </div>
        </div>

        {/* Admin Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Terminal size={20} className="text-green-400" />
            <div>
              <h1 className="font-bold text-white">DEDCORE ADMIN</h1>
              <p className="text-xs text-gray-400">Administrative Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left
                  ${isActive 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-2">
            <div className="text-xs text-gray-400">
              <div>Session: {currentTime}</div>
              <div>Status: <span className="text-green-400">ACTIVE</span></div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 p-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="bg-gray-900 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <span className="text-white">./admin --status</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {currentTime}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
} 