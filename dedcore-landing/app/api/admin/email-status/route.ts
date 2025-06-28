import { NextResponse } from 'next/server'
import { getEmailConfigStatus, verifyEmailConfig } from '@/lib/email'

export async function GET() {
  try {
    const configStatus = getEmailConfigStatus()
    const isWorking = await verifyEmailConfig()
    
    return NextResponse.json({
      configured: configStatus.configured,
      working: isWorking,
      service: configStatus.service,
      user: configStatus.user,
      from: configStatus.from
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to check email status' },
      { status: 500 }
    )
  }
} 