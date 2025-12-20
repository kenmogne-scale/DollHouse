"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
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
          {mode === "login" ? "Welcome Back" : "Get Access"}
        </h1>
      </div>
      <p className="text-sm text-white/50 mb-6">
        {mode === "login"
          ? "Log dich ein und bau dein nächstes Outfit."
          : "Erstell deinen Account in unter einer Minute."}
      </p>

      <form
        action={mode === "login" ? loginAction : registerAction}
        className="space-y-4"
      >
        {mode === "register" ? (
          <div className="space-y-2">
            <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Name</label>
            <Input name="name" placeholder="z.B. Yasmin" required />
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">E-Mail</label>
          <Input
            name="email"
            type="email"
            placeholder="you@dollcloset.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Passwort</label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
          />
          <p className="text-[11px] text-white/40">
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
      className="w-full mt-2"
      disabled={pending}
    >
      {pending ? "Bitte warten…" : mode === "login" ? "Login ✦" : "Create Account ✦"}
    </Button>
  );
}
