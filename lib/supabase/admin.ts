
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  // NOTE: Ensure SUPABASE_SERVICE_ROLE_KEY is set in your .env.local
  // This key has full admin privileges (bypasses RLS). Use with caution.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Fallback for dev if needed, but won't work for restricted RLS
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
