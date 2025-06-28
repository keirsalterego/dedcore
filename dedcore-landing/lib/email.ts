import nodemailer from 'nodemailer'

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}

// Send newsletter to subscribers
export async function sendNewsletter(
  subject: string,
  content: string,
  subscribers: string[]
): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
  const results = {
    success: false,
    sent: 0,
    failed: 0,
    errors: [] as string[]
  }

  try {
    // Verify email config first
    if (!(await verifyEmailConfig())) {
      results.errors.push('Email configuration is invalid')
      return results
    }

    // Send to each subscriber
    for (const email of subscribers) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: subject,
          html: content,
        })
        results.sent++
      } catch (error) {
        results.failed++
        results.errors.push(`Failed to send to ${email}: ${error}`)
      }
    }

    results.success = results.sent > 0
    return results
  } catch (error) {
    results.errors.push(`General error: ${error}`)
    return results
  }
}

// Send test email
export async function sendTestEmail(to: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!(await verifyEmailConfig())) {
      return { success: false, error: 'Email configuration is invalid' }
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'DedCore Admin - Test Email',
      html: `
        <h2>DedCore Admin Test Email</h2>
        <p>This is a test email from your DedCore admin panel.</p>
        <p>If you received this, your email configuration is working correctly!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: `Failed to send test email: ${error}` }
  }
}

// Get email configuration status
export function getEmailConfigStatus(): {
  configured: boolean
  service: string
  user: string
  from: string
} {
  return {
    configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
    service: process.env.EMAIL_SERVICE || 'Not configured',
    user: process.env.EMAIL_USER || 'Not configured',
    from: process.env.EMAIL_FROM || 'Not configured',
  }
} 