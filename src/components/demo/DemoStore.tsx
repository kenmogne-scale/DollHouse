"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
        <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition-all duration-200 group-hover:shadow-xl">
          <OutfitPreview outfit={outfit} itemsById={itemsById} />
          
          {/* Hover Overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          {/* Hover Actions */}
          <div 
            className={`absolute top-2 right-2 flex gap-1.5 transition-all duration-200 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white"
              title="Löschen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom Info on Hover */}
          <div 
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-200 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-white drop-shadow-sm">
                  {outfit.name}
                </h3>
                <p className="text-xs text-white/70">
                  {new Date(outfit.createdAt).toLocaleDateString("de-DE")}
                </p>
              </div>
              <Link
                href={`/outfits/builder?outfitId=${outfit.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition-transform hover:scale-110"
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
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-red-50 via-white to-rose-50 shadow-sm flex items-center justify-center" style={{ aspectRatio: "3/4" }}>
        <span className="text-slate-300 text-sm">Keine Items</span>
      </div>
    );
  }

  // Builder board is 450x600 (3:4 ratio), item base size is 120
  // Convert to percentages for responsive preview
  const boardWidth = 450;
  const boardHeight = 600;
  const itemBaseSize = 120;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md bg-white" style={{ aspectRatio: "3/4" }}>
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
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
