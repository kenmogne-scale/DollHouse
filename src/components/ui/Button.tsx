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
        // Base styles
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold uppercase tracking-wider transition-all duration-200 will-change-transform",
        "active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        
        // Sizes
        size === "sm" && "h-9 px-4 text-xs",
        size === "md" && "h-11 px-6 text-sm",
        size === "lg" && "h-13 px-8 text-base",
        
        // Primary - Glossy Hot Pink
        variant === "primary" &&
          "glossy-btn shine text-white hover:-translate-y-0.5",
        
        // Secondary - Chrome/Silver
        variant === "secondary" &&
          "chrome-btn hover:-translate-y-0.5",
        
        // Ghost - Transparent with border
        variant === "ghost" &&
          "border-2 border-fuchsia-500/30 bg-transparent text-fuchsia-300 hover:bg-fuchsia-500/10 hover:border-fuchsia-500/50 hover:text-fuchsia-200 hover:shadow-[0_0_20px_rgba(255,20,147,0.2)]",
        
        className,
      )}
      {...props}
    />
  );
}
