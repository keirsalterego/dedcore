import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    // Skip middleware for login page, API routes, and static assets
    if (pathname === '/admin/login' || 
        pathname.startsWith('/api/') || 
        pathname.includes('.') ||
        pathname.startsWith('/_next/')) {
      return NextResponse.next()
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin-session')
    
    if (!adminSession) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
} 