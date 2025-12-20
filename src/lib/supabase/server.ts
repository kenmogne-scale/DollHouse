import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Supabase Env Vars fehlen. Setze NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local und starte den Dev-Server neu.",
    );
  }
  const { url, anonKey } = env;

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // In Server Components kann set fehlschlagen (immutable cookies). In Actions/Route Handlers klappt es.
        }
      },
    },
  });
}


