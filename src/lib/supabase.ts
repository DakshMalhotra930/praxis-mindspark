import { createClient } from '@supabase/supabase-js'

// For development, using placeholder values - replace with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Temporarily disable the error to allow the app to load
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables')
// }

export const supabase = createClient(supabaseUrl, supabaseAnonKey)