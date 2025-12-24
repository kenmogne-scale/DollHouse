import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Decorative Top Badge */}
          <div className="inline-flex items-center gap-2 sticker-badge mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Laura&apos;s Closet ✦
          </div>

          {/* Gedicht in Glass Card */}
          <div className="glass-card shine bubble-ring rounded-3xl p-8 sm:p-12 mb-10">
            <div className="space-y-8">
              {/* Zeile 1 */}
              <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/90 font-light italic">
                <span className="y2k-gradient-text font-normal">Stoff</span> schmiegt sich an,
                <br />
                wie nur <span className="y2k-gradient-text font-normal">Stil</span> es kann.
              </p>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
                <Heart className="h-4 w-4 text-fuchsia-400 heartbeat" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
              </div>

              {/* Zeile 2 */}
              <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/90 font-light italic">
                Die <span className="y2k-gradient-text font-normal">Kurve</span>, kühn und rund,
                <br />
                tut wahre <span className="y2k-gradient-text font-normal">Anmut</span> kund.
              </p>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                <Sparkles className="h-4 w-4 text-violet-400" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              </div>

              {/* Zeile 3 */}
              <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/90 font-light italic">
                Ein Gang wie <span className="y2k-gradient-text font-normal">Poesie</span>,
                <br />
                schöner war sie <span className="y2k-gradient-text font-normal neon-text">nie</span>.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-6">
            <Button asChild size="lg" variant="primary" className="text-base sm:text-lg px-8 py-4">
              <Link href="/closet">
                <span className="flex items-center gap-2">
                  Hier geht es zum heissesten Kleiderschrank der Welt
                  <Sparkles className="h-5 w-5" />
                </span>
              </Link>
            </Button>

            {/* Subtle Footer */}
            <p className="text-xs text-white/30 uppercase tracking-widest">
              ✦ Dein persönlicher Showroom wartet ✦
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Decorative Element */}
      <div className="relative z-10 py-6 text-center">
        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] y2k-gradient-text">
          Fashion is Poetry ✦
        </p>
      </div>
    </div>
  );
}
