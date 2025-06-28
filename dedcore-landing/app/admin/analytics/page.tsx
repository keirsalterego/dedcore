"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin-layout'
import { getActiveSubscribers } from '@/lib/supabase'
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  PieChart,
  Activity,
  Users,
  Mail,
  Clock
} from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  created_at: string
  source: string
  status: string
}

interface AnalyticsData {
  totalSubscribers: number
  activeSubscribers: number
  unsubscribed: number
  signupsByDay: { date: string; count: number }[]
  signupsBySource: { source: string; count: number }[]
  signupsByHour: { hour: number; count: number }[]
  growthRate: number
  avgDailySignups: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    unsubscribed: 0,
    signupsByDay: [],
    signupsBySource: [],
    signupsByHour: [],
    growthRate: 0,
    avgDailySignups: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await getActiveSubscribers()
        if (result.success && result.data) {
          const subscribers = result.data as Subscriber[]
          
          // Calculate basic stats
          const totalSubscribers = subscribers.length
          const activeSubscribers = subscribers.filter(s => s.status === 'active').length
          const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed').length

          // Signups by day (last 30 days)
          const signupsByDay: { [key: string]: number } = {}
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          
          for (let i = 0; i < 30; i++) {
            const date = new Date(thirtyDaysAgo)
            date.setDate(date.getDate() + i)
            const dateStr = date.toISOString().split('T')[0]
            signupsByDay[dateStr] = 0
          }
          
          subscribers.forEach(s => {
            const signupDate = new Date(s.created_at).toISOString().split('T')[0]
            if (signupsByDay[signupDate] !== undefined) {
              signupsByDay[signupDate]++
            }
          })

          // Signups by source
          const sourceCounts: { [key: string]: number } = {}
          subscribers.forEach(s => {
            sourceCounts[s.source] = (sourceCounts[s.source] || 0) + 1
          })

          // Signups by hour
          const hourCounts: { [key: number]: number } = {}
          for (let i = 0; i < 24; i++) {
            hourCounts[i] = 0
          }
          
          subscribers.forEach(s => {
            const hour = new Date(s.created_at).getHours()
            hourCounts[hour]++
          })

          // Calculate growth rate (comparing last 7 days to previous 7 days)
          const now = new Date()
          const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
          
          const lastWeekSignups = subscribers.filter(s => 
            new Date(s.created_at) >= lastWeek
          ).length
          
          const previousWeekSignups = subscribers.filter(s => {
            const date = new Date(s.created_at)
            return date >= twoWeeksAgo && date < lastWeek
          }).length
          
          const growthRate = previousWeekSignups > 0 
            ? ((lastWeekSignups - previousWeekSignups) / previousWeekSignups) * 100 
            : 0

          // Average daily signups
          const avgDailySignups = totalSubscribers > 0 
            ? Math.round((totalSubscribers / 30) * 100) / 100 
            : 0

          setData({
            totalSubscribers,
            activeSubscribers,
            unsubscribed,
            signupsByDay: Object.entries(signupsByDay).map(([date, count]) => ({ date, count })),
            signupsBySource: Object.entries(sourceCounts)
              .map(([source, count]) => ({ source, count }))
              .sort((a, b) => b.count - a.count),
            signupsByHour: Object.entries(hourCounts)
              .map(([hour, count]) => ({ hour: parseInt(hour), count }))
              .sort((a, b) => a.hour - b.hour),
            growthRate,
            avgDailySignups
          })
        } else {
          setError('Failed to fetch analytics data')
        }
      } catch (err: any) {
        if (err.message && err.message.includes('Supabase is not configured')) {
          setError('Supabase is not configured')
        } else {
          setError('An error occurred while fetching analytics')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span className="text-white">./admin --load-analytics</span>
          </div>
          <div className="text-gray-400 ml-4">Loading analytics data...</div>
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
            <span className="text-white">./admin --analytics</span>
          </div>
          <div className="text-gray-400 ml-4">Newsletter Analytics & Insights</div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="text-blue-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">{data.totalSubscribers}</div>
                <div className="text-sm text-gray-400">Total Subscribers</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-green-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">{data.avgDailySignups}</div>
                <div className="text-sm text-gray-400">Avg Daily Signups</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Activity className="text-yellow-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">{data.growthRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Growth Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Mail className="text-purple-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">{data.activeSubscribers}</div>
                <div className="text-sm text-gray-400">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Signups by Day */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="text-cyan-400" size={18} />
              <h3 className="font-bold text-white">Signups by Day (Last 30 Days)</h3>
            </div>
            <div className="space-y-2">
              {data.signupsByDay.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div className="text-gray-300 text-sm">{day.date}</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full" 
                        style={{ width: `${Math.min((day.count / Math.max(...data.signupsByDay.map(d => d.count))) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-green-400 font-bold text-sm w-8 text-right">{day.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signups by Source */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <PieChart className="text-green-400" size={18} />
              <h3 className="font-bold text-white">Signups by Source</h3>
            </div>
            <div className="space-y-2">
              {data.signupsBySource.map((source) => (
                <div key={source.source} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <div className="text-white text-sm">{source.source}</div>
                  <div className="text-green-400 font-bold">{source.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signups by Hour */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="text-yellow-400" size={18} />
            <h3 className="font-bold text-white">Signups by Hour of Day</h3>
          </div>
          <div className="grid grid-cols-12 gap-2">
            {data.signupsByHour.map((hour) => (
              <div key={hour.hour} className="text-center">
                <div className="text-gray-400 text-xs mb-1">{hour.hour}:00</div>
                <div className="bg-gray-700 rounded h-20 relative">
                  <div 
                    className="bg-blue-400 rounded-b absolute bottom-0 w-full" 
                    style={{ height: `${Math.min((hour.count / Math.max(...data.signupsByHour.map(h => h.count))) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-green-400 text-xs mt-1">{hour.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="text-purple-400" size={18} />
            <h3 className="font-bold text-white">Key Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-gray-300 text-sm">
                <span className="text-green-400">•</span> Most active signup time: {
                  data.signupsByHour.reduce((max, hour) => hour.count > max.count ? hour : max).hour
                }:00
              </div>
              <div className="text-gray-300 text-sm">
                <span className="text-green-400">•</span> Top source: {data.signupsBySource[0]?.source || 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-300 text-sm">
                <span className="text-green-400">•</span> Growth trend: {data.growthRate > 0 ? '📈 Increasing' : '📉 Decreasing'}
              </div>
              <div className="text-gray-300 text-sm">
                <span className="text-green-400">•</span> Conversion rate: {data.totalSubscribers > 0 ? Math.round((data.activeSubscribers / data.totalSubscribers) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 