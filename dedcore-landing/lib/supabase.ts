import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create the client if environment variables are available
let supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

// Type for newsletter subscribers
export interface NewsletterSubscriber {
  id?: string
  email: string
  created_at?: string
  status?: 'active' | 'unsubscribed'
  source?: string
}

// Function to add a new subscriber
export async function addNewsletterSubscriber(email: string, source: string = 'website') {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email.toLowerCase().trim(),
          source,
          status: 'active'
        }
      ])
      .select()

    if (error) {
      // If it's a duplicate email error, we can handle it gracefully
      if (error.code === '23505') { // Unique constraint violation
        return { success: true, message: 'Email already subscribed!' }
      }
      throw error
    }

    return { success: true, data, message: 'Successfully subscribed!' }
  } catch (error) {
    console.error('Error adding subscriber:', error)
    return { success: false, error, message: 'Failed to subscribe. Please try again.' }
  }
}

// Function to get all active subscribers
export async function getActiveSubscribers() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return { success: false, error }
  }
}

// Function to unsubscribe a user
export async function unsubscribeNewsletter(email: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email.toLowerCase().trim())
      .select()

    if (error) throw error
    return { success: true, data, message: 'Successfully unsubscribed!' }
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return { success: false, error, message: 'Failed to unsubscribe. Please try again.' }
  }
}

// Export the client for direct use (if needed)
export { supabase } 