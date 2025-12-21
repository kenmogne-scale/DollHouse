"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, ZoomIn, ZoomOut, RotateCw, Palette, Sparkles, Maximize2, Minimize2, Plus, Shirt, Settings2, Check, ChevronLeft, ChevronRight, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { loadJson, saveJson } from "@/lib/demo/storage";
import { DEMO_ITEMS_KEY, DEMO_OUTFITS_KEY } from "@/lib/demo/constants";
import type { DemoClothingItem, DemoOutfit, DemoOutfitItem } from "@/lib/demo/types";

// Hintergrundfarben-Optionen - Y2K Style
const BACKGROUND_COLORS = [
  { id: "black", label: "Schwarz", value: "#0a0a0a" },
  { id: "fuchsia-dark", label: "Fuchsia Dark", value: "#3d0a2e" },
  { id: "violet-dark", label: "Violet Dark", value: "#1e0a3d" },
  { id: "pink", label: "Hot Pink", value: "#ff1493" },
  { id: "lavender", label: "Lavendel", value: "#9b30ff" },
  { id: "white", label: "Weiß", value: "#ffffff" },
  { id: "cream", label: "Creme", value: "#fef3e2" },
  { id: "silver", label: "Silver", value: "#c0c0c0" },
  { id: "mint", label: "Mint", value: "#3d8b7a" },
];

type Placed = {
  localId: string;
  clothingItemId: string;
  imageDataUrl: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
};

