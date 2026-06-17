import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VERCEL_DOMAIN = "playable-messages.vercel.app";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  if (host.includes(VERCEL_DOMAIN)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
