import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://wspwqnhjvngbolscemze.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcHdxbmhqdm5nYm9sc2NlbXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTgzNjgsImV4cCI6MjA5MjU3NDM2OH0.dT5EDkmbDlFfC5N0WvF2T3S5o8aYY7mK_UWdbFge7W0'
);