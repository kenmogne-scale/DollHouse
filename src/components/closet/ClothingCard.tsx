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
    <div className="glass-card shine rounded-3xl p-3">
      {/* Checkered background to show transparency */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={`${item.category}${item.color ? ` (${item.color})` : ""}`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 px-1 pb-1">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-700 capitalize">
            {item.category}
          </div>
          <div className="text-[11px] text-slate-400">
            {item.color ?? "—"}
          </div>
        </div>
        <div
          className={cn(
            "h-5 w-5 rounded-full border border-slate-200 bg-slate-100 shadow-sm",
          )}
          title={item.color ?? undefined}
        />
      </div>
    </div>
  );
}
