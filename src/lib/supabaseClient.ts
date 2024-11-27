import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iztvqnjsqnebozcjcuik.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6dHZxbmpzcW5lYm96Y2pjdWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1MzcwODEsImV4cCI6MjA0ODExMzA4MX0.f5qQJOw-9Gm57rNwWc2u6-qQrssdlJ9BrO0hpdTf9nI';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});