"use client"

import { useState, useEffect } from 'react'
import { getActiveSubscribers } from '@/lib/supabase'
import AdminLayout from '@/components/admin-layout'
import SupabaseSetupNotice from '@/components/supabase-setup-notice'
import { Users, Download, Search, Filter } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  created_at: string
  source: string
  status: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const result = await getActiveSubscribers()
        if (result.success) {
          setSubscribers(result.data || [])
        } else {
          setError('Failed to fetch subscribers')
        }
      } catch (err: unknown) {
        // Check if it's a configuration error
        if (err instanceof Error && err.message && err.message.includes('Supabase is not configured')) {
          setError('Supabase is not configured. Please set up your environment variables.')
        } else {
          setError('An error occurred while fetching subscribers')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSubscribers()
  }, [])

  // Filter and search subscribers
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.source.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || subscriber.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    const csvContent = [
      'Email,Source,Status,Created At',
      ...filteredSubscribers.map(s => 
        `${s.email},${s.source},${s.status},${new Date(s.created_at).toISOString()}`
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dedcore-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span className="text-white">./admin --load-subscribers</span>
          </div>
          <div className="text-gray-400 ml-4">Loading subscribers...</div>
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
          <div className="text-red-400 ml-4">{error}</div>
          {error.includes('Supabase is not configured') && <SupabaseSetupNotice />}
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
            <span className="text-white">./admin --subscribers</span>
          </div>
          <div className="text-gray-400 ml-4">Newsletter Subscribers Management</div>
        </div>

        {/* Stats and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="text-blue-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">{subscribers.length}</div>
                <div className="text-sm text-gray-400">Total Subscribers</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="text-green-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">
                  {subscribers.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-400">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="text-red-400" size={20} />
              <div>
                <div className="text-2xl font-bold text-white">
                  {subscribers.filter(s => s.status === 'unsubscribed').length}
                </div>
                <div className="text-sm text-gray-400">Unsubscribed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by email or source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold text-white">Subscribers ({filteredSubscribers.length})</h3>
          </div>
          
          {filteredSubscribers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              {searchTerm || filterStatus !== 'all' ? 'No subscribers match your filters' : 'No subscribers yet'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-left p-4 border-b border-gray-700 text-gray-300">Email</th>
                    <th className="text-left p-4 border-b border-gray-700 text-gray-300">Source</th>
                    <th className="text-left p-4 border-b border-gray-700 text-gray-300">Status</th>
                    <th className="text-left p-4 border-b border-gray-700 text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                      <td className="p-4">
                        <div className="text-white">{subscriber.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-400">{subscriber.source}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          subscriber.status === 'active' 
                            ? 'bg-green-900 text-green-400' 
                            : 'bg-red-900 text-red-400'
                        }`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-400 text-sm">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
} 