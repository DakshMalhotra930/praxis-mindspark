import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zhcdugrwubgzntrqchpg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoY2R1Z3J3dWJnem50cnFjaHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDI0MTksImV4cCI6MjA3MzQxODQxOX0.KDiPNal4QZcP2_3pDHSta-YS_agR-uh733Tz3blkkHs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)