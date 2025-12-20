import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DemoAccount } from "@/components/demo/DemoAccount";

export default async function AccountPage() {
  if (!getSupabaseEnv()) return <DemoAccount />;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-800">Account ✦</h1>
        <p className="mt-1 text-sm text-slate-500">
          Minimal MVP – E-Mail anzeigen, Logout oben rechts.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-5">
        <div className="text-xs text-slate-500">E-Mail</div>
        <div className="mt-1 font-medium text-slate-800">{user?.email}</div>
      </div>
    </div>
  );
}
