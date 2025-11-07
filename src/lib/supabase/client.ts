import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if Supabase is properly configured
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url') {
    // Return a null client for demo mode - components will handle gracefully
    return null as any
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  )
}

// Helper to check if Supabase is configured
export function isSupabaseConfigured() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url')
}
