import type { Metadata } from "next";
import { Quicksand, Fredoka } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/Toaster";
import { PageTransition } from "@/components/motion/PageTransition";

const fontSans = Quicksand({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fontDisplay = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DollCloset",
  description: "Turn your real closet into a digital doll store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} min-h-dvh bg-[radial-gradient(ellipse_800px_600px_at_20%_10%,rgba(220,38,38,0.06),transparent_60%),radial-gradient(ellipse_600px_500px_at_85%_15%,rgba(251,113,133,0.08),transparent_55%),radial-gradient(ellipse_700px_700px_at_55%_95%,rgba(220,38,38,0.05),transparent_60%),linear-gradient(180deg,#ffffff_0%,#fafafa_100%)] text-slate-900 antialiased`}
      >
        {/* Y2K decorative elements */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-gradient-to-br from-red-100/40 to-transparent blur-3xl" />
          <div className="absolute -right-20 top-1/3 h-48 w-48 rounded-full bg-gradient-to-bl from-rose-100/30 to-transparent blur-3xl" />
          <div className="absolute bottom-20 left-1/4 h-32 w-32 rounded-full bg-gradient-to-tr from-red-50/50 to-transparent blur-2xl" />
        </div>
        <div className="relative z-10">
          <PageTransition>{children}</PageTransition>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
