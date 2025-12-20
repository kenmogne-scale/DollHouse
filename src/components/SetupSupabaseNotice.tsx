import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function SetupSupabaseNotice() {
  return (
    <div className="glass-card bubble-ring rounded-3xl p-6">
      <h2 className="font-display text-xl font-semibold">Supabase Setup fehlt</h2>
      <p className="mt-2 text-sm text-white/70">
        Setze bitte deine Env Vars, damit Auth/DB/Storage funktionieren:
      </p>
      <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 p-4 text-sm">
        <div className="text-white/80">
          1) Kopiere <code className="text-white">.env.example</code> →{" "}
          <code className="text-white">.env.local</code>
        </div>
        <div className="mt-2 text-white/80">
          2) Trage ein:
          <div className="mt-1 font-mono text-[12px] text-white/85">
            NEXT_PUBLIC_SUPABASE_URL=…
            <br />
            NEXT_PUBLIC_SUPABASE_ANON_KEY=…
          </div>
        </div>
        <div className="mt-2 text-white/80">
          3) Dev-Server neu starten: <code className="text-white">npm run dev</code>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="primary">
          <a
            href="https://supabase.com/dashboard/project/_/settings/api"
            target="_blank"
            rel="noreferrer"
          >
            Supabase API Settings öffnen
          </a>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Zur Landing</Link>
        </Button>
      </div>
    </div>
  );
}



