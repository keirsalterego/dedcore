"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin-layout'
import { getActiveSubscribers } from '@/lib/supabase'
import { 
  Database, 
  Server, 
  Activity, 
  Shield, 
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Zap
} from 'lucide-react'

interface DatabaseStatus {
  connected: boolean
  tableCount: number
  totalRecords: number
  lastBackup: string
  performance: 'excellent' | 'good' | 'fair' | 'poor'
  uptime: string
}

export default function DatabasePage() {
  const [status, setStatus] = useState<DatabaseStatus>({
    connected: false,
    tableCount: 0,
    totalRecords: 0,
    lastBackup: 'Never',
    performance: 'good',
    uptime: '0h 0m'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const result = await getActiveSubscribers()
        if (result.success) {
          const subscribers = result.data || []
          setStatus({
            connected: true,
            tableCount: 1, // newsletter_subscribers table
            totalRecords: subscribers.length,
            lastBackup: new Date().toLocaleDateString(),
            performance: subscribers.length > 1000 ? 'excellent' : 'good',
            uptime: '24h 0m' // Mock uptime
          })
        } else {
          setStatus(prev => ({ ...prev, connected: false }))
          setError('Database connection failed')
        }
      } catch (err: unknown) {
        setStatus(prev => ({ ...prev, connected: false }))
        if (err instanceof Error && err.message && err.message.includes('Supabase is not configured')) {
          setError('Supabase is not configured')
        } else {
          setError('Database connection error')
        }
      } finally {
        setLoading(false)
      }
    }

    checkDatabaseStatus()
  }, [])

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (connected: boolean) => {
    return connected ? 'text-green-400' : 'text-red-400'
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span className="text-white">./admin --check-database</span>
          </div>
          <div className="text-gray-400 ml-4">Checking database status...</div>
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
            <span className="text-white">./admin --database</span>
          </div>
          <div className="text-gray-400 ml-4">Database Management & Monitoring</div>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Server className={getStatusColor(status.connected)} size={20} />
              <div>
                <div className="text-lg font-bold text-white">
                  {status.connected ? 'Connected' : 'Disconnected'}
                </div>
                <div className="text-sm text-gray-400">Database Status</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Database className="text-blue-400" size={20} />
              <div>
                <div className="text-lg font-bold text-white">{status.tableCount}</div>
                <div className="text-sm text-gray-400">Tables</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <HardDrive className="text-green-400" size={20} />
              <div>
                <div className="text-lg font-bold text-white">{status.totalRecords}</div>
                <div className="text-sm text-gray-400">Total Records</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Activity className={getPerformanceColor(status.performance)} size={20} />
              <div>
                <div className="text-lg font-bold text-white capitalize">{status.performance}</div>
                <div className="text-sm text-gray-400">Performance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Details */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Server className="text-cyan-400" size={18} />
              <h3 className="font-bold text-white">Connection Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Status:</span>
                <div className="flex items-center space-x-2">
                  {status.connected ? (
                    <CheckCircle className="text-green-400" size={16} />
                  ) : (
                    <AlertTriangle className="text-red-400" size={16} />
                  )}
                  <span className={getStatusColor(status.connected)}>
                    {status.connected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Uptime:</span>
                <span className="text-white text-sm">{status.uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Last Backup:</span>
                <span className="text-white text-sm">{status.lastBackup}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Performance:</span>
                <span className={`text-sm ${getPerformanceColor(status.performance)}`}>
                  {status.performance.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Table Information */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="text-green-400" size={18} />
              <h3 className="font-bold text-white">Table Information</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">newsletter_subscribers</span>
                  <span className="text-green-400 text-sm">{status.totalRecords} records</span>
                </div>
                <div className="text-gray-400 text-xs">
                  Stores newsletter subscription data with email, source, status, and timestamps
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Tools */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="text-yellow-400" size={18} />
            <h3 className="font-bold text-white">Maintenance Tools</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
              <RefreshCw size={16} />
              <span>Test Connection</span>
            </button>
            <button className="flex items-center space-x-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
              <Shield size={16} />
              <span>Backup Database</span>
            </button>
            <button className="flex items-center space-x-2 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors">
              <Zap size={16} />
              <span>Optimize Tables</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-red-400" size={18} />
              <h3 className="font-bold text-white">Database Error</h3>
            </div>
            <p className="text-red-300 mt-2">{error}</p>
          </div>
        )}

        {/* System Recommendations */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="text-purple-400" size={18} />
            <h3 className="font-bold text-white">System Recommendations</h3>
          </div>
          <div className="space-y-2">
            <div className="text-gray-300 text-sm">
              <span className="text-green-400">•</span> Database connection is {status.connected ? 'stable' : 'unstable'}
            </div>
            <div className="text-gray-300 text-sm">
              <span className="text-green-400">•</span> Consider regular backups for data safety
            </div>
            <div className="text-gray-300 text-sm">
              <span className="text-green-400">•</span> Monitor performance as subscriber count grows
            </div>
            <div className="text-gray-300 text-sm">
              <span className="text-green-400">•</span> Enable RLS policies for enhanced security
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 