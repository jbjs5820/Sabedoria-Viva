import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iztvqnjsqnebozcjcuik.supabase.co';
const supabaseServiceKey = 'YOUR_SERVICE_KEY'; // This should be the service_role key from Supabase

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);