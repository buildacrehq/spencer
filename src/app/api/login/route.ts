import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, hashPassword, isAuthConfigured } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "Login isn't configured (SITE_PASSWORD not set)." }, { status: 500 });
  }

  const { password } = await request.json();
  if (typeof password !== "string" || password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, await hashPassword(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}
