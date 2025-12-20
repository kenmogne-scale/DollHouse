"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border-2 border-fuchsia-500/30 bg-black/50 px-4 text-sm text-white placeholder:text-white/40",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:border-fuchsia-500/60",
        "hover:border-fuchsia-500/50 hover:shadow-[0_0_15px_rgba(255,20,147,0.15)]",
        className,
      )}
      {...props}
    />
  );
});
