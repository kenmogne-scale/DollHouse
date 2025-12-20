"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

type LayoutItem = {
  clothingItemId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
};

export type SaveOutfitState = { error?: string };

export async function saveOutfitAction(
  _prev: SaveOutfitState,
  formData: FormData,
): Promise<SaveOutfitState> {
  if (!getSupabaseEnv()) {
    return {
      error:
        "Supabase ist nicht konfiguriert. Bitte setze NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local und starte neu.",
    };
  }
  const name = String(formData.get("name") ?? "").trim() || "Outfit 1";
  const rawItems = String(formData.get("items") ?? "");
  const outfitIdRaw = String(formData.get("outfitId") ?? "").trim();
  const outfitId = outfitIdRaw.length ? outfitIdRaw : null;

  let items: LayoutItem[] = [];
  try {
    items = JSON.parse(rawItems) as LayoutItem[];
  } catch {
    return { error: "Ungültige Outfit-Daten (JSON)." };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Zieh mindestens ein Item aufs Board." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  // Thumbnail: erstes Item -> Storage-Pfad aus clothing_items
  const firstId = items[0]!.clothingItemId;
  const thumbRes = await supabase
    .from("clothing_items")
    .select("image_url")
    .eq("id", firstId)
    .single();
  const thumbnail_url = thumbRes.data?.image_url ?? null;

  if (outfitId) {
    const existing = await supabase
      .from("outfits")
      .select("id,user_id")
      .eq("id", outfitId)
      .single();
    if (existing.error || existing.data.user_id !== user.id) {
      return { error: "Outfit nicht gefunden oder keine Berechtigung." };
    }

    const { error: updateErr } = await supabase
      .from("outfits")
      .update({ name, thumbnail_url })
      .eq("id", outfitId);
    if (updateErr) return { error: updateErr.message };

    const { error: delErr } = await supabase
      .from("outfit_items")
      .delete()
      .eq("outfit_id", outfitId);
    if (delErr) return { error: delErr.message };

    const { error: insertErr } = await supabase.from("outfit_items").insert(
      items.map((it) => ({
        outfit_id: outfitId,
        clothing_item_id: it.clothingItemId,
        x: it.x,
        y: it.y,
        scale: it.scale ?? 1,
        rotation: it.rotation ?? 0,
        z_index: it.zIndex ?? 0,
      })),
    );
    if (insertErr) return { error: insertErr.message };
  } else {
    const created = await supabase
      .from("outfits")
      .insert({ user_id: user.id, name, thumbnail_url })
      .select("id")
      .single();
    if (created.error || !created.data) {
      return { error: created.error?.message ?? "Outfit konnte nicht gespeichert werden." };
    }

    const { error: insertErr } = await supabase.from("outfit_items").insert(
      items.map((it) => ({
        outfit_id: created.data.id,
        clothing_item_id: it.clothingItemId,
        x: it.x,
        y: it.y,
        scale: it.scale ?? 1,
        rotation: it.rotation ?? 0,
        z_index: it.zIndex ?? 0,
      })),
    );
    if (insertErr) return { error: insertErr.message };
  }

  revalidatePath("/store");
  redirect("/store");
}


