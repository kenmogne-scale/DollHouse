import { redirect } from "next/navigation";
import { AuthForm } from "@/app/(public)/auth/AuthForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DemoAuth } from "@/components/demo/DemoAuth";

export default async function AuthPage() {
  if (!getSupabaseEnv()) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <div className="mb-6">
          <div className="font-display text-sm font-semibold text-slate-700">
            DollCloset ✦
          </div>
          <div className="mt-1 text-sm text-slate-500">Demo Auth (lokal)</div>
        </div>
        <DemoAuth />
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/closet");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
      <div className="mb-6">
        <div className="font-display text-sm font-semibold text-slate-700">
          DollCloset ✦
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Login / Register – Supabase email+password
        </div>
      </div>

      <AuthForm defaultMode="register" />
    </main>
  );
}
