import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import { getSupabaseEnv } from "@/lib/supabase/env";

const PROTECTED_PREFIXES = ["/closet", "/outfits", "/store", "/account"];
const DEMO_COOKIE = "dc_demo";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // Demo Mode (kein Supabase): Schutz via Cookie, Daten im Browser (localStorage)
  if (!getSupabaseEnv()) {
    const demoAuthed = req.cookies.get(DEMO_COOKIE)?.value === "1";

    if (isProtected && !demoAuthed) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/auth";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname.startsWith("/auth") && demoAuthed) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/closet";
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  const { supabase, res } = createSupabaseMiddlewareClient(req);

  // Refresh session cookies (Supabase SSR requirement)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtected && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Optional UX: wenn eingeloggt, /auth nicht mehr anbieten
  if (pathname.startsWith("/auth") && user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/closet";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};


