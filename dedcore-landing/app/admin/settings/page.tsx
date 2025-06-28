"use client"

import { useState } from 'react'
import AdminLayout from '@/components/admin-layout'
import { 
  Settings, 
  Shield, 
  Bell, 
  Mail, 
  Database,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw
} from 'lucide-react'

interface AdminSettings {
  adminPassword: string
  sessionTimeout: number
  emailNotifications: boolean
  autoBackup: boolean
  debugMode: boolean
  theme: 'dark' | 'light'
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    adminPassword: '',
    sessionTimeout: 24,
    emailNotifications: true,
    autoBackup: false,
    debugMode: false,
    theme: 'dark'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setMessage('Settings saved successfully!')
    setSaving(false)
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000)
  }

  const handleReset = () => {
    setSettings({
      adminPassword: '',
      sessionTimeout: 24,
      emailNotifications: true,
      autoBackup: false,
      debugMode: false,
      theme: 'dark'
    })
    setMessage('Settings reset to defaults')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span className="text-white">./admin --settings</span>
          </div>
          <div className="text-gray-400 ml-4">Admin Configuration & Preferences</div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Save className="text-green-400" size={18} />
              <span className="text-green-300">{message}</span>
            </div>
          </div>
        )}

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Settings */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="text-red-400" size={18} />
              <h3 className="font-bold text-white">Security Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Admin Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={settings.adminPassword}
                    onChange={(e) => setSettings(prev => ({ ...prev, adminPassword: e.target.value }))}
                    placeholder="Enter new password"
                    className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
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
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Session Timeout (hours)</label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="text-yellow-400" size={18} />
              <h3 className="font-bold text-white">Notification Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm">Email Notifications</div>
                  <div className="text-gray-400 text-xs">Receive alerts for new signups</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm">Auto Backup</div>
                  <div className="text-gray-400 text-xs">Automatically backup database</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Settings */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="text-blue-400" size={18} />
              <h3 className="font-bold text-white">System Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm">Debug Mode</div>
                  <div className="text-gray-400 text-xs">Enable detailed logging</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.debugMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, debugMode: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as 'dark' | 'light' }))}
                  className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                </select>
              </div>
            </div>
          </div>

          {/* Database Settings */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="text-green-400" size={18} />
              <h3 className="font-bold text-white">Database Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="text-gray-300 text-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="text-gray-400" size={14} />
                  <span>Connection Status: <span className="text-green-400">Connected</span></span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="text-gray-400" size={14} />
                  <span>Provider: <span className="text-blue-400">Supabase</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="text-gray-400" size={14} />
                  <span>Security: <span className="text-green-400">RLS Enabled</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="text-purple-400" size={18} />
            <h3 className="font-bold text-white">Actions</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white rounded transition-colors"
            >
              {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              <RefreshCw size={16} />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* Current Configuration */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="text-cyan-400" size={18} />
            <h3 className="font-bold text-white">Current Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Admin Password:</span>
                <span className="text-white">••••••••</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Session Timeout:</span>
                <span className="text-white">{settings.sessionTimeout} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email Notifications:</span>
                <span className={settings.emailNotifications ? 'text-green-400' : 'text-red-400'}>
                  {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Auto Backup:</span>
                <span className={settings.autoBackup ? 'text-green-400' : 'text-red-400'}>
                  {settings.autoBackup ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Debug Mode:</span>
                <span className={settings.debugMode ? 'text-green-400' : 'text-red-400'}>
                  {settings.debugMode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Theme:</span>
                <span className="text-white capitalize">{settings.theme}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 