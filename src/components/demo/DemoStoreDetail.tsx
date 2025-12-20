"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Download, ArrowLeft, Pencil, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { loadJson, saveJson } from "@/lib/demo/storage";
import { DEMO_ITEMS_KEY, DEMO_OUTFITS_KEY } from "@/lib/demo/constants";
import type { DemoClothingItem, DemoOutfit } from "@/lib/demo/types";

export function DemoStoreDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const boardRef = React.useRef<HTMLDivElement>(null);

  const [outfit, setOutfit] = React.useState<DemoOutfit | null>(null);
  const [items, setItems] = React.useState<DemoClothingItem[]>([]);
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    setItems(loadJson<DemoClothingItem[]>(DEMO_ITEMS_KEY, []));
    const outfits = loadJson<DemoOutfit[]>(DEMO_OUTFITS_KEY, []);
    setOutfit(outfits.find((o) => o.id === id) ?? null);
  }, [id]);

  if (!outfit) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-white/50">
        Outfit nicht gefunden.
      </div>
    );
  }

  const byId = new Map(items.map((i) => [i.id, i]));
  const placed = outfit.items
    .slice()
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((it) => ({ ...it, img: byId.get(it.clothingItemId)?.imageDataUrl ?? null }));

  function del() {
    if (!outfit) return;
    const outfits = loadJson<DemoOutfit[]>(DEMO_OUTFITS_KEY, []);
    const next = outfits.filter((o) => o.id !== outfit.id);
    saveJson(DEMO_OUTFITS_KEY, next);
    router.push("/store");
  }

  async function exportPDF() {
    if (!boardRef.current || !outfit) return;
    
    setExporting(true);
    toast.loading("PDF wird erstellt...", { id: "pdf-export" });

    try {
      // Dynamically import to reduce bundle size
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Capture the board as canvas
      const canvas = await html2canvas(boardRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0a0a0a",
      });

      // Create PDF (A4 format)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(255, 20, 147); // Fuchsia
      pdf.text(outfit.name, pageWidth / 2, 20, { align: "center" });
      
      // Add subtitle
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Created with DollCloset ✦", pageWidth / 2, 28, { align: "center" });

      // Calculate image dimensions to fit on page
      const imgWidth = pageWidth - 30; // 15mm margin on each side
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      
      // Center the image
      const imgX = 15;
      const imgY = 35;

      // Add the collage image
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth, Math.min(imgHeight, pageHeight - 50));

      // Add date at bottom
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Exportiert am ${new Date().toLocaleDateString("de-DE")}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Download PDF
      pdf.save(`${outfit.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
      
      toast.success("PDF erfolgreich erstellt! ✦", { id: "pdf-export" });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("PDF-Export fehlgeschlagen", { id: "pdf-export" });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
            <h1 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">{outfit.name}</h1>
          </div>
          <p className="text-xs sm:text-sm text-white/50">Demo Preview</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 normal-case">
            <Link href="/store">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Link>
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            size="sm"
            className="gap-1.5"
            onClick={exportPDF}
            disabled={exporting}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button asChild variant="primary" size="sm" className="gap-1.5">
            <Link href={`/outfits/builder?outfitId=${outfit.id}`}>
              <Pencil className="h-4 w-4" />
              <span className="hidden sm:inline">Bearbeiten</span>
            </Link>
          </Button>
          <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-fuchsia-400 hover:bg-fuchsia-500/20" onClick={del}>
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Löschen</span>
          </Button>
        </div>
      </div>

      {/* Collage Preview Board - Hochformat (3:4) */}
      <div 
        ref={boardRef}
        className="relative mx-auto w-full max-w-[450px] overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-fuchsia-500/30 bg-black shadow-[inset_0_0_40px_rgba(255,20,147,0.1),0_0_40px_rgba(255,20,147,0.1)]"
        style={{ aspectRatio: "3/4" }}
      >
        {placed.map((it) =>
          it.img ? (
            <div
              key={it.id}
              className="absolute"
              style={{
                left: it.x,
                top: it.y,
                width: 120,
                height: 120,
                zIndex: it.zIndex,
                transform: `rotate(${it.rotation}deg) scale(${it.scale})`,
                transformOrigin: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={it.img} 
                alt="" 
                className="h-full w-full object-contain" 
                style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
              />
            </div>
          ) : null,
        )}
      </div>

      {/* Export hint */}
      <div className="text-center text-xs text-white/30">
        Tipp: Klicke auf PDF um deine Collage zu exportieren und zu teilen.
      </div>
    </div>
  );
}
