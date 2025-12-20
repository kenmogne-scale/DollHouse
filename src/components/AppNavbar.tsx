"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Store, UserCircle, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signOutAction } from "@/app/(public)/auth/actions";
import { DemoLogoutButton } from "@/components/demo/DemoLogoutButton";
import { cn } from "@/lib/utils";

export function AppNavbar({
  email,
  demo = false,
}: {
  email?: string | null;
  demo?: boolean;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/closet", icon: Shirt, label: "Closet" },
    { href: "/store", icon: Store, label: "Store" },
    { href: "/account", icon: UserCircle, label: "Account" },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 border-b-2 border-fuchsia-500/20 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-6">
          <Link href="/closet" className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-500/30 border border-fuchsia-500/40 shadow-[0_0_10px_rgba(255,20,147,0.3)]">
              <Sparkles className="h-4 w-4 text-fuchsia-400" />
            </span>
            <span className="hidden xs:inline y2k-gradient-text">DollCloset</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 normal-case tracking-normal",
                  pathname === item.href && "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-white/50 sm:flex sm:items-center sm:gap-2">
              {demo ? (
                <span className="sticker-badge">
                  Demo
                </span>
              ) : null}
              <span className="max-w-[120px] truncate">{email}</span>
            </div>
            {demo ? (
              <DemoLogoutButton />
            ) : (
              <form action={signOutAction}>
                <Button type="submit" variant="secondary" size="sm" className="hidden sm:flex">
                  Logout
                </Button>
                <Button type="submit" variant="ghost" size="sm" className="sm:hidden p-2 min-w-0 min-h-0 h-9 w-9">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-fuchsia-500/20 bg-black/95 backdrop-blur-xl sm:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200",
                  isActive 
                    ? "text-fuchsia-400 bg-fuchsia-500/20 shadow-[0_0_15px_rgba(255,20,147,0.3)]" 
                    : "text-white/50 hover:text-white/80"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_8px_rgba(255,20,147,0.8)]")} />
                <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
