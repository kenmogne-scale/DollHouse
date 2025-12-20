"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Shirt, Sparkles, Upload } from "lucide-react";
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
            <h1 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">My Closet</h1>
          </div>
          <p className="text-xs sm:text-sm text-white/50">
            Demo Mode: Lokal gespeichert
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className="gap-2 flex-1 sm:flex-none"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Upload</span>
          </Button>
          <Button asChild variant="primary" className="gap-2 flex-1 sm:flex-none">
            <Link href="/outfits/builder">
              <Shirt className="h-4 w-4" />
              <span className="sm:inline">Collage</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`h-9 sm:h-10 rounded-full border-2 px-3 sm:px-5 text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              filter === f.key
                ? "border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_15px_rgba(255,20,147,0.3)]"
                : "border-fuchsia-500/30 bg-black/30 text-white/60 hover:bg-fuchsia-500/10 hover:text-white/80 hover:border-fuchsia-500/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 text-center">
          <Sparkles className="h-8 w-8 text-fuchsia-500/50 mx-auto mb-3" />
          <p className="text-sm text-white/50">
            Noch keine Items. Klick auf <span className="font-bold text-fuchsia-400">Upload</span>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card shine rounded-3xl p-3 glow-hover">
              <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-fuchsia-500/20 bg-[repeating-conic-gradient(#1a1a2e_0%_25%,#0a0a15_0%_50%)] bg-[length:16px_16px] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageDataUrl}
                  alt={`${item.category}${item.color ? ` (${item.color})` : ""}`}
                  className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 px-1">
                <div className="text-xs font-bold uppercase tracking-wider text-white capitalize">
                  {item.category}
                </div>
                <div className="text-[11px] text-white/40">{item.color ?? "—"}</div>
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
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Bild</label>
          <Input ref={fileRef} type="file" accept="image/*" required disabled={busy} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:bg-fuchsia-500/20 file:text-fuchsia-400 hover:file:bg-fuchsia-500/30 file:cursor-pointer" />
          <p className="text-[11px] text-white/40 flex items-center gap-1.5">
            <Sparkles className="inline h-3 w-3 text-fuchsia-400" />
            Der Hintergrund wird automatisch entfernt (max. 10MB).
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Kategorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DemoCategory)}
            disabled={busy}
            className="h-12 w-full rounded-2xl border-2 border-fuchsia-500/30 bg-black/50 px-4 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] disabled:opacity-50 cursor-pointer"
          >
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Farbe (optional)</label>
          <Input value={color} onChange={(e) => setColor(e.target.value)} disabled={busy} />
        </div>

        {busy && (
          <div className="space-y-3 p-4 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-fuchsia-300 font-medium">{status}</span>
              <span className="text-fuchsia-400 font-bold">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/50">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-fuchsia-500 transition-all duration-300 shadow-[0_0_10px_rgba(255,20,147,0.5)]"
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
              <Upload className="h-4 w-4" />
              Upload & Freistellen ✦
            </>
          )}
        </Button>
      </form>
    </Modal>
  );
}
