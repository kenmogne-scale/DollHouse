"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
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
      {/* Pinterest-style Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-fuchsia-400" />
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-white">Meine Outfits</h1>
        </div>
        <Button asChild variant="primary" className="gap-2">
          <Link href="/outfits/builder">
            <Plus className="h-4 w-4" />
            Erstellen
          </Link>
        </Button>
      </div>

      {outfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 border-2 border-fuchsia-500/30 shadow-[0_0_30px_rgba(255,20,147,0.2)]">
            <Plus className="h-8 w-8 text-fuchsia-400" />
          </div>
          <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white">Noch keine Outfits</h2>
          <p className="mt-2 text-sm text-white/50">
            Erstelle deine erste Collage im Builder
          </p>
          <Button asChild variant="primary" className="mt-6 gap-2">
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
            <PinCard 
              key={o.id} 
              outfit={o} 
              itemsById={itemsById} 
              onDelete={() => del(o.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PinCard({
  outfit,
  itemsById,
  onDelete,
}: {
  outfit: DemoOutfit;
  itemsById: Map<string, DemoClothingItem>;
  onDelete: () => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="group relative mb-4 break-inside-avoid"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pin Image */}
      <Link href={`/store/${outfit.id}`} className="block">
        <div className="relative overflow-hidden rounded-3xl border-2 border-fuchsia-500/30 bg-black/50 shadow-[0_8px_32px_rgba(255,20,147,0.15)] transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(255,20,147,0.3)] group-hover:border-fuchsia-500/50 group-hover:scale-[1.02]">
          <OutfitPreview outfit={outfit} itemsById={itemsById} />
          
          {/* Hover Overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-fuchsia-950/30 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          {/* Hover Actions */}
          <div 
            className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-fuchsia-500/30 bg-black/80 text-white/70 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-fuchsia-500 hover:text-white hover:border-fuchsia-500 hover:shadow-[0_0_15px_rgba(255,20,147,0.5)]"
              title="Löschen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom Info on Hover */}
          <div 
            className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-sm font-bold uppercase tracking-wider text-white drop-shadow-lg">
                  {outfit.name}
                </h3>
                <p className="text-xs text-white/50">
                  {new Date(outfit.createdAt).toLocaleDateString("de-DE")}
                </p>
              </div>
              <Link
                href={`/outfits/builder?outfitId=${outfit.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-fuchsia-500/50 bg-gradient-to-br from-fuchsia-500 to-violet-500 text-white shadow-[0_0_15px_rgba(255,20,147,0.4)] transition-all duration-200 hover:scale-110 hover:shadow-[0_0_25px_rgba(255,20,147,0.6)]"
                title="Bearbeiten"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Link>
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
      <div className="overflow-hidden flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-fuchsia-950/30 to-violet-950/30" style={{ aspectRatio: "3/4" }}>
        <Sparkles className="h-6 w-6 text-fuchsia-500/50" />
        <span className="text-white/30 text-sm uppercase tracking-wider">Keine Items</span>
      </div>
    );
  }

  // Builder board is 450x600 (3:4 ratio), item base size is 120
  // Convert to percentages for responsive preview
  const boardWidth = 450;
  const boardHeight = 600;
  const itemBaseSize = 120;

  return (
    <div className="overflow-hidden bg-black" style={{ aspectRatio: "3/4" }}>
      <div className="relative w-full h-full">
        {placedItems
          .slice()
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((item) => {
            // Convert positions to percentages
            const leftPercent = (item.x / boardWidth) * 100;
            const topPercent = (item.y / boardHeight) * 100;
            const sizePercent = (itemBaseSize / boardWidth) * 100;

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
                    style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
