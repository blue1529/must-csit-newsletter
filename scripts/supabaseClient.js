// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'

const supabaseUrl = 'https://nkpetzhoavvzyezxytfr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rcGV0emhvYXZ2enllenh5dGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTczNDIsImV4cCI6MjA2NjU5MzM0Mn0.WA8xgsL1NB-oJK-LmE38xjvlXItN0UlpACfCo-C0zZQ'

console.log('Supabase Client Initializing...');
export const supabase = createClient(supabaseUrl, supabaseKey)