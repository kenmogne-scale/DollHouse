import { NextResponse } from "next/server";

// Keine Authentifizierung mehr erforderlich - direkter Zugang zur App
export function middleware() {
  // Alle Routen sind jetzt öffentlich zugänglich
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};


