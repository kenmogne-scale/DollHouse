"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className:
          "!border-2 !border-fuchsia-500/30 !bg-black/90 !backdrop-blur-xl !text-white !shadow-[0_0_30px_rgba(255,20,147,0.2)] !rounded-2xl",
        descriptionClassName: "!text-white/60",
      }}
    />
  );
}
