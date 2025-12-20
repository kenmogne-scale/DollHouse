import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteOutfitAndRedirectAction } from "@/app/(app)/store/actions";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DemoStoreDetail } from "@/components/demo/DemoStoreDetail";
import { StoreDetailClient } from "@/components/store/StoreDetailClient";

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

  const items = (itemsRes.data ?? []).map((it) => ({
    ...it,
    imageUrl: urlMap.get(it.clothing_item_id) ?? "",
  }));

  return (
    <StoreDetailClient
      outfit={{ id: outfitRes.data.id, name: outfitRes.data.name }}
      items={items}
      deleteAction={deleteOutfitAndRedirectAction}
    />
  );
}
