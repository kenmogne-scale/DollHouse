"use client";

import * as React from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft,
  Save,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { saveOutfitAction, type SaveOutfitState } from "@/app/(app)/outfits/builder/actions";

// Hintergrundfarben-Optionen
const BACKGROUND_COLORS = [
  { id: "white", label: "Weiß", value: "#ffffff" },
  { id: "cream", label: "Creme", value: "#fef3e2" },
  { id: "pink", label: "Rosa", value: "#fce7f3" },
  { id: "lavender", label: "Lavendel", value: "#ede9fe" },
  { id: "mint", label: "Mint", value: "#d1fae5" },
  { id: "sky", label: "Himmelblau", value: "#e0f2fe" },
  { id: "peach", label: "Pfirsich", value: "#fed7aa" },
  { id: "gray", label: "Grau", value: "#f1f5f9" },
  { id: "black", label: "Schwarz", value: "#1e293b" },
];

export type ClosetItemForBuilder = {
  id: string;
  imageUrl: string; // signed URL
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
  
  // Touch + Pointer sensors für mobile Unterstützung
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  const [name, setName] = React.useState(initialOutfit?.name ?? "Outfit 1");
  const [placed, setPlaced] = React.useState<BuilderPlacedItem[]>(
    initialOutfit?.items ?? [],
  );
  const [selected, setSelected] = React.useState<string | null>(
    initialOutfit?.items?.[0]?.localId ?? null,
  );
  const [bgColor, setBgColor] = React.useState("#ffffff");
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

  function clampToBoard(x: number, y: number) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    const w = rect.width;
    const h = rect.height;
    // MVP: wir nehmen eine grobe Item-Size als Clamp (120x120)
    const item = 120;
    return {
      x: Math.max(0, Math.min(x, w - item)),
      y: Math.max(0, Math.min(y, h - item)),
    };
  }

  function onDragEnd(e: DragEndEvent) {
    const activeId = String(e.active.id);
    const delta = e.delta;

    // 1) Reposition existing placed item
    if (activeId.startsWith("placed:")) {
      const localId = activeId.replace("placed:", "");
      setPlaced((prev) =>
        prev.map((it) => {
          if (it.localId !== localId) return it;
          const next = clampToBoard(it.x + delta.x, it.y + delta.y);
          return { ...it, x: next.x, y: next.y };
        }),
      );
      return;
    }

    // 2) Drop from closet list onto board
    if (!e.over || String(e.over.id) !== "board") return;
    if (!activeId.startsWith("closet:")) return;

    const clothingItemId = activeId.replace("closet:", "");
    const src = closetItems.find((c) => c.id === clothingItemId);
    if (!src) return;

    const activator = e.activatorEvent as PointerEvent | TouchEvent;
    let clientX: number, clientY: number;
    
    if ('touches' in activator) {
      clientX = activator.touches[0]?.clientX ?? 0;
      clientY = activator.touches[0]?.clientY ?? 0;
    } else {
      clientX = activator.clientX;
      clientY = activator.clientY;
    }
    
    const endX = clientX + delta.x;
    const endY = clientY + delta.y;

    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nextPos = clampToBoard(endX - rect.left - 60, endY - rect.top - 60);
    const localId = crypto.randomUUID();
    const newItem: BuilderPlacedItem = {
      localId,
      clothingItemId,
      imageUrl: src.imageUrl,
      x: nextPos.x,
      y: nextPos.y,
      scale: 1,
      rotation: 0,
      zIndex: maxZ + 1,
    };

    setPlaced((prev) => [...prev, newItem]);
    setSelected(localId);
  }

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

  function updateSelected(patch: Partial<BuilderPlacedItem>) {
    if (!selected) return;
    setPlaced((prev) => prev.map((i) => (i.localId === selected ? { ...i, ...patch } : i)));
  }

  function removeSelected() {
    if (!selected) return;
    setPlaced((prev) => prev.filter((i) => i.localId !== selected));
    setSelected(null);
  }

  // Add item to board (on click)
  function addItemToBoard(src: ClosetItemForBuilder) {
    const localId = crypto.randomUUID();
    // Place in center of board
    const boardWidth = boardRef.current?.clientWidth ?? 600;
    const boardHeight = boardRef.current?.clientHeight ?? 600;
    const newItem: BuilderPlacedItem = {
      localId,
      clothingItemId: src.id,
      imageUrl: src.imageUrl,
      x: (boardWidth / 2) - 60, // Center horizontally
      y: (boardHeight / 2) - 60, // Center vertically
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
          <h1 className="font-display text-2xl font-semibold text-slate-800">Collage Builder ✦</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tippe auf Items um sie hinzuzufügen, verschiebe sie auf dem Board.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/closet">
              <ArrowLeft className="h-4 w-4" />
              Closet
            </Link>
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          {/* Left: closet */}
          <aside className="glass-card rounded-3xl p-4">
            <div className="font-display text-sm font-semibold text-slate-700">Closet Items</div>
            <div className="mt-3 max-h-[560px] overflow-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                {closetItems.map((it) => (
                  <ClosetTile key={it.id} item={it} onAdd={() => addItemToBoard(it)} />
                ))}
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              Tipp: Tippe auf ein Item, um es hinzuzufügen. Halte gedrückt zum Verschieben.
            </div>
          </aside>

          {/* Right: board */}
          <section className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="text-xs text-slate-500">Name</div>
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
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Palette className="h-4 w-4" />
                Hintergrund
                <div 
                  className="h-4 w-4 rounded-full border border-slate-300" 
                  style={{ backgroundColor: bgColor }}
                />
              </Button>
              
              {showColorPicker && (
                <div className="flex items-center gap-1 flex-wrap">
                  {BACKGROUND_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setBgColor(color.value);
                        setShowColorPicker(false);
                      }}
                      className={cn(
                        "h-7 w-7 rounded-full border-2 transition-all hover:scale-110",
                        bgColor === color.value ? "border-red-500 ring-2 ring-red-200" : "border-slate-200"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              )}
            </div>

            <div
              ref={boardRef}
              className="relative h-[600px] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-inner touch-none"
              style={{ backgroundColor: bgColor }}
            >
              <BoardDroppable id="board" />

              {placed
                .slice()
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((it) => (
                  <PlacedItemView
                    key={it.localId}
                    item={it}
                    selected={it.localId === selected}
                    onSelect={() => {
                      setSelected(it.localId);
                      bumpZ(it.localId);
                    }}
                  />
                ))}
            </div>

            {/* Controls */}
            <div className="glass-card rounded-3xl p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  {selectedItem ? (
                    <div className="flex items-center gap-3">
                      <span>
                        Ausgewählt:{" "}
                        <span className="font-medium text-slate-800">
                          {selectedItem.clothingItemId.slice(0, 8)}…
                        </span>
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-500">
                        {Math.round(selectedItem.scale * 100)}% | {selectedItem.rotation}°
                      </span>
                    </div>
                  ) : (
                    "Tippe ein Item auf dem Board an."
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Size Controls */}
                  <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
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
                    <span className="text-xs text-slate-500 w-10 text-center">
                      {selectedItem ? `${Math.round(selectedItem.scale * 100)}%` : "—"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
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
                    className="gap-1.5"
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
      </DndContext>
      
      <div className="text-[11px] text-slate-400">
        Tipp: Auf Mobilgeräten halte ein Item gedrückt, um es zu verschieben.
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

function BoardDroppable({ id }: { id: string }) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef} className="absolute inset-0" />;
}

