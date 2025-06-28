import { NextRequest, NextResponse } from 'next/server'
import { addNewsletterSubscriber } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'website' } = await request.json()

    // Basic validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const result = await addNewsletterSubscriber(email, source)

    if (result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Newsletter signup error:', error)
    
    // Check if it's a configuration error
    if (error.message && error.message.includes('Missing Supabase environment variables')) {
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 