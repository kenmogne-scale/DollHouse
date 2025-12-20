import Link from "next/link";
import { Shirt, Store, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signOutAction } from "@/app/(public)/auth/actions";
import { DemoLogoutButton } from "@/components/demo/DemoLogoutButton";

export function AppNavbar({
  email,
  demo = false,
}: {
  email?: string | null;
  demo?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/closet" className="font-display text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <span className="text-red-500">✦</span>
          DollCloset
        </Link>

        <nav className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/closet">
              <Shirt className="h-4 w-4" />
              Closet
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/store">
              <Store className="h-4 w-4" />
              Store
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/account">
              <UserCircle className="h-4 w-4" />
              Account
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden text-xs text-slate-500 sm:flex sm:items-center sm:gap-2">
            {demo ? (
              <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-600 font-medium">
                Demo Mode
              </span>
            ) : null}
            <span>{email}</span>
          </div>
          {demo ? (
            <DemoLogoutButton />
          ) : (
            <form action={signOutAction}>
              <Button type="submit" variant="secondary" size="sm">
                Logout
              </Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
