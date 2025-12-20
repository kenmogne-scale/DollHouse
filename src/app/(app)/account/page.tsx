import { Sparkles, UserCircle } from "lucide-react";
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
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-fuchsia-400" />
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-white">Account</h1>
        </div>
        <p className="text-sm text-white/50">
          Minimal MVP – E-Mail anzeigen, Logout oben rechts.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 border-2 border-fuchsia-500/30 shadow-[0_0_20px_rgba(255,20,147,0.2)]">
            <UserCircle className="h-7 w-7 text-fuchsia-400" />
          </div>
          <div>
            <div className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider mb-1">E-Mail</div>
            <div className="font-medium text-white">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
