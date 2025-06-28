// Simple admin authentication using server-side API routes
// In production, you should use a more secure authentication system

export interface AdminSession {
  isAuthenticated: boolean
  loginTime?: number
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/check-auth')
    const data = await response.json()
    return data.authenticated
  } catch {
    return false
  }
}

// Login function
export async function login(password: string): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
    
    const data = await response.json()
    return data.success
  } catch {
    return false
  }
}

// Logout function
export async function logout(): Promise<void> {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
    })
  } catch {
    // Ignore errors on logout
  }
}

// Get session info (simplified for now)
export function getSession(): AdminSession | null {
  return {
    isAuthenticated: false,
    loginTime: Date.now()
  }
} 