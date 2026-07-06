import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://craftyourmessage.com",
  "https://www.craftyourmessage.com",
  "https://craft-your-message.vercel.app",
];

export function validateOrigin(request: Request): { error?: NextResponse } {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (!origin && !referer) {
    return {};
  }

  const source = origin || referer || "";
  const isAllowed = ALLOWED_ORIGINS.some(
    (allowed) => source.startsWith(allowed)
  );

  if (!isAllowed) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {};
}

export function validateBody(body: Record<string, unknown>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    const value = body[field];
    if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}
