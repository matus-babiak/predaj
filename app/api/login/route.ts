import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword) {
    return NextResponse.json({ ok: true, note: "Heslo nie je nastavené (vývoj)" });
  }
  if (!password || password !== appPassword) {
    return NextResponse.json({ error: "Nesprávne heslo" }, { status: 401 });
  }

  const token = await createToken(appPassword);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 180 * 24 * 60 * 60,
    path: "/",
  });
  return res;
}
