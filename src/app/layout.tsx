import type { Metadata } from "next";
import { Outfit, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/Toaster";
import { PageTransition } from "@/components/motion/PageTransition";

// Display Font - Bold, edgy, mit Attitude
const fontDisplay = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Body Font - Rund, leicht verspielt, clean
const fontSans = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DollCloset ✦",
  description: "Turn your real closet into a digital doll store. Y2K Vibes only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} min-h-dvh bg-[var(--bg)] text-white antialiased`}
        style={{
          background: `
            radial-gradient(ellipse 900px 700px at 15% 5%, rgba(255, 20, 147, 0.15), transparent 60%),
            radial-gradient(ellipse 700px 600px at 85% 10%, rgba(155, 48, 255, 0.12), transparent 55%),
            radial-gradient(ellipse 800px 800px at 50% 100%, rgba(255, 0, 127, 0.1), transparent 60%),
            radial-gradient(ellipse 400px 400px at 90% 80%, rgba(155, 48, 255, 0.08), transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #0d0510 30%, #100818 60%, #0a0a0a 100%)
          `,
        }}
      >
        {/* Y2K Decorative Elements - Bratz Style */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {/* Large fuchsia glow */}
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-transparent blur-3xl" />
          {/* Violet accent */}
          <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-gradient-to-bl from-violet-500/15 to-transparent blur-3xl" />
          {/* Hot pink bottom */}
          <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-500/10 to-transparent blur-3xl" />
          {/* Chrome accent */}
          <div className="absolute right-1/4 top-3/4 h-40 w-40 rounded-full bg-gradient-to-tl from-white/5 to-transparent blur-2xl" />
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          className="pointer-events-none fixed inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 20, 147, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 20, 147, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        <div className="relative z-10">
          <PageTransition>{children}</PageTransition>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
