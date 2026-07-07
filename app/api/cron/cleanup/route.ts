import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredExperiences } from "@/lib/data-retention";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await cleanupExpiredExperiences();
  return NextResponse.json({ ok: true, ...result });
}
