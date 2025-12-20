"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export type AuthActionState = { error?: string };

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!getSupabaseEnv()) {
    return {
      error:
        "Supabase ist nicht konfiguriert. Bitte setze NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local und starte neu.",
    };
  }
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  redirect("/closet");
}

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!getSupabaseEnv()) {
    return {
      error:
        "Supabase ist nicht konfiguriert. Bitte setze NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local und starte neu.",
    };
  }
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) return { error: error.message };

  // optional: falls Email-Confirmation an ist, ist user evtl. null.
  if (!data.user) {
    return {
      error:
        "Bitte bestätige deine E-Mail (Supabase Auth Setting) und logge dich danach ein.",
    };
  }

  redirect("/closet");
}

export async function signOutAction() {
  if (!getSupabaseEnv()) redirect("/");
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}


