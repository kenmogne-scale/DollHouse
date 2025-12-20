import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ClosetClient } from "@/app/(app)/closet/ClosetClient";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DemoCloset } from "@/components/demo/DemoCloset";

export default async function ClosetPage() {
  if (!getSupabaseEnv()) return <DemoCloset />;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware schützt bereits; hier nur defensive fallback.
  if (!user) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-slate-500">
        Nicht eingeloggt.
      </div>
    );
  }

  const { data, error } = await supabase
    .from("clothing_items")
    .select("id,image_url,category,color")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-slate-500">
        Fehler beim Laden: {error.message}
      </div>
    );
  }

  const items = await Promise.all(
    (data ?? []).map(async (row) => {
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
  );

  return <ClosetClient items={items.filter((i) => i.imageUrl)} />;
}
