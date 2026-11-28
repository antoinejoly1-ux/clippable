import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, gateToken } from "@/lib/gate";

/** Password-gates every page while SITE_PASSWORD is set; the gate page itself stays open. */
export async function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  const token = request.cookies.get(GATE_COOKIE)?.value;
  if (token && token === (await gateToken(password))) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/gate";
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`;
  const res = NextResponse.rewrite(url);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  // Everything except the gate itself and static assets. /media stays open because the
  // image optimizer fetches it server-side without the visitor's cookie.
  matcher: [
    "/((?!gate|api/gate|_next/static|_next/image|media/|brand/|icon.svg|favicon.ico|apple-icon.png|opengraph-image|twitter-image).*)",
  ],
};
