import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fyfvtrtggifyynoglcuy.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZnZ0cnRnZ2lmeXlub2dsY3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MzMwODMsImV4cCI6MjA0NDAwOTA4M30.mswxodUjyogVGNlLKAmmyCHhBsH0BBljEe0qafYk918';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
