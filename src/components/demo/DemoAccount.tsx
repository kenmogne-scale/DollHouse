"use client";

import * as React from "react";
import { DEMO_EMAIL_COOKIE } from "@/lib/demo/constants";

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]!) : null;
}

export function DemoAccount() {
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    setEmail(getCookie(DEMO_EMAIL_COOKIE));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-800">Account ✦</h1>
        <p className="mt-1 text-sm text-slate-500">Demo Mode – lokal.</p>
      </div>

      <div className="glass-card rounded-3xl p-5">
        <div className="text-xs text-slate-500">E-Mail</div>
        <div className="mt-1 font-medium text-slate-800">{email ?? "—"}</div>
      </div>
    </div>
  );
}
