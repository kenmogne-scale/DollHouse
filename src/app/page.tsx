import Link from "next/link";
import { Sparkles, Upload, Shirt, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PublicNavbar } from "@/components/PublicNavbar";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 font-medium shadow-sm">
              <Sparkles className="h-4 w-4 text-red-500" />
              Bratz-inspiriertes Dress-up – aber mit deinem echten Closet
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
              Turn your real closet into a{" "}
              <span className="y2k-gradient-text">
                digital doll store.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Lade deine echten Kleidungsstücke als Bilder hoch, baue Outfits per
              Drag &amp; Drop und speichere sie in deinem persönlichen Showroom.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="primary">
                <Link href="/auth">Get access / Sign up ✦</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/auth">Login</Link>
              </Button>
            </div>

            <p className="text-xs text-slate-400">
              MVP: Upload → Outfit Builder → Store. Mobile-first. Supabase Auth.
            </p>
          </div>

          <div className="glass-card shine bubble-ring rounded-3xl p-5 sm:p-7">
            <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white via-slate-50/50 to-white p-6 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="font-display text-sm font-semibold text-slate-700">
                  DollCloset Showroom
                </div>
                <div className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-600 font-medium">
                  ✦ y2k mode
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="aspect-[4/3] rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-rose-50 shadow-sm" />
                <div className="aspect-[4/3] rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-red-50 shadow-sm" />
                <div className="aspect-[4/3] rounded-2xl border border-red-100 bg-gradient-to-br from-white via-red-50/30 to-white shadow-sm" />
                <div className="aspect-[4/3] rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/50 via-white to-red-50/50 shadow-sm" />
              </div>
              <div className="mt-5 text-xs text-slate-500">
                Deine echten Pieces → digitale Doll-Vibes. ✦
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-800">
                Drei Steps. Ein Showroom. ✦
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Alles, was du fürs MVP brauchst – funktional &amp; clean.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
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
      </main>
    </div>
  );
}
