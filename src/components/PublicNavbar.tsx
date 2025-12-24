import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-fuchsia-500/20 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-violet-500/30 border-2 border-fuchsia-500/40 shadow-[0_0_15px_rgba(255,20,147,0.3)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(255,20,147,0.5)] group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
          </span>
          <span className="font-display text-lg font-bold uppercase tracking-wider y2k-gradient-text">
            Laura's Closet
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth">Login</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/auth">Register ✦</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
