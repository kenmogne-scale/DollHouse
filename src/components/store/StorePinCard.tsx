"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

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
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-200 group-hover:shadow-xl">
          {/* Outfit Preview */}
          <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
            {validItems.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
                <span className="text-sm text-slate-300">Keine Items</span>
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
                          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
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
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Hover Actions - Delete */}
          <div
            className={`absolute right-2 top-2 flex gap-1.5 transition-all duration-200 ${
              isHovered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            <form action={deleteAction}>
              <input type="hidden" name="outfitId" value={outfit.id} />
              <button
                type="submit"
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white"
                title="Löschen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Bottom Info on Hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-200 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-white drop-shadow-sm">
                  {outfit.name}
                </h3>
                <p className="text-xs text-white/70">
                  {new Date(outfit.created_at).toLocaleDateString("de-DE")}
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

