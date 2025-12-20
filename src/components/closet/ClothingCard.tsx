"use client";

import { cn } from "@/lib/utils";

export type ClothingCardItem = {
  id: string;
  imageUrl: string; // signed URL for display
  category: string;
  color: string | null;
};

export function ClothingCard({ item }: { item: ClothingCardItem }) {
  return (
    <div className="glass-card shine rounded-3xl p-3 glow-hover">
      {/* Checkered background to show transparency - now with dark theme */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-fuchsia-500/20 bg-[repeating-conic-gradient(#1a1a2e_0%_25%,#0a0a15_0%_50%)] bg-[length:16px_16px] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={`${item.category}${item.color ? ` (${item.color})` : ""}`}
          className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
          loading="lazy"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 px-1 pb-1">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wider text-white capitalize">
            {item.category}
          </div>
          <div className="text-[11px] text-white/40">
            {item.color ?? "—"}
          </div>
        </div>
        <div
          className={cn(
            "h-5 w-5 rounded-full border-2 border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 shadow-[0_0_10px_rgba(255,20,147,0.2)]",
          )}
          title={item.color ?? undefined}
        />
      </div>
    </div>
  );
}
