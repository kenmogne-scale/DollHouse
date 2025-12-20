"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
    <div className="glass-card bubble-ring mx-auto w-full max-w-md rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`h-10 flex-1 rounded-full text-sm font-medium transition-all ${
            mode === "login"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`h-10 flex-1 rounded-full text-sm font-medium transition-all ${
            mode === "register"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Register
        </button>
      </div>

      <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-800">
        {mode === "login" ? "Demo Login ✦" : "Demo Register ✦"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Kein Supabase, kein Hosting. Alles bleibt lokal in deinem Browser.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 font-medium">E-Mail (Demo)</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@demo.local"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 font-medium">Passwort</label>
          <Input
            type="password"
            placeholder="(ignored im Demo Mode)"
            defaultValue="password"
          />
          <p className="text-[11px] text-slate-400">
            Demo Mode: Passwort wird nicht geprüft.
          </p>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Continue (Demo) ✦
        </Button>
      </form>
    </div>
  );
}
