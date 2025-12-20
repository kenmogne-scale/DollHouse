"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { loadJson, saveJson } from "@/lib/demo/storage";
import { DEMO_ITEMS_KEY, DEMO_OUTFITS_KEY } from "@/lib/demo/constants";
import type { DemoClothingItem, DemoOutfit } from "@/lib/demo/types";

export function DemoStoreDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [outfit, setOutfit] = React.useState<DemoOutfit | null>(null);
  const [items, setItems] = React.useState<DemoClothingItem[]>([]);

  React.useEffect(() => {
    setItems(loadJson<DemoClothingItem[]>(DEMO_ITEMS_KEY, []));
    const outfits = loadJson<DemoOutfit[]>(DEMO_OUTFITS_KEY, []);
    setOutfit(outfits.find((o) => o.id === id) ?? null);
  }, [id]);

  if (!outfit) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-slate-500">
        Outfit nicht gefunden.
      </div>
    );
  }

  const byId = new Map(items.map((i) => [i.id, i]));
  const placed = outfit.items
    .slice()
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((it) => ({ ...it, img: byId.get(it.clothingItemId)?.imageDataUrl ?? null }));

  function del() {
    if (!outfit) return;
    const outfits = loadJson<DemoOutfit[]>(DEMO_OUTFITS_KEY, []);
    const next = outfits.filter((o) => o.id !== outfit.id);
    saveJson(DEMO_OUTFITS_KEY, next);
    router.push("/store");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-800">{outfit.name} ✦</h1>
          <p className="mt-1 text-sm text-slate-500">Demo Preview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/store">Back</Link>
          </Button>
          <Button asChild variant="primary">
            <Link href={`/outfits/builder?outfitId=${outfit.id}`}>Edit</Link>
          </Button>
          <Button type="button" variant="secondary" onClick={del}>
            Delete
          </Button>
        </div>
      </div>

      <div className="relative h-[600px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-[radial-gradient(ellipse_600px_400px_at_30%_20%,rgba(220,38,38,0.08),transparent_60%),radial-gradient(ellipse_500px_400px_at_80%_10%,rgba(251,113,133,0.10),transparent_55%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,250,1)_100%)] shadow-inner">
        {placed.map((it) =>
          it.img ? (
            <div
              key={it.id}
              className="absolute h-[120px] w-[120px]"
              style={{
                left: it.x,
                top: it.y,
                zIndex: it.zIndex,
                transform: `rotate(${it.rotation}deg) scale(${it.scale})`,
                transformOrigin: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={it.img} 
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
