"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin-layout'
import { getActiveSubscribers } from '@/lib/supabase'
import { 
  Users, 
  TrendingUp, 
  Mail, 
  Activity, 
  Calendar,
  BarChart3,
  Zap,
  Shield,
  Database,
  Download,
  RefreshCw,
  Settings,
  Copy
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Subscriber {
  id: string
  email: string
  created_at: string
  source: string
  status: string
}

interface DashboardStats {
  totalSubscribers: number
  activeSubscribers: number
  unsubscribed: number
  todaySignups: number
  thisWeekSignups: number
  thisMonthSignups: number
  topSources: { source: string; count: number }[]
  recentSignups: Subscriber[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    unsubscribed: 0,
    todaySignups: 0,
    thisWeekSignups: 0,
    thisMonthSignups: 0,
    topSources: [],
    recentSignups: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getActiveSubscribers()
        if (result.success && result.data) {
          const subscribers = result.data as Subscriber[]
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

          // Calculate stats
          const totalSubscribers = subscribers.length
          const activeSubscribers = subscribers.filter(s => s.status === 'active').length
          const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed').length
          
          const todaySignups = subscribers.filter(s => 
            new Date(s.created_at) >= today
          ).length
          
          const thisWeekSignups = subscribers.filter(s => 
            new Date(s.created_at) >= weekAgo
          ).length
          
          const thisMonthSignups = subscribers.filter(s => 
            new Date(s.created_at) >= monthAgo
          ).length

          // Top sources
          const sourceCounts: { [key: string]: number } = {}
          subscribers.forEach(s => {
            sourceCounts[s.source] = (sourceCounts[s.source] || 0) + 1
          })
          const topSources = Object.entries(sourceCounts)
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

          // Recent signups
          const recentSignups = subscribers
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)

          setStats({
            totalSubscribers,
            activeSubscribers,
            unsubscribed,
            todaySignups,
            thisWeekSignups,
            thisMonthSignups,
            topSources,
            recentSignups
          })
        } else {
          setError('Failed to fetch data')
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.message && err.message.includes('Supabase is not configured')) {
          setError('Supabase is not configured')
        } else {
          setError('An error occurred while fetching data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span className="text-white">./admin --load-dashboard</span>
          </div>
          <div className="text-gray-400 ml-4">Loading dashboard data...</div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">$</span>
            <span className="text-white">./admin --error</span>
          </div>
          <div className="text-red-400 ml-4">ERROR: {error}</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span className="text-white">./admin --dashboard</span>
          </div>
          <div className="text-gray-400 ml-4">DedCore Newsletter Administration Dashboard</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="text-blue-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalSubscribers}</div>
                <div className="text-sm text-gray-400">Total Subscribers</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Mail className="text-green-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">{stats.activeSubscribers}</div>
                <div className="text-sm text-gray-400">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-yellow-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">{stats.todaySignups}</div>
                <div className="text-sm text-gray-400">Today</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Activity className="text-purple-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">{stats.thisWeekSignups}</div>
                <div className="text-sm text-gray-400">This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Signups */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="text-cyan-400" size={18} />
              <h3 className="font-bold text-white">Recent Signups</h3>
            </div>
            <div className="space-y-2">
              {stats.recentSignups.length > 0 ? (
                stats.recentSignups.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                    <div className="flex-1">
                      <div className="text-white text-sm">{subscriber.email}</div>
                      <div className="text-gray-400 text-xs">{subscriber.source}</div>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No recent signups</div>
              )}
            </div>
          </div>

          {/* Top Sources */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="text-green-400" size={18} />
              <h3 className="font-bold text-white">Top Sources</h3>
            </div>
            <div className="space-y-2">
              {stats.topSources.length > 0 ? (
                stats.topSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                    <div className="text-white text-sm">{source.source}</div>
                    <div className="text-green-400 font-bold">{source.count}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No data available</div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="text-green-400" size={18} />
            <h3 className="font-bold text-white">System Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Database: Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">API: Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Security: Active</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="text-yellow-400" size={18} />
            <h3 className="font-bold text-white">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => router.push('/admin/subscribers')}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors group"
            >
              <Download size={20} className="group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <div className="font-medium">Export Subscribers</div>
                <div className="text-xs text-blue-200">Download CSV data</div>
              </div>
            </button>
            
            <button 
              onClick={() => router.push('/admin/newsletter')}
              className="flex flex-col items-center space-y-2 p-4 bg-green-600 hover:bg-green-700 text-white rounded transition-colors group"
            >
              <Mail size={20} className="group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <div className="font-medium">Send Newsletter</div>
                <div className="text-xs text-green-200">Compose & send emails</div>
              </div>
            </button>
            
            <button 
              onClick={() => router.push('/admin/analytics')}
              className="flex flex-col items-center space-y-2 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors group"
            >
              <BarChart3 size={20} className="group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <div className="font-medium">View Analytics</div>
                <div className="text-xs text-purple-200">Growth & insights</div>
              </div>
            </button>
            
            <button 
              onClick={() => router.push('/admin/database')}
              className="flex flex-col items-center space-y-2 p-4 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors group"
            >
              <Database size={20} className="group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <div className="font-medium">Database</div>
                <div className="text-xs text-orange-200">Monitor & maintain</div>
              </div>
            </button>
          </div>
          
          {/* Additional Quick Actions */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => {
                  // Refresh dashboard data
                  window.location.reload()
                }}
                className="flex items-center justify-center space-x-2 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <RefreshCw size={16} />
                <span>Refresh Data</span>
              </button>
              
              <button 
                onClick={() => router.push('/admin/settings')}
                className="flex items-center justify-center space-x-2 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <Settings size={16} />
                <span>Admin Settings</span>
              </button>
              
              <button 
                onClick={() => {
                  // Copy current stats to clipboard
                  const statsText = `DedCore Newsletter Stats:
Total Subscribers: ${stats.totalSubscribers}
Active: ${stats.activeSubscribers}
Today: ${stats.todaySignups}
This Week: ${stats.thisWeekSignups}`
                  navigator.clipboard.writeText(statsText)
                  alert('Stats copied to clipboard!')
                }}
                className="flex items-center justify-center space-x-2 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <Copy size={16} />
                <span>Copy Stats</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 