import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, expectedAuthCookie, isAuthConfigured } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // No SITE_PASSWORD set (e.g. local dev without it configured) — don't
  // lock anyone out, just let requests through unauthenticated.
  if (!isAuthConfigured()) return NextResponse.next();

  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  const expected = await expectedAuthCookie();
  if (cookie && expected && cookie === expected) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!login|api/login|_next/static|_next/image|icon.png|favicon.ico).*)"],
};
