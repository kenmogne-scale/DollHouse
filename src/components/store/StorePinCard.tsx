"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Trash2, Sparkles } from "lucide-react";

export type StorePinCardItem = {
  clothing_item_id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  z_index: number;
  imageUrl: string;
};

export type StorePinCardOutfit = {
  id: string;
  name: string;
  created_at: string;
  items: StorePinCardItem[];
};

export function StorePinCard({
  outfit,
  deleteAction,
}: {
  outfit: StorePinCardOutfit;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  const validItems = outfit.items.filter((i) => i.imageUrl);

  // Builder board is 450x600 (3:4 ratio), item base size is 120
  const boardWidth = 450;
  const boardHeight = 600;
  const itemBaseSize = 120;

  return (
    <div
      className="group relative mb-4 break-inside-avoid"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/store/${outfit.id}`} className="block">
        <div className="relative overflow-hidden rounded-3xl border-2 border-fuchsia-500/30 bg-black/50 shadow-[0_8px_32px_rgba(255,20,147,0.15)] transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(255,20,147,0.3)] group-hover:border-fuchsia-500/50 group-hover:scale-[1.02]">
          {/* Outfit Preview */}
          <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
            {validItems.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-fuchsia-950/30 to-violet-950/30 gap-2">
                <Sparkles className="h-6 w-6 text-fuchsia-500/50" />
                <span className="text-sm text-white/30 uppercase tracking-wider">Keine Items</span>
              </div>
            ) : (
              validItems
                .slice()
                .sort((a, b) => a.z_index - b.z_index)
                .map((item, idx) => {
                  const leftPercent = (item.x / boardWidth) * 100;
                  const topPercent = (item.y / boardHeight) * 100;
                  const sizePercent = (itemBaseSize / boardWidth) * 100;

                  return (
                    <div
                      key={`${item.clothing_item_id}-${idx}`}
                      className="absolute"
                      style={{
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                        width: `${sizePercent}%`,
                        height: `${sizePercent}%`,
                      }}
                    >
                      <div
                        className="h-full w-full"
                        style={{
                          transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                          transformOrigin: "center",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="h-full w-full object-contain"
                          style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-fuchsia-950/30 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Hover Actions - Delete */}
          <div
            className={`absolute right-3 top-3 flex gap-2 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
            }`}
          >
            <form action={deleteAction}>
              <input type="hidden" name="outfitId" value={outfit.id} />
              <button
                type="submit"
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-fuchsia-500/30 bg-black/80 text-white/70 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-fuchsia-500 hover:text-white hover:border-fuchsia-500 hover:shadow-[0_0_15px_rgba(255,20,147,0.5)]"
                title="Löschen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Bottom Info on Hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-sm font-bold uppercase tracking-wider text-white drop-shadow-lg">
                  {outfit.name}
                </h3>
                <p className="text-xs text-white/50">
                  {new Date(outfit.created_at).toLocaleDateString("de-DE")}
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
