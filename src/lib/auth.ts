// Simple shared-password gate for this internal tool. No user accounts —
// one password (SITE_PASSWORD, server-only env var) for the whole team.
// The cookie stores a SHA-256 hash of the password rather than the
// plaintext, and both the login route and middleware independently
// recompute that hash from the env var to check it — no session store,
// no separate secret to manage.

export const AUTH_COOKIE = "spencer_auth";

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.SITE_PASSWORD);
}

export async function expectedAuthCookie(): Promise<string | null> {
  const password = process.env.SITE_PASSWORD;
  if (!password) return null;
  return hashPassword(password);
}
