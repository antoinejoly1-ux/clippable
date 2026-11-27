import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, gateToken, safeNext } from "@/lib/gate";

/** Checks the preview password. JSON for the animated form, a redirect for plain form posts. */
export async function POST(request: NextRequest) {
  const expected = process.env.SITE_PASSWORD;
  const isJson = request.headers.get("content-type")?.includes("application/json");
  const body = isJson
    ? ((await request.json().catch(() => ({}))) as { password?: string; next?: string })
    : (Object.fromEntries((await request.formData()).entries()) as {
        password?: string;
        next?: string;
      });
  const next = safeNext(body.next);
  const given = typeof body.password === "string" ? body.password.slice(0, 200) : "";

  const ok = !!expected && (await gateToken(given)) === (await gateToken(expected));
  if (!ok) {
    // A short pause on every miss makes guessing slow.
    await new Promise((r) => setTimeout(r, 600));
    return isJson
      ? NextResponse.json({ ok: false }, { status: 401 })
      : NextResponse.redirect(
          new URL(`/gate?e=1&next=${encodeURIComponent(next)}`, request.url),
          303,
        );
  }

  const res = isJson
    ? NextResponse.json({ ok: true, next })
    : NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(GATE_COOKIE, await gateToken(expected), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
