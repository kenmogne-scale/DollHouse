import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <main className="px-6 py-12 text-center max-w-2xl mx-auto">
        {/* Gedicht */}
        <div className="space-y-6 mb-12">
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/90 font-light italic">
            Stoff schmiegt sich an,
            <br />
            wie nur Stil es kann.
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/90 font-light italic">
            Die Kurve, kühn und rund,
            <br />
            tut wahre Anmut kund.
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/90 font-light italic">
            Ein Gang wie Poesie,
            <br />
            schöner war sie nie.
          </p>
        </div>

        {/* Button */}
        <Button asChild size="lg" variant="primary">
          <Link href="/closet">Hier geht es zum heissesten Kleiderschrank der Welt ✦</Link>
        </Button>
      </main>
    </div>
  );
}
