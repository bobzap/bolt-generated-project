import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return createClient<Database>(
      'placeholder-url',
      'placeholder-key',
      { auth: { persistSession: false } }
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
