"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { uploadClothingItemAction } from "@/app/(app)/closet/actions";
import { removeImageBackground, blobToFile } from "@/lib/removeBackground";

export function UploadItemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const form = formRef.current;
    if (!form) return;

    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error("Bitte wähle ein Bild aus.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Bitte wähle eine Bilddatei.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Datei ist zu groß (max. 10MB).");
      return;
    }

    setBusy(true);
    setProgress(0);
    setStatus("Lade AI-Modell...");

    try {
      // Remove background in browser
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

      // Convert blob to File
      const processedFile = blobToFile(processedBlob, file.name);

      // Create FormData with processed file
      setStatus("Hochladen...");
      const formData = new FormData(form);
      formData.set("image", processedFile);

      // Call server action
      const result = await uploadClothingItemAction({}, formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success("Item hochgeladen ✦");
        router.refresh();
        onClose();
        
        // Reset form
        form.reset();
        setProgress(0);
        setStatus("");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Fehler beim Verarbeiten");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload Item ✦">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Bild</label>
          <Input ref={fileRef} name="image" type="file" accept="image/*" required disabled={busy} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:bg-fuchsia-500/20 file:text-fuchsia-400 hover:file:bg-fuchsia-500/30 file:cursor-pointer" />
          <p className="text-[11px] text-white/40 flex items-center gap-1.5">
            <Sparkles className="inline h-3 w-3 text-fuchsia-400" />
            Der Hintergrund wird automatisch entfernt (max. 10MB).
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Kategorie</label>
          <select
            name="category"
            required
            disabled={busy}
            className="h-12 w-full rounded-2xl border-2 border-fuchsia-500/30 bg-black/50 px-4 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] disabled:opacity-50 cursor-pointer"
            defaultValue="tops"
          >
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider">Farbe (optional)</label>
          <Input
            name="color"
            placeholder="z.B. pink, black, teal…"
            maxLength={32}
            disabled={busy}
          />
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
