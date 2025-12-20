"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            type="button"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              "glass-card absolute left-1/2 top-1/2 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 sm:p-8",
              "border-2 border-fuchsia-500/40",
              "shadow-[0_0_60px_rgba(255,20,147,0.3),0_25px_50px_rgba(0,0,0,0.5)]",
              className,
            )}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                {title ? (
                  <div className="font-display text-xl font-bold uppercase tracking-wider text-white">
                    {title}
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-fuchsia-500/30 bg-black/50 text-fuchsia-400 hover:bg-fuchsia-500/20 hover:text-fuchsia-300 hover:border-fuchsia-500/50 transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,20,147,0.3)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
