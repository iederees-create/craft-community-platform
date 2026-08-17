import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Deliberately plain @supabase/supabase-js (localStorage session storage),
// not @supabase/ssr — this app is a static export with no server runtime,
// so there is no cookie-reading server to make an SSR-style client useful.
// OAuth/email-link callback handling is Codex's static-callback-architecture
// responsibility; this client covers password-based email auth directly.
let cachedClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment."
    );
  }

  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return cachedClient;
}
