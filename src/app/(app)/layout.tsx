import type { ReactNode } from "react";
import { AppNavbar } from "@/components/AppNavbar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { cookies } from "next/headers";
import { DEMO_EMAIL_COOKIE } from "@/lib/demo/constants";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const envOk = !!getSupabaseEnv();
  const userEmail = envOk
    ? (
        await (await createSupabaseServerClient()).auth.getUser()
      ).data.user?.email
    : (await cookies()).get(DEMO_EMAIL_COOKIE)?.value ?? null;

  return (
    <div className="min-h-dvh">
      <AppNavbar email={userEmail} demo={!envOk} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}


