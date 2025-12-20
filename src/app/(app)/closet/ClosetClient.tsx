"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Shirt, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UploadItemModal } from "@/components/closet/UploadItemModal";
import { ClothingCard, type ClothingCardItem } from "@/components/closet/ClothingCard";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "tops", label: "Tops" },
  { key: "bottoms", label: "Bottoms" },
  { key: "shoes", label: "Shoes" },
  { key: "accessories", label: "Accessories" },
] as const;

export function ClosetClient({ items }: { items: ClothingCardItem[] }) {
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]["key"]>(
    "all",
  );
  const [open, setOpen] = React.useState(false);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-white">My Closet</h1>
          </div>
          <p className="text-sm text-white/50">
            Upload deine Teile, filtere Kategorien und starte den Outfit Builder.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Upload
          </Button>
          <Button asChild variant="primary" className="gap-2">
            <Link href="/outfits/builder">
              <Shirt className="h-4 w-4" />
              Build Outfit
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`h-10 rounded-full border-2 px-5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              filter === f.key
                ? "border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_15px_rgba(255,20,147,0.3)]"
                : "border-fuchsia-500/30 bg-black/30 text-white/60 hover:bg-fuchsia-500/10 hover:text-white/80 hover:border-fuchsia-500/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 text-center">
          <Sparkles className="h-8 w-8 text-fuchsia-500/50 mx-auto mb-3" />
          <p className="text-sm text-white/50">
            Noch keine Items. Klick auf{" "}
            <span className="font-bold text-fuchsia-400">Upload</span>{" "}
            und leg los.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <UploadItemModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
