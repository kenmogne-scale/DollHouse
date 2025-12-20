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
        "glass-card shine rounded-3xl p-5 sm:p-6",
        "transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/10",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-red-600 border border-red-200/50 shadow-sm">
          {icon}
        </div>
        <div>
          <div className="font-display text-base font-semibold text-slate-800">{title}</div>
          <div className="mt-0.5 text-sm text-slate-500">{description}</div>
        </div>
      </div>
    </div>
  );
}
