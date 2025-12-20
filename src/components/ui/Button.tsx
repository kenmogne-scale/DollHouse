"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-150 will-change-transform",
        "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        variant === "primary" &&
          "shine bg-gradient-to-b from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/30 border border-red-400/50",
        variant === "secondary" &&
          "chrome-btn text-slate-700 hover:-translate-y-0.5 hover:text-slate-900",
        variant === "ghost" &&
          "border border-slate-200 bg-white/60 text-slate-600 hover:bg-white hover:text-slate-900 hover:border-slate-300",
        className,
      )}
      {...props}
    />
  );
}
