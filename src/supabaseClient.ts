import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hclgkvjsftruczolpxbm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbGdrdmpzZnRydWN6b2xweGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Nzc4MzgsImV4cCI6MjA2NDQ1MzgzOH0.W6N3lpLP4RdYmNJeGUMJdaxBR7Vxp39EMEsdxJv2-Js';

export const supabase = createClient(supabaseUrl, supabaseKey);
