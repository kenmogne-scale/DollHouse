"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function deleteOutfitAction(formData: FormData) {
  if (!getSupabaseEnv()) return;
  const outfitId = String(formData.get("outfitId") ?? "").trim();
  if (!outfitId) return;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // RLS schützt, aber wir behalten den Filter über user_id zusätzlich.
  await supabase.from("outfits").delete().eq("id", outfitId).eq("user_id", user.id);
  revalidatePath("/store");
}

export async function deleteOutfitAndRedirectAction(formData: FormData) {
  await deleteOutfitAction(formData);
  redirect("/store");
}


