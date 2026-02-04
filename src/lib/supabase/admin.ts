import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client using service role key.
 * Server-side only — bypasses RLS for nex_x_* tables.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
