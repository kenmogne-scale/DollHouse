import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-card shine rounded-3xl p-5 sm:p-6 glow-hover",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 text-fuchsia-400 border border-fuchsia-500/30 shadow-[0_0_15px_rgba(255,20,147,0.3)]">
          {icon}
        </div>
        <div>
          <div className="font-display text-base font-bold uppercase tracking-wide text-white">{title}</div>
          <div className="mt-1 text-sm text-white/60">{description}</div>
        </div>
      </div>
    </div>
  );
}
