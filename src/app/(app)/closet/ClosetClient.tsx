"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Shirt } from "lucide-react";
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
          <h1 className="font-display text-2xl font-semibold text-slate-800">My Closet ✦</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload deine Teile, filtere Kategorien und starte den Outfit Builder.
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`h-10 rounded-full border px-4 text-sm font-medium transition-all ${
              filter === f.key
                ? "border-red-300 bg-red-50 text-red-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-6 text-sm text-slate-500">
          Noch keine Items. Klick auf <span className="font-medium text-red-600">Upload</span>{" "}
          und leg los.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <UploadItemModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
