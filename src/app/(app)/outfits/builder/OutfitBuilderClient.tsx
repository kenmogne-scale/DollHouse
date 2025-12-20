"use client";

import * as React from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Palette,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { saveOutfitAction, type SaveOutfitState } from "@/app/(app)/outfits/builder/actions";

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

export type ClosetItemForBuilder = {
  id: string;
  imageUrl: string;
  category: string;
  color: string | null;
};

export type BuilderPlacedItem = {
  localId: string;
  clothingItemId: string;
  imageUrl: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
};

export function OutfitBuilderClient({
  closetItems,
  initialOutfit,
}: {
  closetItems: ClosetItemForBuilder[];
  initialOutfit?: {
    id: string;
    name: string;
    items: BuilderPlacedItem[];
  } | null;
}) {
  const boardRef = React.useRef<HTMLDivElement | null>(null);

  const [name, setName] = React.useState(initialOutfit?.name ?? "Outfit 1");
  const [placed, setPlaced] = React.useState<BuilderPlacedItem[]>(
    initialOutfit?.items ?? [],
  );
  const [selected, setSelected] = React.useState<string | null>(
    initialOutfit?.items?.[0]?.localId ?? null,
  );
  const [bgColor, setBgColor] = React.useState("#0a0a0a");
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const maxZ = React.useMemo(
    () => placed.reduce((m, i) => Math.max(m, i.zIndex), 0),
    [placed],
  );

  const [saveState, saveAction] = useFormState<SaveOutfitState, FormData>(
    saveOutfitAction,
    {},
  );

  React.useEffect(() => {
    if (saveState?.error) toast.error(saveState.error);
  }, [saveState?.error]);

  const selectedItem = placed.find((p) => p.localId === selected) ?? null;
  const itemsJson = JSON.stringify(
    placed
      .slice()
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((it) => ({
        clothingItemId: it.clothingItemId,
        x: it.x,
        y: it.y,
        scale: it.scale,
        rotation: it.rotation,
        zIndex: it.zIndex,
      })),
  );

  function bumpZ(localId: string) {
    setPlaced((prev) => {
      const nextZ = prev.reduce((m, i) => Math.max(m, i.zIndex), 0) + 1;
      return prev.map((i) => (i.localId === localId ? { ...i, zIndex: nextZ } : i));
    });
  }

  function updateItem(localId: string, patch: Partial<BuilderPlacedItem>) {
    setPlaced((prev) => prev.map((i) => (i.localId === localId ? { ...i, ...patch } : i)));
  }

  function updateSelected(patch: Partial<BuilderPlacedItem>) {
    if (!selected) return;
    setPlaced((prev) => prev.map((i) => (i.localId === selected ? { ...i, ...patch } : i)));
  }

  function removeSelected() {
    if (!selected) return;
    setPlaced((prev) => prev.filter((i) => i.localId !== selected));
    setSelected(null);
  }

  function addItemToBoard(src: ClosetItemForBuilder) {
    const localId = crypto.randomUUID();
    const boardWidth = boardRef.current?.clientWidth ?? 600;
    const boardHeight = boardRef.current?.clientHeight ?? 600;
    const newItem: BuilderPlacedItem = {
      localId,
      clothingItemId: src.id,
      imageUrl: src.imageUrl,
      x: (boardWidth / 2) - 60,
      y: (boardHeight / 2) - 60,
      scale: 1,
      rotation: 0,
      zIndex: maxZ + 1,
    };
    setPlaced((prev) => [...prev, newItem]);
    setSelected(localId);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-white">Collage Builder</h1>
          </div>
          <p className="text-sm text-white/50">
            Tippe auf Items um sie hinzuzufügen, verschiebe sie auf dem Board.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="gap-2 normal-case">
            <Link href="/closet">
              <ArrowLeft className="h-4 w-4" />
              Closet
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Left: closet */}
        <aside className="glass-card rounded-3xl p-4">
          <div className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-fuchsia-400" />
            Closet Items
          </div>
          <div className="mt-4 max-h-[560px] overflow-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              {closetItems.map((it) => (
                <ClosetTile key={it.id} item={it} onAdd={() => addItemToBoard(it)} />
              ))}
            </div>
          </div>
          <div className="mt-4 text-[11px] text-white/40">
            Tippe auf ein Item, um es hinzuzufügen.
          </div>
        </aside>

        {/* Right: board */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Name</div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-[min(420px,70vw)]"
              />
            </div>

            <form action={saveAction} className="flex items-center gap-2">
              <input type="hidden" name="name" value={name} />
              <input type="hidden" name="items" value={itemsJson} />
              <input
                type="hidden"
                name="outfitId"
                value={initialOutfit?.id ?? ""}
              />
              <SaveSubmitButton disabledBecauseEmpty={!placed.length} />
            </form>
          </div>

          {/* Background Color Selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 normal-case"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette className="h-4 w-4" />
              Hintergrund
              <div 
                className="h-5 w-5 rounded-full border-2 border-fuchsia-500/50 shadow-[0_0_8px_rgba(255,20,147,0.3)]" 
                style={{ backgroundColor: bgColor }}
              />
            </Button>
            
            {showColorPicker && (
              <div className="flex items-center gap-2 flex-wrap">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      setBgColor(color.value);
                      setShowColorPicker(false);
                    }}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
                      bgColor === color.value 
                        ? "border-fuchsia-500 ring-2 ring-fuchsia-500/50 shadow-[0_0_15px_rgba(255,20,147,0.5)]" 
                        : "border-fuchsia-500/30 hover:border-fuchsia-500/60"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Board - Hochformat (Breite: 450px, Höhe: 600px = 3:4 Ratio) */}
          <div
            ref={boardRef}
            className="relative mx-auto overflow-hidden rounded-3xl border-2 border-fuchsia-500/30 shadow-[inset_0_0_40px_rgba(255,20,147,0.1),0_0_40px_rgba(255,20,147,0.1)]"
            style={{ 
              backgroundColor: bgColor, 
              touchAction: "none",
              width: "450px",
              maxWidth: "100%",
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

          {/* Controls */}
          <div className="glass-card rounded-3xl p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-white/60">
                {selectedItem ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span>
                      Ausgewählt:{" "}
                      <span className="font-bold text-fuchsia-400">
                        {selectedItem.clothingItemId.slice(0, 8)}…
                      </span>
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                      {Math.round(selectedItem.scale * 100)}% | {selectedItem.rotation}°
                    </span>
                  </div>
                ) : (
                  "Tippe ein Item auf dem Board an."
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Size Controls */}
                <div className="flex items-center gap-1 rounded-full border-2 border-fuchsia-500/30 bg-black/50 p-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full min-w-0 min-h-0"
                    disabled={!selectedItem}
                    onClick={() =>
                      updateSelected({
                        scale: Math.max(0.3, (selectedItem?.scale ?? 1) - 0.1),
                      })
                    }
                    title="Kleiner"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-fuchsia-300 w-10 text-center font-bold">
                    {selectedItem ? `${Math.round(selectedItem.scale * 100)}%` : "—"}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full min-w-0 min-h-0"
                    disabled={!selectedItem}
                    onClick={() =>
                      updateSelected({
                        scale: Math.min(3, (selectedItem?.scale ?? 1) + 0.1),
                      })
                    }
                    title="Größer"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                {/* Rotation */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 normal-case"
                  disabled={!selectedItem}
                  onClick={() =>
                    updateSelected({
                      rotation: ((selectedItem?.rotation ?? 0) + 15) % 360,
                    })
                  }
                >
                  <RotateCw className="h-4 w-4" />
                  +15°
                </Button>

                {/* Delete */}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  disabled={!selectedItem}
                  onClick={removeSelected}
                >
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <div className="text-[11px] text-white/30 text-center">
        Tipp: Verschiebe Items per Drag. Auf Mobilgeräten: 2 Finger zum Zoomen.
      </div>
    </div>
  );
}

function SaveSubmitButton({ disabledBecauseEmpty }: { disabledBecauseEmpty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      className="gap-2"
      disabled={pending || disabledBecauseEmpty}
      title={disabledBecauseEmpty ? "Füge Items hinzu" : "Save Collage"}
    >
      <Save className="h-4 w-4" />
      {pending ? "Saving…" : "Save ✦"}
    </Button>
  );
}

function ClosetTile({ item, onAdd }: { item: ClosetItemForBuilder; onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="glass-card shine w-full rounded-2xl p-2 text-left transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,20,147,0.3)] active:scale-[0.97]"
      title={`${item.category}${item.color ? ` · ${item.color}` : ""} – Tippen zum Hinzufügen`}
    >
      <div className="aspect-square overflow-hidden rounded-xl border-2 border-fuchsia-500/20 bg-[repeating-conic-gradient(#1a1a2e_0%_25%,#0a0a15_0%_50%)] bg-[length:12px_12px] shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.category} className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
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
  item: BuilderPlacedItem;
  selected: boolean;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onUpdate: (patch: Partial<BuilderPlacedItem>) => void;
}) {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  
  // Track pinch state
  const initialPinchDistance = React.useRef<number | null>(null);
  const initialScale = React.useRef(item.scale);

  const clampToBoard = (x: number, y: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    const w = rect.width;
    const h = rect.height;
    const size = 120;
    return { 
      x: Math.max(0, Math.min(x, w - size)), 
      y: Math.max(0, Math.min(y, h - size)) 
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
    
    if (e.pointerType === "touch") return;
    
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

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    onSelect();
    
    if (e.touches.length === 1) {
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      initialPinchDistance.current = getDistance(e.touches[0], e.touches[1]);
      initialScale.current = item.scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const newX = touch.clientX - rect.left - 60;
      const newY = touch.clientY - rect.top - 60;
      const clamped = clampToBoard(newX, newY);
      onUpdate({ x: clamped.x, y: clamped.y });
    } else if (e.touches.length === 2 && initialPinchDistance.current !== null) {
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
      initialPinchDistance.current = null;
      initialScale.current = item.scale;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.3, Math.min(3, item.scale + delta));
    onUpdate({ scale: newScale });
  };

  const baseSize = 120;

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
            src={item.imageUrl} 
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
