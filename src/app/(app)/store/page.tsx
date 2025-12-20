import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteOutfitAction } from "@/app/(app)/store/actions";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DemoStore } from "@/components/demo/DemoStore";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-800">My Store ✦</h1>
          <p className="mt-1 text-sm text-slate-500">
            Deine gespeicherten Outfits – als glossy Showroom Grid.
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/outfits/builder">New Outfit ✦</Link>
        </Button>
      </div>

      {outfits.length === 0 ? (
        <div className="glass-card rounded-3xl p-6 text-sm text-slate-500">
          Noch keine Outfits. Bau eins im{" "}
          <Link className="underline decoration-red-300 underline-offset-2 text-red-600 font-medium" href="/outfits/builder">
            Outfit Builder
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {outfits.map((o) => (
            <div key={o.id} className="glass-card shine rounded-3xl p-3">
              <Link href={`/store/${o.id}`} className="block">
                <OutfitPreview items={o.items} />
                <div className="mt-3 px-1">
                  <div className="truncate text-sm font-semibold text-slate-800">{o.name}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {new Date(o.created_at).toLocaleDateString("de-DE")}
                  </div>
                </div>
              </Link>

              <div className="mt-3 flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="flex-1">
                  <Link href={`/outfits/builder?outfitId=${o.id}`}>Edit</Link>
                </Button>
                <form action={deleteOutfitAction} className="flex-1">
                  <input type="hidden" name="outfitId" value={o.id} />
                  <Button type="submit" variant="secondary" size="sm" className="w-full">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OutfitPreview({
  items,
}: {
  items: Array<{
    clothing_item_id: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    z_index: number;
    imageUrl: string;
  }>;
}) {
  const validItems = items.filter((i) => i.imageUrl);

  if (validItems.length === 0) {
    return (
      <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-red-50 via-white to-rose-50 shadow-sm" />
    );
  }

  // Calculate bounds to scale and center items in preview
  const itemSize = 120; // Original item size in builder
  const minX = Math.min(...validItems.map((i) => i.x));
  const minY = Math.min(...validItems.map((i) => i.y));
  const maxX = Math.max(...validItems.map((i) => i.x + itemSize * i.scale));
  const maxY = Math.max(...validItems.map((i) => i.y + itemSize * i.scale));

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;

  // Preview container is aspect-square, so we scale to fit
  const previewSize = 200;
  const scaleToFit =
    Math.min(
      previewSize / (contentWidth || 1),
      previewSize / (contentHeight || 1),
      1.5
    ) * 0.8;

  const offsetX = (previewSize - contentWidth * scaleToFit) / 2 - minX * scaleToFit;
  const offsetY = (previewSize - contentHeight * scaleToFit) / 2 - minY * scaleToFit;

  return (
    <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-red-50/50 via-white to-rose-50/50 shadow-sm">
      <div className="relative h-full w-full">
        {validItems
          .slice()
          .sort((a, b) => a.z_index - b.z_index)
          .map((item, idx) => {
            const scaledSize = itemSize * item.scale * scaleToFit;
            const x = item.x * scaleToFit + offsetX;
            const y = item.y * scaleToFit + offsetY;

            return (
              <div
                key={`${item.clothing_item_id}-${idx}`}
                className="absolute"
                style={{
                  left: x,
                  top: y,
                  width: scaledSize,
                  height: scaledSize,
                  transform: `rotate(${item.rotation}deg)`,
                  transformOrigin: "center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-full w-full object-contain drop-shadow-sm"
                  loading="lazy"
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
