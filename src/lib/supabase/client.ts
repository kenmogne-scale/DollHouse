"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Supabase Env Vars fehlen. Setze NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local und starte den Dev-Server neu.",
    );
  }
  const { url, anonKey } = env;
  return createBrowserClient<Database>(url, anonKey);
}


