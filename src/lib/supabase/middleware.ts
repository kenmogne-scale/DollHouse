import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseMiddlewareClient(req: NextRequest) {
  const res = NextResponse.next();
  const env = getSupabaseEnv();
  if (!env) throw new Error("Supabase Env Vars fehlen.");
  const { url, anonKey } = env;

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          req.cookies.set(name, value);
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, res };
}


