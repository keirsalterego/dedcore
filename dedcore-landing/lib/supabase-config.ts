// Configuration checker for Supabase
export function checkSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      configured: false,
      error: 'Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    }
  }

  return {
    configured: true,
    url: supabaseUrl,
    key: supabaseAnonKey
  }
}

// Safe Supabase client creation
export function createSupabaseClient() {
  const config = checkSupabaseConfig()
  
  if (!config.configured) {
    throw new Error(config.error)
  }

  // Import here to avoid issues during build
  const { createClient } = require('@supabase/supabase-js')
  return createClient(config.url, config.key)
} 