"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ClothingCategory } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";

export type UploadItemState = { error?: string; ok?: boolean };

function inferExtension(file: File) {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  if (file.type && byType[file.type]) return byType[file.type];
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.at(-1)!.toLowerCase() : "jpg";
}

export async function uploadClothingItemAction(
  _prev: UploadItemState,
  formData: FormData,
): Promise<UploadItemState> {
  if (!getSupabaseEnv()) {
    return {
      error:
        "Supabase ist nicht konfiguriert. Bitte setze NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local und starte neu.",
    };
  }
  const file = formData.get("image");
  const category = String(formData.get("category") ?? "")
    .trim()
    .toLowerCase() as ClothingCategory;
  const colorRaw = String(formData.get("color") ?? "").trim();
  const color = colorRaw.length ? colorRaw : null;

  if (!(file instanceof File)) return { error: "Bitte wähle ein Bild aus." };
  if (!["tops", "bottoms", "shoes", "accessories"].includes(category)) {
    return { error: "Ungültige Kategorie." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Datei muss ein Bild sein (jpg/png/webp)." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "Max. Dateigröße: 8MB." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const ext = inferExtension(file);
  const uuid = randomUUID();
  const objectPath = `${user.id}/items/${uuid}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadRes = await supabase.storage
    .from("closet")
    .upload(objectPath, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadRes.error) return { error: uploadRes.error.message };

  const { error: dbError } = await supabase.from("clothing_items").insert({
    user_id: user.id,
    image_url: objectPath, // MVP: Storage-Pfad
    category,
    color,
  });

  if (dbError) return { error: dbError.message };

  revalidatePath("/closet");
  return { ok: true };
}


