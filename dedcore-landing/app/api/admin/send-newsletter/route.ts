import { NextRequest, NextResponse } from 'next/server'
import { sendNewsletter } from '@/lib/email'
import { getActiveSubscribers } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { subject, content, testMode, testEmail } = await request.json()
    
    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      )
    }

    if (testMode && testEmail) {
      // Send test email
      const { sendTestEmail } = await import('@/lib/email')
      const result = await sendTestEmail(testEmail)
      
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          message: 'Test email sent successfully',
          sent: 1,
          failed: 0
        })
      } else {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        )
      }
    }

    // Get active subscribers
    const subscribersResult = await getActiveSubscribers()
    
    if (!subscribersResult.success || !subscribersResult.data) {
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      )
    }
    
    const subscriberEmails = subscribersResult.data.map(s => s.email)

    if (subscriberEmails.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      )
    }

    // Send newsletter
    const result = await sendNewsletter(subject, content, subscriberEmails)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Newsletter sent to ${result.sent} subscribers`,
        sent: result.sent,
        failed: result.failed,
        errors: result.errors
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send newsletter', errors: result.errors },
        { status: 500 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 