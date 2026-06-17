import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VERCEL_DOMAIN = "playable-messages.vercel.app";
const PRIMARY_DOMAIN = "craftyourmessage.com";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  if (host.includes(VERCEL_DOMAIN)) {
    const url = new URL(req.url);
    url.host = PRIMARY_DOMAIN;
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
