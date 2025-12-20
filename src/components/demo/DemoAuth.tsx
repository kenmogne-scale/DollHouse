"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DEMO_COOKIE, DEMO_EMAIL_COOKIE } from "@/lib/demo/constants";

type Mode = "login" | "register";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax`;
}

export function DemoAuth() {
  const router = useRouter();

  const [mode, setMode] = React.useState<Mode>("register");
  const [email, setEmail] = React.useState("demo@dollcloset.local");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return toast.error("Bitte E-Mail eingeben.");

    setCookie(DEMO_COOKIE, "1");
    setCookie(DEMO_EMAIL_COOKIE, email.trim());
    toast.success("Demo Login aktiv ✦");
    router.push("/closet");
    router.refresh();
  }

  return (
    <div className="glass-card bubble-ring mx-auto w-full max-w-md rounded-3xl p-6 sm:p-8">
      {/* Mode Toggle */}
      <div className="mb-6 flex items-center gap-1 rounded-full border-2 border-fuchsia-500/30 bg-black/50 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`h-11 flex-1 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
            mode === "login"
              ? "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-[0_0_20px_rgba(255,20,147,0.4)]"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`h-11 flex-1 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
            mode === "register"
              ? "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-[0_0_20px_rgba(255,20,147,0.4)]"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          Register
        </button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-fuchsia-400" />
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
          {mode === "login" ? "Demo Login" : "Demo Register"}
        </h1>
      </div>
      <p className="text-sm text-white/50 mb-6">
        Kein Supabase, kein Hosting. Alles bleibt lokal in deinem Browser.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">E-Mail (Demo)</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@demo.local"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Passwort</label>
          <Input
            type="password"
            placeholder="(ignored im Demo Mode)"
            defaultValue="password"
          />
          <p className="text-[11px] text-white/40">
            Demo Mode: Passwort wird nicht geprüft.
          </p>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
          Continue (Demo) ✦
        </Button>
      </form>
    </div>
  );
}