export function DemoOutfitBuilder() {
  const router = useRouter();
  const sp = useSearchParams();
  const outfitId = sp.get("outfitId");

  const boardRef = React.useRef<HTMLDivElement | null>(null);
  const fullscreenBoardRef = React.useRef<HTMLDivElement | null>(null);
  
  // Track last known board size for scaling positions
  const lastBoardSize = React.useRef<{ width: number; height: number } | null>(null);

  const [closet, setCloset] = React.useState<DemoClothingItem[]>([]);
  const [name, setName] = React.useState("Outfit 1");
  const [placed, setPlaced] = React.useState<Placed[]>([]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [bgColor, setBgColor] = React.useState("#0a0a0a");
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showClosetPanel, setShowClosetPanel] = React.useState(false);
  const [showToolsPanel, setShowToolsPanel] = React.useState(false);
  const [showColorPanel, setShowColorPanel] = React.useState(false);

  // Close all panels helper
  const closeAllPanels = () => {
    setShowClosetPanel(false);
    setShowToolsPanel(false);
    setShowColorPanel(false);
  };

  // Scale positions when switching between fullscreen and normal
  const scalePositionsForMode = React.useCallback((toFullscreen: boolean) => {
    const normalBoard = boardRef.current;
    
    if (!normalBoard) return;
    
    const fromRect = toFullscreen 
      ? normalBoard.getBoundingClientRect()
      : (lastBoardSize.current ?? { width: window.innerWidth, height: window.innerHeight });
    
    const toRect = toFullscreen
      ? { width: window.innerWidth, height: window.innerHeight }
      : normalBoard.getBoundingClientRect();
    
    // Save current board size
    if (toFullscreen) {
      lastBoardSize.current = { width: fromRect.width, height: fromRect.height };
    }
    
    const scaleX = toRect.width / fromRect.width;
    const scaleY = toRect.height / fromRect.height;
    
    setPlaced(prev => prev.map(item => ({
      ...item,
      x: item.x * scaleX,
      y: item.y * scaleY,
    })));
  }, []);

  // Handle fullscreen toggle with position scaling
  const enterFullscreen = React.useCallback(() => {
    scalePositionsForMode(true);
    setIsFullscreen(true);
  }, [scalePositionsForMode]);

  const exitFullscreen = React.useCallback(() => {
    scalePositionsForMode(false);
    setIsFullscreen(false);
    closeAllPanels();
  }, [scalePositionsForMode]);

  // Escape key to exit fullscreen
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        exitFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, exitFullscreen]);

  // Prevent body scroll when fullscreen
  React.useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  React.useEffect(() => {
    const items = loadJson<DemoClothingItem[]>(DEMO_ITEMS_KEY, []);
    setCloset(items);

    if (outfitId) {
      const outfits = loadJson<DemoOutfit[]>(DEMO_OUTFITS_KEY, []);
      const existing = outfits.find((o) => o.id === outfitId);
      if (existing) {
        setName(existing.name);
        const byId = new Map(items.map((i) => [i.id, i]));
        const nextPlaced: Placed[] = existing.items
          .map((it) => {
            const src = byId.get(it.clothingItemId);
            if (!src) return null;
            return {
              localId: it.id,
              clothingItemId: it.clothingItemId,
              imageDataUrl: src.imageDataUrl,
              x: it.x,
              y: it.y,
              scale: it.scale,
              rotation: it.rotation,
              zIndex: it.zIndex,
            } satisfies Placed;
          })
          .filter(Boolean) as Placed[];
        setPlaced(nextPlaced);
        setSelected(nextPlaced[0]?.localId ?? null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outfitId]);

  const maxZ = React.useMemo(
    () => placed.reduce((m, i) => Math.max(m, i.zIndex), 0),
    [placed],
  );
  const selectedItem = placed.find((p) => p.localId === selected) ?? null;

  function bumpZ(localId: string) {
    setPlaced((prev) => {
      const nextZ = prev.reduce((m, i) => Math.max(m, i.zIndex), 0) + 1;
      return prev.map((i) => (i.localId === localId ? { ...i, zIndex: nextZ } : i));
    });
  }

  function updateItem(localId: string, patch: Partial<Placed>) {
    setPlaced((prev) => prev.map((i) => (i.localId === localId ? { ...i, ...patch } : i)));
  }

  function updateSelected(patch: Partial<Placed>) {
    if (!selected) return;
    setPlaced((prev) => prev.map((i) => (i.localId === selected ? { ...i, ...patch } : i)));
  }

  function removeSelected() {
    if (!selected) return;
    setPlaced((prev) => prev.filter((i) => i.localId !== selected));
    setSelected(null);
  }

  // Add item to board (on click)
  function addItemToBoard(src: DemoClothingItem) {
    const localId = crypto.randomUUID();
    const boardWidth = boardRef.current?.clientWidth ?? 600;
    const boardHeight = boardRef.current?.clientHeight ?? 600;
    const newItem: Placed = {
      localId,
      clothingItemId: src.id,
      imageDataUrl: src.imageDataUrl,
      x: (boardWidth / 2) - 60,
      y: (boardHeight / 2) - 60,
      scale: 1,
      rotation: 0,
      zIndex: maxZ + 1,
    };
    setPlaced((prev) => [...prev, newItem]);
    setSelected(localId);
  }

  function save() {
    if (placed.length === 0) return toast.error("Füge mindestens ein Item hinzu.");
    const outfits = loadJson<DemoOutfit[]>(DEMO_OUTFITS_KEY, []);
    const now = new Date().toISOString();
    const id = outfitId ?? crypto.randomUUID();
    const thumb = placed[0]?.imageDataUrl ?? null;

    const items: DemoOutfitItem[] = placed
      .slice()
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((p) => ({
        id: p.localId,
        clothingItemId: p.clothingItemId,
        x: p.x,
        y: p.y,
        scale: p.scale,
        rotation: p.rotation,
        zIndex: p.zIndex,
      }));

    const nextOutfit: DemoOutfit = {
      id,
      name: name.trim() || "Outfit 1",
      thumbnailDataUrl: thumb,
      createdAt: outfitId ? outfits.find((o) => o.id === id)?.createdAt ?? now : now,
      items,
    };

    const next = outfitId
      ? outfits.map((o) => (o.id === id ? nextOutfit : o))
      : [nextOutfit, ...outfits];
    saveJson(DEMO_OUTFITS_KEY, next);
    toast.success("Collage gespeichert ✦");
    router.push("/store");
  }

  return (
    <div className="space-y-3 sm:space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
            <h1 className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wider text-white truncate">Collage Builder</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button asChild variant="ghost" size="sm" className="gap-1 px-2 sm:px-3 normal-case">
            <Link href="/closet">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Closet</span>
            </Link>
          </Button>
          <Button type="button" variant="primary" size="sm" className="gap-1 px-2 sm:px-3" onClick={save}>
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save ✦</span>
          </Button>
        </div>
      </div>

      {closet.length === 0 ? (
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-sm text-white/50">
          Dein Closet ist leer.{" "}
          <Link className="underline decoration-fuchsia-400 underline-offset-2 text-fuchsia-400 font-bold" href="/closet">
            Upload Items
          </Link>
        </div>
      ) : null}

      {/* Mobile: Horizontal scrolling closet items - contained width */}
      <div className="lg:hidden w-full max-w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 flex-shrink-0">Items:</span>
          <div className="flex gap-1.5 overflow-x-auto pb-2 flex-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {closet.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => addItemToBoard(it)}
                className="flex-shrink-0 w-14 h-14 rounded-xl border-2 border-fuchsia-500/30 bg-black/50 p-1 shadow-sm active:scale-95 transition-transform hover:border-fuchsia-500/60"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.imageDataUrl} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Desktop: Sidebar closet */}
        <aside className="hidden lg:block glass-card rounded-3xl p-4">
          <div className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-fuchsia-400" />
            Closet Items
          </div>
          <div className="mt-4 max-h-[500px] overflow-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              {closet.map((it) => (
                <ClosetTile key={it.id} item={it} onAdd={() => addItemToBoard(it)} />
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-2 sm:space-y-3">
          {/* Name input */}
          <div className="flex items-center gap-2">
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="h-9 sm:h-10 flex-1" 
              placeholder="Collage Name"
            />
          </div>

          {/* Background Color & Fullscreen - Mobile optimized */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Palette className="h-4 w-4 text-fuchsia-400 flex-shrink-0" />
              <div className="flex gap-1 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {BACKGROUND_COLORS.slice(0, 6).map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setBgColor(color.value)}
                    className={cn(
                      "h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 transition-all duration-200 flex-shrink-0",
                      bgColor === color.value 
                        ? "border-fuchsia-500 ring-2 ring-fuchsia-500/50 scale-110 shadow-[0_0_15px_rgba(255,20,147,0.5)]" 
                        : "border-fuchsia-500/30 hover:border-fuchsia-500/60"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="gap-1.5 normal-case flex-shrink-0 h-8 sm:h-9"
              onClick={enterFullscreen}
            >
              <Maximize2 className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Vollbild</span>
            </Button>
          </div>

          {/* Board - Hochformat (kleiner auf Mobile für bessere UX) */}
          <div
            ref={boardRef}
            className="relative mx-auto overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-fuchsia-500/30 shadow-[inset_0_0_40px_rgba(255,20,147,0.1),0_0_40px_rgba(255,20,147,0.1)] w-[280px] sm:w-[350px] md:w-[450px]"
            style={{ 
              backgroundColor: bgColor, 
              touchAction: "auto",
              aspectRatio: "3 / 4",
            }}
            onClick={() => setSelected(null)}
          >
            {placed
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((it) => (
                <PlacedItemView
                  key={it.localId}
                  item={it}
                  selected={it.localId === selected}
                  boardRef={boardRef}
                  onSelect={() => {
                    setSelected(it.localId);
                    bumpZ(it.localId);
                  }}
                  onUpdate={(patch) => updateItem(it.localId, patch)}
                />
              ))}
          </div>

          {/* Controls - compact for mobile */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-2 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              {/* Selected info */}
              <div className="text-xs sm:text-sm text-white/60 min-w-0 flex-shrink">
                {selectedItem ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    {Math.round(selectedItem.scale * 100)}% · {selectedItem.rotation}°
                  </span>
                ) : (
                  <span className="text-white/40">Item auswählen</span>
                )}
              </div>

              {/* Control buttons */}
              <div className="flex items-center gap-1">
                {/* Size Controls */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full min-w-0 min-h-0"
                  disabled={!selectedItem}
                  onClick={() =>
                    updateSelected({ scale: Math.max(0.3, (selectedItem?.scale ?? 1) - 0.15) })
                  }
                  title="Kleiner"
                >
                  <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full min-w-0 min-h-0"
                  disabled={!selectedItem}
                  onClick={() =>
                    updateSelected({ scale: Math.min(3, (selectedItem?.scale ?? 1) + 0.15) })
                  }
                  title="Größer"
                >
                  <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                {/* Rotation */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full min-w-0 min-h-0"
                  disabled={!selectedItem}
                  onClick={() => updateSelected({ rotation: ((selectedItem?.rotation ?? 0) + 15) % 360 })}
                  title="Drehen"
                >
                  <RotateCw className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                {/* Delete */}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full"
                  disabled={!selectedItem}
                  onClick={removeSelected}
                  title="Löschen"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Fullscreen Overlay - Navigation oben, Mobile-First */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden flex flex-col"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          {/* TOP NAVBAR - Immer sichtbar */}
          <div className="flex-shrink-0 glass-card border-b-2 border-fuchsia-500/30 z-30 safe-area-inset-top">
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
              {/* Left: Exit Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 gap-2 normal-case"
                onClick={exitFullscreen}
              >
                <Minimize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Beenden</span>
              </Button>

              {/* Center: Quick Controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Tools Toggle */}
                <Button
                  type="button"
                  variant={showToolsPanel ? "primary" : "ghost"}
                  size="sm"
                  className="h-10 w-10 p-0 rounded-xl"
                  onClick={() => {
                    setShowToolsPanel(!showToolsPanel);
                    setShowClosetPanel(false);
                    setShowColorPanel(false);
                  }}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>

                {/* Color Toggle */}
                <Button
                  type="button"
                  variant={showColorPanel ? "primary" : "ghost"}
                  size="sm"
                  className="h-10 w-10 p-0 rounded-xl"
                  onClick={() => {
                    setShowColorPanel(!showColorPanel);
                    setShowClosetPanel(false);
                    setShowToolsPanel(false);
                  }}
                >
                  <div 
                    className="h-5 w-5 rounded-full border-2 border-fuchsia-500/50" 
                    style={{ backgroundColor: bgColor }}
                  />
                </Button>

                {/* Closet Toggle */}
                <Button
                  type="button"
                  variant={showClosetPanel ? "primary" : "ghost"}
                  size="sm"
                  className="h-10 w-10 p-0 rounded-xl"
                  onClick={() => {
                    setShowClosetPanel(!showClosetPanel);
                    setShowToolsPanel(false);
                    setShowColorPanel(false);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Right: Save Button */}
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="h-10 gap-2"
                onClick={() => {
                  save();
                  exitFullscreen();
                }}
                disabled={placed.length === 0}
              >
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline font-bold">Fertig</span>
              </Button>
            </div>

            {/* Selected Item Info Bar */}
            {selectedItem && (
              <div className="px-3 pb-2 sm:px-4">
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    {Math.round(selectedItem.scale * 100)}% · {selectedItem.rotation}°
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* FULLSCREEN BOARD - Fills remaining space */}
          <div 
            ref={fullscreenBoardRef}
            className="flex-1 relative overflow-hidden"
            style={{ 
              backgroundColor: bgColor,
              touchAction: "none",
            }}
            onClick={() => {
              setSelected(null);
              closeAllPanels();
            }}
          >
            {placed
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((it) => (
                <PlacedItemView
                  key={it.localId}
                  item={it}
                  selected={it.localId === selected}
                  boardRef={fullscreenBoardRef}
                  onSelect={() => {
                    setSelected(it.localId);
                    bumpZ(it.localId);
                  }}
                  onUpdate={(patch) => updateItem(it.localId, patch)}
                />
              ))}
          </div>

          {/* Backdrop when any panel is open */}
          {(showClosetPanel || showToolsPanel || showColorPanel) && (
            <div 
              className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-200"
              style={{ top: '60px' }}
              onClick={closeAllPanels}
            />
          )}

          {/* LEFT: Tools Panel (Slide-in from left) */}
          <div 
            className={cn(
              "absolute left-0 bottom-0 w-16 sm:w-20 glass-card transition-transform duration-300 ease-out z-20 border-r-2 border-fuchsia-500/30 flex flex-col items-center py-4 gap-2",
              showToolsPanel ? "translate-x-0" : "-translate-x-full"
            )}
            style={{ top: '60px' }}
          >
            {/* Size Controls */}
            <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-black/30 border border-fuchsia-500/20">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-11 w-11 p-0 rounded-xl min-w-0 min-h-0"
                disabled={!selectedItem}
                onClick={() => updateSelected({ scale: Math.min(3, (selectedItem?.scale ?? 1) + 0.15) })}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <span className="text-[10px] text-fuchsia-300 font-bold">
                {selectedItem ? `${Math.round(selectedItem.scale * 100)}%` : "—"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-11 w-11 p-0 rounded-xl min-w-0 min-h-0"
                disabled={!selectedItem}
                onClick={() => updateSelected({ scale: Math.max(0.3, (selectedItem?.scale ?? 1) - 0.15) })}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Rotation */}
            <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-black/30 border border-fuchsia-500/20">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-11 w-11 p-0 rounded-xl min-w-0 min-h-0"
                disabled={!selectedItem}
                onClick={() => updateSelected({ rotation: ((selectedItem?.rotation ?? 0) + 15) % 360 })}
              >
                <RotateCw className="h-5 w-5" />
              </Button>
              <span className="text-[10px] text-fuchsia-300 font-bold">
                {selectedItem ? `${selectedItem.rotation}°` : "—"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-11 w-11 p-0 rounded-xl min-w-0 min-h-0"
                disabled={!selectedItem}
                onClick={() => updateSelected({ rotation: ((selectedItem?.rotation ?? 0) - 15 + 360) % 360 })}
              >
                <Undo2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Delete */}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-11 w-11 p-0 rounded-xl mt-auto"
              disabled={!selectedItem}
              onClick={removeSelected}
            >
              <Trash2 className="h-5 w-5" />
            </Button>

            {/* Close Panel */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-full min-w-0 min-h-0"
              onClick={() => setShowToolsPanel(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* RIGHT: Closet Panel (Slide-in from right) */}
          <div 
            className={cn(
              "absolute right-0 bottom-0 w-[70vw] max-w-xs glass-card transition-transform duration-300 ease-out z-20 border-l-2 border-fuchsia-500/30",
              showClosetPanel ? "translate-x-0" : "translate-x-full"
            )}
            style={{ top: '60px' }}
          >
            <div className="p-3 sm:p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Shirt className="h-4 w-4 text-fuchsia-400" />
                  Closet
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full min-w-0 min-h-0"
                  onClick={() => setShowClosetPanel(false)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 -mr-1">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {closet.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => addItemToBoard(it)}
                      className="glass-card rounded-xl p-1.5 sm:p-2 transition-all duration-200 active:scale-95 hover:border-fuchsia-500/60 border border-fuchsia-500/20"
                    >
                      <div className="aspect-square overflow-hidden rounded-lg bg-black/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.imageDataUrl} alt={it.category} className="h-full w-full object-contain" />
                      </div>
                      <div className="mt-1 text-center">
                        <span className="text-[10px] text-fuchsia-400 font-bold uppercase">+ Add</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Color Panel (Popup below navbar) */}
          <div 
            className={cn(
              "absolute left-1/2 -translate-x-1/2 glass-card rounded-2xl transition-all duration-300 ease-out z-20 border-2 border-fuchsia-500/30 p-3",
              showColorPanel ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}
            style={{ top: '70px' }}
          >
            <div className="grid grid-cols-5 gap-2">
              {BACKGROUND_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => {
                    setBgColor(color.value);
                    setShowColorPanel(false);
                  }}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 transition-all duration-200 active:scale-90",
                    bgColor === color.value 
                      ? "border-fuchsia-500 ring-2 ring-fuchsia-500/50 scale-110" 
                      : "border-white/20 hover:border-fuchsia-500/60"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Mobile hint at bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 z-5">
            <span className="text-[10px] text-white/40">Tippe & ziehe Items • 2 Finger zum Zoomen</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ClosetTile({ item, onAdd }: { item: DemoClothingItem; onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="glass-card shine w-full rounded-2xl p-2 text-left transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,20,147,0.3)] active:scale-[0.97]"
      title={`${item.category}${item.color ? ` · ${item.color}` : ""} – Tippen zum Hinzufügen`}
    >
      <div className="aspect-square overflow-hidden rounded-xl border-2 border-fuchsia-500/20 bg-[repeating-conic-gradient(#1a1a2e_0%_25%,#0a0a15_0%_50%)] bg-[length:12px_12px] shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageDataUrl} alt={item.category} className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-white/60 capitalize font-medium">{item.category}</span>
        <span className="text-[10px] text-fuchsia-400 font-bold uppercase">+ Add</span>
      </div>
    </button>
  );
}

function PlacedItemView({
  item,
  selected,
  boardRef,
  onSelect,
  onUpdate,
}: {
  item: Placed;
  selected: boolean;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onUpdate: (patch: Partial<Placed>) => void;
}) {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  
  // Track pinch state
  const initialPinchDistance = React.useRef<number | null>(null);
  const initialScale = React.useRef(item.scale);

  // Konstante Größe für Items (keine Änderung zwischen Modi)
  const baseSize = 120;

  const clampToBoard = (x: number, y: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    const w = rect.width;
    const h = rect.height;
    return { 
      x: Math.max(0, Math.min(x, w - baseSize)), 
      y: Math.max(0, Math.min(y, h - baseSize)) 
    };
  };

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    
    // Only start drag for single pointer (not pinch)
    if (e.pointerType === "touch") return; // Handle touch separately
    
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const newX = item.x + e.movementX;
    const newY = item.y + e.movementY;
    const clamped = clampToBoard(newX, newY);
    onUpdate({ x: clamped.x, y: clamped.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  // Touch handlers for drag and pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    onSelect();
    
    if (e.touches.length === 1) {
      // Single touch - prepare for drag
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      // Two fingers - prepare for pinch
      setIsDragging(false);
      initialPinchDistance.current = getDistance(e.touches[0], e.touches[1]);
      initialScale.current = item.scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent browser zoom
    
    if (e.touches.length === 1 && isDragging) {
      // Single finger drag
      const touch = e.touches[0];
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const newX = touch.clientX - rect.left - 60;
      const newY = touch.clientY - rect.top - 60;
      const clamped = clampToBoard(newX, newY);
      onUpdate({ x: clamped.x, y: clamped.y });
    } else if (e.touches.length === 2 && initialPinchDistance.current !== null) {
      // Two finger pinch-to-zoom
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scaleFactor = currentDistance / initialPinchDistance.current;
      const newScale = Math.max(0.3, Math.min(3, initialScale.current * scaleFactor));
      onUpdate({ scale: newScale });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    
    if (e.touches.length === 0) {
      setIsDragging(false);
      initialPinchDistance.current = null;
    } else if (e.touches.length === 1) {
      // Went from 2 fingers to 1 - reset pinch
      initialPinchDistance.current = null;
      initialScale.current = item.scale;
    }
  };

  // Mouse wheel for desktop zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.3, Math.min(3, item.scale + delta));
    onUpdate({ scale: newScale });
  };

  return (
    <div
      ref={itemRef}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        zIndex: item.zIndex,
        opacity: isDragging ? 0.85 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div
        style={{
          transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
          transformOrigin: "center",
        }}
      >
        <div className="relative select-none" style={{ width: baseSize, height: baseSize }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.imageDataUrl} 
            alt="" 
            className="h-full w-full object-contain pointer-events-none" 
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
            draggable={false}
          />
          {selected && (
            <div 
              className="absolute inset-0 rounded-lg ring-2 ring-fuchsia-500 ring-offset-0 pointer-events-none" 
              style={{ 
                background: "radial-gradient(circle, rgba(255,20,147,0.15) 0%, transparent 70%)",
                boxShadow: "0 0 20px rgba(255,20,147,0.4)"
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
