"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Store, UserCircle, LogOut } from "lucide-react";
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
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:py-3">
          <Link href="/closet" className="font-display text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="text-red-500">✦</span>
            <span className="hidden xs:inline">DollCloset</span>
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
                  "gap-2",
                  pathname === item.href && "bg-red-50 text-red-600"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden text-xs text-slate-500 sm:flex sm:items-center sm:gap-2">
              {demo ? (
                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-600 font-medium">
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
                <Button type="submit" variant="ghost" size="sm" className="sm:hidden p-2">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl sm:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors",
                  isActive 
                    ? "text-red-600 bg-red-50" 
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
