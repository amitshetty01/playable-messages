import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    null;

  return Response.json({ country });
}
