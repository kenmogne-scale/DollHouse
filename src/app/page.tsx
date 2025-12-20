import Link from "next/link";
import { Sparkles, Upload, Shirt, Store, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PublicNavbar } from "@/components/PublicNavbar";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12 sm:px-6">
        <section className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            {/* Sticker Badge */}
            <div className="inline-flex items-center gap-2 sticker-badge">
              <Sparkles className="h-3.5 w-3.5" />
              Y2K FASHION VIBES ✦
            </div>

            <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl uppercase">
              Turn your real closet into a{" "}
              <span className="y2k-gradient-text neon-text">
                digital doll store.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-7 text-white/60 sm:text-lg">
              Lade deine echten Kleidungsstücke als Bilder hoch, baue Outfits per
              Drag &amp; Drop und speichere sie in deinem persönlichen Showroom.
              <span className="text-fuchsia-400"> Bratz-inspiriert, aber mit deinen Pieces.</span>
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" variant="primary">
                <Link href="/auth">Get Access ✦</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/auth">Login</Link>
              </Button>
            </div>

            <p className="text-xs text-white/30 uppercase tracking-widest">
              Upload → Outfit Builder → Store. Mobile-first. Supabase Auth.
            </p>
          </div>

          {/* Hero Preview Card */}
          <div className="glass-card shine bubble-ring rounded-3xl p-6 sm:p-8">
            <div className="rounded-2xl border-2 border-fuchsia-500/20 bg-gradient-to-br from-black via-fuchsia-950/20 to-black p-6 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  DollCloset Showroom
                </div>
                <div className="sticker-badge flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Y2K MODE
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="aspect-[4/3] rounded-2xl border-2 border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 via-black to-violet-500/10 shadow-[inset_0_0_30px_rgba(255,20,147,0.1)]" />
                <div className="aspect-[4/3] rounded-2xl border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-black to-fuchsia-500/10 shadow-[inset_0_0_30px_rgba(155,48,255,0.1)]" />
                <div className="aspect-[4/3] rounded-2xl border-2 border-pink-500/30 bg-gradient-to-br from-black via-pink-950/20 to-black shadow-[inset_0_0_30px_rgba(236,72,153,0.1)]" />
                <div className="aspect-[4/3] rounded-2xl border-2 border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/5 via-black to-violet-500/5 shadow-[inset_0_0_30px_rgba(255,20,147,0.05)]" />
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-white/40">
                <Heart className="h-3.5 w-3.5 text-fuchsia-500 heartbeat" />
                Deine echten Pieces → digitale Doll-Vibes.
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
                Drei Steps. Ein Showroom. ✦
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Alles, was du fürs MVP brauchst – funktional &amp; mit Attitude.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Card
              title="Upload"
              description="Deine Teile als Bilder hochladen & kategorisieren."
              icon={<Upload className="h-5 w-5" />}
            />
            <Card
              title="Build Outfits"
              description="Drag & Drop auf ein glossy Board – speichern."
              icon={<Shirt className="h-5 w-5" />}
            />
            <Card
              title="Your Store"
              description="Outfits als Thumbnails im persönlichen Store anzeigen."
              icon={<Store className="h-5 w-5" />}
            />
          </div>
        </section>

        {/* Decorative Footer Text */}
        <div className="mt-20 text-center">
          <p className="font-display text-lg font-bold uppercase tracking-[0.2em] y2k-gradient-text">
            Fashion is a form of self-expression ✦
          </p>
        </div>
      </main>
    </div>
  );
}
