/**
 * Preview password gate. Active only when SITE_PASSWORD is set (e.g. on Vercel); local dev
 * and the public launch leave it unset. The cookie holds a SHA-256 of the password, so the
 * password itself never sits in the browser, and changing it logs everyone out.
 */
export const GATE_COOKIE = "clippable_gate";

export async function gateToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`clippable-preview:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Only same-site paths, so the gate can't be used to bounce visitors elsewhere. */
export function safeNext(next: string | null | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
