import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Admin authentication not configured' },
        { status: 500 }
      )
    }
    
    if (password === ADMIN_PASSWORD) {
      // Create a simple session token (in production, use proper JWT)
      const sessionToken = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64')
      
      const response = NextResponse.json({ success: true })
      
      // Set a secure cookie
      response.cookies.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
      })
      
      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 