"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin-layout'
import { 
  Mail, 
  Send, 
  Users, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface EmailStatus {
  configured: boolean
  working: boolean
  service: string
  user: string
  from: string
}

export default function NewsletterPage() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [testMode, setTestMode] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    checkEmailStatus()
  }, [])

  const checkEmailStatus = async () => {
    try {
      const response = await fetch('/api/admin/email-status')
      const data = await response.json()
      setEmailStatus(data)
    } catch (error) {
      console.error('Failed to check email status:', error)
    }
  }

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
          testMode,
          testEmail: testMode ? testEmail : undefined
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessageType('success')
        setMessage(data.message)
        if (!testMode) {
          setSubject('')
          setContent('')
        }
      } else {
        setMessageType('error')
        setMessage(data.error || 'Failed to send newsletter')
      }
    } catch {
      setMessageType('error')
      setMessage('Failed to send newsletter')
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessageType('error')
      setMessage('Please enter a test email address')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Test Newsletter',
          content: '<h2>Test Newsletter</h2><p>This is a test newsletter from DedCore Admin.</p>',
          testMode: true,
          testEmail
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessageType('success')
        setMessage('Test email sent successfully!')
      } else {
        setMessageType('error')
        setMessage(data.error || 'Failed to send test email')
      }
    } catch {
      setMessageType('error')
      setMessage('Failed to send test email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span className="text-white">./admin --newsletter</span>
          </div>
          <div className="text-gray-400 ml-4">Newsletter Composition & Distribution</div>
        </div>

        {/* Email Status */}
        {emailStatus && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="text-blue-400" size={18} />
              <h3 className="font-bold text-white">Email Configuration Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${emailStatus.configured ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-gray-300">Configured: {emailStatus.configured ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${emailStatus.working ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-gray-300">Working: {emailStatus.working ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-300">Service: <span className="text-blue-400">{emailStatus.service}</span></div>
                <div className="text-gray-300">From: <span className="text-blue-400">{emailStatus.from}</span></div>
              </div>
            </div>
            {!emailStatus.configured && (
              <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded text-red-300 text-sm">
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span>Email configuration is missing. Please set up EMAIL_USER and EMAIL_PASSWORD in your environment variables.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`border rounded-lg p-4 ${
            messageType === 'success' 
              ? 'bg-green-900 border-green-700 text-green-300' 
              : 'bg-red-900 border-red-700 text-red-300'
          }`}>
            <div className="flex items-center space-x-2">
              {messageType === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Newsletter Form */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Send className="text-green-400" size={20} />
            <h2 className="text-xl font-bold text-white">Compose Newsletter</h2>
          </div>

          <form onSubmit={handleSendNewsletter} className="space-y-6">
            {/* Test Mode Toggle */}
            <div className="flex items-center space-x-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
              <span className="text-white">Test Mode</span>
              {testMode && (
                <span className="text-yellow-400 text-sm">(Will only send to test email)</span>
              )}
            </div>

            {/* Test Email Input */}
            {testMode && (
              <div>
                <label className="block text-gray-300 text-sm mb-2">Test Email Address</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter test email address"
                  className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  required={testMode}
                />
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Newsletter subject"
                className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Content (HTML)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<h2>Newsletter Title</h2><p>Your newsletter content here...</p>"
                rows={12}
                className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 font-mono text-sm"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading || !emailStatus?.configured}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                <span>{testMode ? 'Send Test Email' : 'Send Newsletter'}</span>
              </button>
              
              {testMode && (
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={loading || !testEmail}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded transition-colors"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                  <span>Send Test Email</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Newsletter Tips */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-purple-400" size={18} />
            <h3 className="font-bold text-white">Newsletter Tips</h3>
          </div>
          <div className="text-sm text-gray-400 space-y-2">
            <div>• Use HTML tags for formatting (h1, h2, p, strong, em, etc.)</div>
            <div>• Test your newsletter before sending to all subscribers</div>
            <div>• Keep subject lines clear and engaging</div>
            <div>• Include a clear call-to-action in your content</div>
            <div>• Make sure your email configuration is working before sending</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 