import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DemoStore } from "@/components/demo/DemoStore";
import { StorePinCard } from "@/components/store/StorePinCard";

type OutfitWithItems = {
  id: string;
  name: string;
  created_at: string;
  items: Array<{
    clothing_item_id: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    z_index: number;
    imageUrl: string;
  }>;
};

export default async function StorePage() {
  if (!getSupabaseEnv()) return <DemoStore />;

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

  const outfitsRes = await supabase
    .from("outfits")
    .select("id,name,created_at")
    .order("created_at", { ascending: false });

  if (outfitsRes.error) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-slate-500">
        Fehler beim Laden: {outfitsRes.error.message}
      </div>
    );
  }

  // Load all outfit items for all outfits
  const outfitIds = (outfitsRes.data ?? []).map((o) => o.id);
  const outfitItemsRes = await supabase
    .from("outfit_items")
    .select("outfit_id,clothing_item_id,x,y,scale,rotation,z_index")
    .in("outfit_id", outfitIds.length > 0 ? outfitIds : ["__none__"]);

  // Get unique clothing item IDs
  const clothingItemIds = Array.from(
    new Set((outfitItemsRes.data ?? []).map((i) => i.clothing_item_id))
  );

  // Load clothing items with their images
  const clothingRes = await supabase
    .from("clothing_items")
    .select("id,image_url")
    .in("id", clothingItemIds.length > 0 ? clothingItemIds : ["__none__"]);

  // Create signed URLs for all clothing items
  const urlMap = new Map<string, string>();
  await Promise.all(
    (clothingRes.data ?? []).map(async (c) => {
      const signed = await supabase.storage
        .from("closet")
        .createSignedUrl(c.image_url, 60 * 60);
      if (signed.data?.signedUrl) urlMap.set(c.id, signed.data.signedUrl);
    })
  );

  // Group outfit items by outfit ID
  const itemsByOutfitId = new Map<string, typeof outfitItemsRes.data>();
  for (const item of outfitItemsRes.data ?? []) {
    const existing = itemsByOutfitId.get(item.outfit_id) ?? [];
    existing.push(item);
    itemsByOutfitId.set(item.outfit_id, existing);
  }

  // Build final outfits with items
  const outfits: OutfitWithItems[] = (outfitsRes.data ?? []).map((o) => ({
    ...o,
    items: (itemsByOutfitId.get(o.id) ?? []).map((item) => ({
      ...item,
      imageUrl: urlMap.get(item.clothing_item_id) ?? "",
    })),
  }));

  // Import delete action
  const { deleteOutfitAction } = await import("@/app/(app)/store/actions");

  return (
    <div className="space-y-6">
      {/* Pinterest-style Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Meine Outfits</h1>
        <Button asChild variant="primary" className="gap-2 rounded-full px-5">
          <Link href="/outfits/builder">
            <Plus className="h-4 w-4" />
            Erstellen
          </Link>
        </Button>
      </div>

      {outfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100">
            <Plus className="h-8 w-8 text-rose-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Noch keine Outfits</h2>
          <p className="mt-1 text-sm text-slate-500">
            Erstelle deine erste Collage im Builder
          </p>
          <Button asChild variant="primary" className="mt-4 gap-2 rounded-full">
            <Link href="/outfits/builder">
              <Plus className="h-4 w-4" />
              Outfit erstellen
            </Link>
          </Button>
        </div>
      ) : (
        /* Pinterest Masonry Grid */
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
          {outfits.map((o) => (
            <StorePinCard
              key={o.id}
              outfit={o}
              deleteAction={deleteOutfitAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