function ClosetTile({ item, onAdd }: { item: ClosetItemForBuilder; onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="glass-card shine w-full rounded-2xl p-2 text-left transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
      title={`${item.category}${item.color ? ` · ${item.color}` : ""} – Tippen zum Hinzufügen`}
    >
      {/* Checkered background to show transparency */}
      <div className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:12px_12px] shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.category} className="h-full w-full object-contain" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-slate-600 capitalize">{item.category}</span>
        <span className="text-[10px] text-red-500">+ Add</span>
      </div>
    </button>
  );
}

function PlacedItemView({
  item,
  selected,
  onSelect,
}: {
  item: BuilderPlacedItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: `placed:${item.localId}` });

  // Separate drag transform from scale/rotation to avoid zoom bug
  const dragTransform = CSS.Transform.toString(transform);
  
  // Outer container only handles position and drag
  const outerStyle: React.CSSProperties = {
    left: item.x,
    top: item.y,
    zIndex: item.zIndex,
    transform: dragTransform || undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  // Inner container handles scale and rotation
  const innerStyle: React.CSSProperties = {
    transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
    transformOrigin: "center",
  };

  // Calculate size based on scale for proper hit area
  const baseSize = 120;

  return (
    <div
      ref={setNodeRef}
      style={outerStyle}
      className="absolute cursor-grab select-none touch-none"
      onPointerDownCapture={onSelect}
      {...listeners}
      {...attributes}
    >
      {/* Inner container for scale/rotation - prevents zoom bug */}
      <div style={innerStyle}>
        {/* Frei schwebende Klamotte ohne Box - wie ein Sticker */}
        <div className="relative" style={{ width: baseSize, height: baseSize }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.imageUrl} 
            alt="" 
            className="h-full w-full object-contain" 
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
          />
          {/* Selection indicator - subtle glow around the item */}
          {selected && (
            <div className="absolute inset-0 rounded-lg ring-2 ring-red-400 ring-offset-0 pointer-events-none" 
                 style={{ 
                   background: "radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)" 
                 }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
