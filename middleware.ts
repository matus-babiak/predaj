import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifyToken } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const password = process.env.APP_PASSWORD;
  // Bez nastaveného hesla (lokálny vývoj) je appka otvorená.
  if (!password) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (await verifyToken(token, password)) return NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Neprihlásený" }, { status: 401 });
  }
  const login = req.nextUrl.clone();
  login.pathname = "/login";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/((?!login|api/login|_next/static|_next/image|favicon.ico|favicon-32.png|icon.svg|apple-touch-icon.png|icon-192.png|icon-512.png|manifest.webmanifest).*)",
  ],
};
