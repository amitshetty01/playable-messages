import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat";
const MAX_RETRIES = 1;

const TweakRequestSchema = z.object({
  title: z.string().max(300),
  body: z.string().max(500).optional(),
  instruction: z.string().min(1).max(500),
  tone: z.string().max(50).optional(),
  theme: z.string().max(50).optional(),
});

const TweakResponseSchema = z.object({
  title: z.string().min(1).max(300),
  body: z.string().max(500).optional(),
});

async function callOpenRouter(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured on the server");
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://craftyourmessage.com",
      "X-Title": "Craft Your Message",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`OpenRouter API error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const content: string = json?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("OpenRouter returned empty response");
  return content;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TweakRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map(i => i.message).join("; ") }, { status: 400 });
    }

    const { title, body: stepBody, instruction, tone, theme } = parsed.data;

    const systemPrompt = `You are a creative editor for interactive message scenes. Modify ONLY the provided step content according to the user's instruction.
Keep the same structure and length. Return ONLY valid JSON: { "title": "modified title", "body": "modified body or empty string" }
No markdown, no code fences, no explanations.`;

    const contextInfo = [tone ? `Tone: ${tone}` : "", theme ? `Theme: ${theme}` : ""].filter(Boolean).join(", ");

    let userMessage = `Current step content:\nTitle: "${title}"\n${stepBody ? `Body: "${stepBody}"\n` : ""}\nInstruction: ${instruction}`;
    if (contextInfo) userMessage += `\n\nContext: ${contextInfo}`;

    let attempts = 0;
    let lastError = "";

    while (attempts <= MAX_RETRIES) {
      const rawContent = await callOpenRouter(systemPrompt, attempts > 0
        ? `${userMessage}\n\nYour previous response was invalid. ${lastError} Return ONLY valid JSON.`
        : userMessage);

      const cleaned = rawContent.replace(/```json\s*/gi, "").replace(/```\s*$/g, "").trim();
      let parsedJson: unknown;

      try {
        parsedJson = JSON.parse(cleaned);
      } catch {
        lastError = "The JSON could not be parsed.";
        attempts++;
        continue;
      }

      const result = TweakResponseSchema.safeParse(parsedJson);
      if (result.success) {
        return NextResponse.json({ data: result.data });
      }

      lastError = `Validation errors: ${result.error.issues.map(i => i.message).join("; ")}`;
      attempts++;
    }

    throw new Error(`Failed to tweak step after ${MAX_RETRIES + 1} attempts: ${lastError}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[Tweak Step Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
