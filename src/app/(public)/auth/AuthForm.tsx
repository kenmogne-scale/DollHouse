"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  type AuthActionState,
  signInAction,
  signUpAction,
} from "@/app/(public)/auth/actions";

type Mode = "login" | "register";

export function AuthForm({ defaultMode = "login" }: { defaultMode?: Mode }) {
  const [mode, setMode] = React.useState<Mode>(defaultMode);

  const [loginState, loginAction] = useFormState<AuthActionState, FormData>(
    signInAction,
    {},
  );
  const [registerState, registerAction] = useFormState<AuthActionState, FormData>(
    signUpAction,
    {},
  );

  React.useEffect(() => {
    const msg = mode === "login" ? loginState?.error : registerState?.error;
    if (msg) toast.error(msg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState?.error, registerState?.error]);

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
        {mode === "login" ? "Welcome back ✦" : "Get access ✦"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {mode === "login"
          ? "Log dich ein und bau dein nächstes Outfit."
          : "Erstell deinen Account in unter einer Minute."}
      </p>

      <form
        action={mode === "login" ? loginAction : registerAction}
        className="mt-5 space-y-3"
      >
        {mode === "register" ? (
          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 font-medium">Name</label>
            <Input name="name" placeholder="z.B. Yasmin" required />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 font-medium">E-Mail</label>
          <Input
            name="email"
            type="email"
            placeholder="you@dollcloset.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 font-medium">Passwort</label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
          />
          <p className="text-[11px] text-slate-400">
            Mindestens 6 Zeichen.
          </p>
        </div>

        <AuthSubmitButton mode={mode} />
      </form>
    </div>
  );
}

function AuthSubmitButton({ mode }: { mode: Mode }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      className="w-full"
      disabled={pending}
    >
      {pending ? "Bitte warten…" : mode === "login" ? "Login ✦" : "Create account ✦"}
    </Button>
  );
}
