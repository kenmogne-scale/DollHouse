import { NextResponse, type NextRequest } from "next/server";

// Keine Authentifizierung mehr erforderlich - direkter Zugang zur App
export async function middleware(req: NextRequest) {
  // Alle Routen sind jetzt öffentlich zugänglich
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};


