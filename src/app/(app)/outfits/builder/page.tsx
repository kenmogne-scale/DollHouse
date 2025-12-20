import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  OutfitBuilderClient,
  type ClosetItemForBuilder,
  type BuilderPlacedItem,
} from "@/app/(app)/outfits/builder/OutfitBuilderClient";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DemoOutfitBuilder } from "@/components/demo/DemoOutfitBuilder";

export default async function OutfitBuilderPage({
  searchParams,
}: {
  searchParams?: { outfitId?: string };
}) {
  if (!getSupabaseEnv()) return <DemoOutfitBuilder />;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-slate-500">
        Nicht eingeloggt.
      </div>
    );
  }

  const closetRes = await supabase
    .from("clothing_items")
    .select("id,image_url,category,color")
    .order("created_at", { ascending: false });

  if (closetRes.error) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-slate-500">
        Fehler beim Laden: {closetRes.error.message}
      </div>
    );
  }

  const closetItems: ClosetItemForBuilder[] = await Promise.all(
    (closetRes.data ?? []).map(async (row) => {
      const signed = await supabase.storage
        .from("closet")
        .createSignedUrl(row.image_url, 60 * 60);
      return {
        id: row.id,
        imageUrl: signed.data?.signedUrl ?? "",
        category: row.category,
        color: row.color,
      };
    }),
  ).then((arr) => arr.filter((i) => i.imageUrl));

  const outfitId = searchParams?.outfitId?.trim() || null;
  let initialOutfit:
    | { id: string; name: string; items: BuilderPlacedItem[] }
    | null = null;

  if (outfitId) {
    const outfitRes = await supabase
      .from("outfits")
      .select("id,name,user_id")
      .eq("id", outfitId)
      .single();

    if (!outfitRes.error && outfitRes.data?.user_id === user.id) {
      const itemsRes = await supabase
        .from("outfit_items")
        .select("id,clothing_item_id,x,y,scale,rotation,z_index")
        .eq("outfit_id", outfitId)
        .order("z_index", { ascending: true });

      const byId = new Map(closetItems.map((c) => [c.id, c]));
      const placed: BuilderPlacedItem[] = (itemsRes.data ?? [])
        .map((it) => {
          const src = byId.get(it.clothing_item_id);
          if (!src) return null;
          return {
            localId: it.id,
            clothingItemId: it.clothing_item_id,
            imageUrl: src.imageUrl,
            x: it.x,
            y: it.y,
            scale: it.scale,
            rotation: it.rotation,
            zIndex: it.z_index,
          } satisfies BuilderPlacedItem;
        })
        .filter(Boolean) as BuilderPlacedItem[];

      initialOutfit = { id: outfitRes.data.id, name: outfitRes.data.name, items: placed };
    }
  }

  return <OutfitBuilderClient closetItems={closetItems} initialOutfit={initialOutfit} />;
}
