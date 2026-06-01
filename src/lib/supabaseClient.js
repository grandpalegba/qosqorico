import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sclhiriifrahplwcqrmx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjbGhpcmlpZnJhaHBsd2Nxcm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNzUwMzQsImV4cCI6MjA5NTc1MTAzNH0.jMSisQMXEeeaiht2ieOWnql_SrLrt--0-_pRpgfy-OQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
