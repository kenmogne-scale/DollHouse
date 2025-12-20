"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className:
          "glass-card !border-white/15 !bg-white/10 !text-white !shadow-[var(--shadow)]",
        descriptionClassName: "!text-white/70",
      }}
    />
  );
}



