import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin-session')
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false })
    }
    
    // In production, validate the session token properly
    // For now, just check if it exists
    return NextResponse.json({ authenticated: true })
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
} 