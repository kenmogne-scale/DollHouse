"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { loadJson, saveJson } from "@/lib/demo/storage";
import { DEMO_ITEMS_KEY, DEMO_OUTFITS_KEY } from "@/lib/demo/constants";
import type { DemoClothingItem, DemoOutfit } from "@/lib/demo/types";

export function DemoStore() {
  const [outfits, setOutfits] = React.useState<DemoOutfit[]>([]);
  const [closetItems, setClosetItems] = React.useState<DemoClothingItem[]>([]);

  React.useEffect(() => {
    setOutfits(loadJson<DemoOutfit[]>(DEMO_OUTFITS_KEY, []));
    setClosetItems(loadJson<DemoClothingItem[]>(DEMO_ITEMS_KEY, []));
  }, []);

  function del(id: string) {
    const next = outfits.filter((o) => o.id !== id);
    setOutfits(next);
    saveJson(DEMO_OUTFITS_KEY, next);
  }

  // Map clothing items by ID for quick lookup
  const itemsById = React.useMemo(() => {
    return new Map(closetItems.map((item) => [item.id, item]));
  }, [closetItems]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-800">My Store ✦</h1>
          <p className="mt-1 text-sm text-slate-500">
            Demo Mode: Outfits sind lokal gespeichert.
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
                <OutfitPreview outfit={o} itemsById={itemsById} />
                <div className="mt-3 px-1">
                  <div className="truncate text-sm font-semibold text-slate-800">{o.name}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString("de-DE")}
                  </div>
                </div>
              </Link>

              <div className="mt-3 flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="flex-1">
                  <Link href={`/outfits/builder?outfitId=${o.id}`}>Edit</Link>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => del(o.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OutfitPreview({
  outfit,
  itemsById,
}: {
  outfit: DemoOutfit;
  itemsById: Map<string, DemoClothingItem>;
}) {
  const placedItems = outfit.items
    .map((item) => {
      const clothing = itemsById.get(item.clothingItemId);
      if (!clothing) return null;
      return { ...item, imageDataUrl: clothing.imageDataUrl };
    })
    .filter(Boolean) as Array<{
      id: string;
      clothingItemId: string;
      x: number;
      y: number;
      scale: number;
      rotation: number;
      zIndex: number;
      imageDataUrl: string;
    }>;

  if (placedItems.length === 0) {
    return (
      <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-red-50 via-white to-rose-50 shadow-sm" />
    );
  }

  // Builder board is 600x600, item base size is 120
  // Convert to percentages for responsive preview
  const boardSize = 600;
  const itemBaseSize = 120;

  return (
    <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative w-full h-full">
        {placedItems
          .slice()
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((item) => {
            // Convert positions to percentages
            const leftPercent = (item.x / boardSize) * 100;
            const topPercent = (item.y / boardSize) * 100;
            const sizePercent = (itemBaseSize / boardSize) * 100;

            return (
              <div
                key={item.id}
                className="absolute"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  width: `${sizePercent}%`,
                  height: `${sizePercent}%`,
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                    transformOrigin: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageDataUrl}
                    alt=""
                    className="h-full w-full object-contain"
                    style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
