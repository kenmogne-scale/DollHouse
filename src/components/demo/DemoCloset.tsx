"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Shirt, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { loadJson, saveJson } from "@/lib/demo/storage";
import { DEMO_ITEMS_KEY } from "@/lib/demo/constants";
import type { DemoCategory, DemoClothingItem } from "@/lib/demo/types";
import { removeImageBackground, blobToDataUrl } from "@/lib/removeBackground";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "tops", label: "Tops" },
  { key: "bottoms", label: "Bottoms" },
  { key: "shoes", label: "Shoes" },
  { key: "accessories", label: "Accessories" },
] as const;

export function DemoCloset() {
  const [items, setItems] = React.useState<DemoClothingItem[]>([]);
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]["key"]>(
    "all",
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setItems(loadJson<DemoClothingItem[]>(DEMO_ITEMS_KEY, []));
  }, []);

  function persist(next: DemoClothingItem[]) {
    setItems(next);
    saveJson(DEMO_ITEMS_KEY, next);
  }

  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-800">My Closet ✦</h1>
          <p className="mt-1 text-sm text-slate-500">
            Demo Mode: Uploads werden lokal gespeichert (kein Supabase).
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
          Noch keine Items. Klick auf <span className="font-medium text-red-600">Upload</span>.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card shine rounded-3xl p-3">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] shadow-sm">
                {/* Checkered background to show transparency */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageDataUrl}
                  alt={`${item.category}${item.color ? ` (${item.color})` : ""}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 px-1">
                <div className="text-xs font-medium text-slate-700 capitalize">
                  {item.category}
                </div>
                <div className="text-[11px] text-slate-400">{item.color ?? "—"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DemoUploadModal
        open={open}
        onClose={() => setOpen(false)}
        onUploaded={(created) => persist([created, ...items])}
      />
    </div>
  );
}

function DemoUploadModal({
  open,
  onClose,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded: (created: DemoClothingItem) => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [category, setCategory] = React.useState<DemoCategory>("tops");
  const [color, setColor] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return;

    setBusy(true);
    setProgress(0);
    setStatus("Lade AI-Modell...");

    try {
      // Remove background
      setStatus("Entferne Hintergrund...");
      const processedBlob = await removeImageBackground(file, (p) => {
        setProgress(p);
        if (p < 30) {
          setStatus("Lade AI-Modell...");
        } else if (p < 80) {
          setStatus("Entferne Hintergrund...");
        } else {
          setStatus("Finalisiere...");
        }
      });

      // Convert to data URL
      setStatus("Speichere...");
      const dataUrl = await blobToDataUrl(processedBlob);

      const created: DemoClothingItem = {
        id: crypto.randomUUID(),
        imageDataUrl: dataUrl,
        category,
        color: color.trim() || null,
        createdAt: new Date().toISOString(),
      };
      onUploaded(created);
      onClose();
      
      // Reset form
      setProgress(0);
      setStatus("");
      if (fileRef.current) fileRef.current.value = "";
      setColor("");
    } catch (error) {
      console.error("Background removal failed:", error);
      setStatus("Fehler beim Verarbeiten");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload Item (Demo) ✦">
      <form onSubmit={submit} className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 font-medium">Bild</label>
          <Input ref={fileRef} type="file" accept="image/*" required disabled={busy} />
          <p className="text-[11px] text-slate-400">
            <Sparkles className="inline h-3 w-3 mr-1" />
            Der Hintergrund wird automatisch entfernt (max. 10MB).
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 font-medium">Kategorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DemoCategory)}
            disabled={busy}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] shadow-sm disabled:opacity-50"
          >
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 font-medium">Farbe (optional)</label>
          <Input value={color} onChange={(e) => setColor(e.target.value)} disabled={busy} />
        </div>

        {busy && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">{status}</span>
              <span className="text-slate-400">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full gap-2" disabled={busy}>
          {busy ? (
            <>
              <span className="animate-spin">⏳</span>
              Verarbeite...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Upload & Freistellen ✦
            </>
          )}
        </Button>
      </form>
    </Modal>
  );
}
