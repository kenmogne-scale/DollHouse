import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteOutfitAndRedirectAction } from "@/app/(app)/store/actions";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DemoStoreDetail } from "@/components/demo/DemoStoreDetail";

export default async function StoreOutfitDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!getSupabaseEnv()) return <DemoStoreDetail />;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const outfitRes = await supabase
    .from("outfits")
    .select("id,name,user_id")
    .eq("id", params.id)
    .single();

  if (outfitRes.error || outfitRes.data.user_id !== user.id) notFound();

  const itemsRes = await supabase
    .from("outfit_items")
    .select("clothing_item_id,x,y,scale,rotation,z_index")
    .eq("outfit_id", params.id)
    .order("z_index", { ascending: true });

  const itemIds = Array.from(
    new Set((itemsRes.data ?? []).map((i) => i.clothing_item_id)),
  );
  const clothingRes = await supabase
    .from("clothing_items")
    .select("id,image_url")
    .in("id", itemIds);

  const urlMap = new Map<string, string>();
  await Promise.all(
    (clothingRes.data ?? []).map(async (c) => {
      const signed = await supabase.storage
        .from("closet")
        .createSignedUrl(c.image_url, 60 * 60);
      if (signed.data?.signedUrl) urlMap.set(c.id, signed.data.signedUrl);
    }),
  );

  const placed = (itemsRes.data ?? []).map((it) => ({
    ...it,
    imageUrl: urlMap.get(it.clothing_item_id) ?? "",
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-800">{outfitRes.data.name} ✦</h1>
          <p className="mt-1 text-sm text-slate-500">Read-only Preview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/store">Back</Link>
          </Button>
          <Button asChild variant="primary">
            <Link href={`/outfits/builder?outfitId=${outfitRes.data.id}`}>Edit</Link>
          </Button>
          <form action={deleteOutfitAndRedirectAction}>
            <input type="hidden" name="outfitId" value={outfitRes.data.id} />
            <Button type="submit" variant="secondary">
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="relative h-[600px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-[radial-gradient(ellipse_600px_400px_at_30%_20%,rgba(220,38,38,0.08),transparent_60%),radial-gradient(ellipse_500px_400px_at_80%_10%,rgba(251,113,133,0.10),transparent_55%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,250,1)_100%)] shadow-inner">
        {placed.map((it, idx) =>
          it.imageUrl ? (
            <div
              key={`${it.clothing_item_id}-${idx}`}
              className="absolute h-[120px] w-[120px]"
              style={{
                left: it.x,
                top: it.y,
                zIndex: it.z_index,
                transform: `rotate(${it.rotation}deg) scale(${it.scale})`,
                transformOrigin: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.imageUrl}
                alt=""
                className="h-full w-full object-contain"
                style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
              />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
