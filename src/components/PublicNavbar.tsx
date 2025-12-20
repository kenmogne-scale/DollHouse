import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200/50 shadow-sm">
            <Sparkles className="h-4 w-4 text-red-500" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-slate-800">
            DollCloset
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth">Login</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/auth">Register</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
