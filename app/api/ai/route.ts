import { NextRequest, NextResponse } from "next/server";
import { getSchemaForMode } from "@/lib/ai-validate";
import { ZodError } from "zod";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat";
const MAX_RETRIES = 2;

const VALID_ASSIST_TONES = ["Romantic", "Sorry", "Cute", "Emotional", "Funny", "Premium"] as const;
const VALID_OCCASIONS = ["Confession", "Apology", "Birthday", "Anniversary", "Proposal", "Just Because"] as const;
const VALID_RECIPIENTS = ["Partner", "Crush", "Friend", "Family"] as const;
const VALID_GAME_TONES = ["Romantic", "Cute", "Emotional", "Funny", "Premium"] as const;
const VALID_MODES = ["message_assist", "game_builder", "surprise_me", "regenerate_concept"] as const;

function buildFeedbackHint(preferredTypes?: string[], avoidTypes?: string[]): string {
  const parts: string[] = [];
  if (preferredTypes && preferredTypes.length > 0) {
    parts.push(`Users have historically preferred these template types: ${preferredTypes.join(", ")}. Consider using or adapting them.`);
  }
  if (avoidTypes && avoidTypes.length > 0) {
    parts.push(`Users have historically disliked these template types: ${avoidTypes.join(", ")}. AVOID using these exact types.`);
  }
  return parts.length > 0 ? "\n\n" + parts.join("\n") : "";
}

function buildSystemPrompt(mode: string, feedbackHint?: { preferredTypes?: string[]; avoidTypes?: string[] }): string {
  const base = "You are a creative AI assistant for Craft Your Message, an app that creates beautiful interactive messages. Respond in strict JSON only, no markdown, no code fences.";
  const feedbackStr = buildFeedbackHint(feedbackHint?.preferredTypes, feedbackHint?.avoidTypes);
  switch (mode) {
    case "message_assist":
      return `${base}
Given rough points and a desired tone, rewrite them into a beautiful short message (max 200 words). Return JSON: { "rewritten": "..." }`;
    case "game_builder":
      return `${base}${feedbackStr}
Given a user's story, occasion, recipient, and tone, generate 3 distinct interactive experience concepts. Return JSON:
{
  "concepts": [
    {
      "id": "concept-a",
      "title": "Short catchy title",
      "vibe": "One-line vibe description",
      "templateType": "Type of template (e.g. storybook, quiz, game, letter)",
      "visualStyle": "Visual direction (e.g. Dark cinematic, Soft pastel, Neon glitch)",
      "shortDescription": "One-sentence hook",
      "scenes": [
        {
          "heading": "Scene heading",
          "message": "Scene text content",
          "interaction": "User interaction type (tap, swipe, choose, reveal)"
        }
      ],
      "finalMessage": "The closing heartfelt message",
      "mediaSlots": [
        {
          "label": "Slot label e.g. 'Your photo together'",
          "type": "image",
          "description": "What to upload here"
        }
      ]
    }
  ]
}
Make each concept truly distinct in format, vibe, and approach. Use 2-4 scenes per concept.`;
    case "surprise_me":
      return `${base}${feedbackStr}
Generate a random delightful demo concept for an interactive message experience. Return JSON:
{
  "concepts": [
    {
      "id": "surprise-concept",
      "title": "Playful title",
      "vibe": "Surprising vibe description",
      "templateType": "storybook",
      "visualStyle": "Unexpected visual direction",
      "shortDescription": "One-sentence hook",
      "scenes": [
        {
          "heading": "Scene heading",
          "message": "Scene text",
          "interaction": "tap"
        }
      ],
      "finalMessage": "A warm closing message",
      "mediaSlots": [
        {
          "label": "A memorable photo",
          "type": "image",
          "description": "Upload a photo that captures this moment"
        }
      ]
    }
  ]
}`;
    case "regenerate_concept":
      return `${base}
Given an existing concept and user instruction, regenerate the concept with the requested changes. Return JSON:
{
  "concept": {
    "id": "same-id",
    "title": "...",
    "vibe": "...",
    "templateType": "...",
    "visualStyle": "...",
    "shortDescription": "...",
    "scenes": [ { "heading": "", "message": "", "interaction": "" } ],
    "finalMessage": "...",
    "mediaSlots": [ { "label": "", "type": "image", "description": "" } ]
  }
}`;
    default:
      return base;
  }
}

function validateInput(mode: string, body: Record<string, unknown>): string | null {
  if (!VALID_MODES.includes(mode as any)) return `Invalid mode "${mode}". Must be one of: ${VALID_MODES.join(", ")}`;

  if (mode === "message_assist") {
    if (!body.roughPoints || typeof body.roughPoints !== "string" || !body.roughPoints.trim())
      return "roughPoints is required and must be a non-empty string";
    if (!body.tone || !VALID_ASSIST_TONES.includes(body.tone as any))
      return `tone must be one of: ${VALID_ASSIST_TONES.join(", ")}`;
  }

  if (mode === "game_builder") {
    if (!body.story || typeof body.story !== "string" || !body.story.trim())
      return "story is required and must be a non-empty string";
    if (!body.occasion || !VALID_OCCASIONS.includes(body.occasion as any))
      return `occasion must be one of: ${VALID_OCCASIONS.join(", ")}`;
    if (!body.recipient || !VALID_RECIPIENTS.includes(body.recipient as any))
      return `recipient must be one of: ${VALID_RECIPIENTS.join(", ")}`;
    if (!body.tone || !VALID_GAME_TONES.includes(body.tone as any))
      return `tone must be one of: ${VALID_GAME_TONES.join(", ")}`;
  }

  if (mode === "regenerate_concept") {
    if (!body.concept || typeof body.concept !== "object")
      return "concept is required and must be an object";
    if (!body.instruction || typeof body.instruction !== "string" || !body.instruction.trim())
      return "instruction is required and must be a non-empty string";
  }

  return null;
}

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
      temperature: 0.8,
      max_tokens: 2048,
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

function cleanAndParse(raw: string): unknown {
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*$/g, "")
    .trim();
  return JSON.parse(cleaned);
}

function buildRetryPrompt(mode: string, originalUserMessage: string, zodError: ZodError): string {
  const issues = zodError.issues.map(i => `- ${i.path.join(".")}: ${i.message}`).join("\n");
  return `${originalUserMessage}\n\nYour previous response was invalid JSON that failed validation. Fix these specific errors:\n${issues}\n\nReturn ONLY valid JSON matching the required format.`;
}

async function callWithRetry(mode: string, systemPrompt: string, userMessage: string, attempt: number = 0): Promise<unknown> {
  const rawContent = await callOpenRouter(systemPrompt, userMessage);
  let parsed: unknown;

  try {
    parsed = cleanAndParse(rawContent);
  } catch {
    if (attempt < MAX_RETRIES) {
      const retryMsg = `Your previous response was not valid JSON. Parse error: The JSON was malformed. Return ONLY valid JSON with no markdown, no code fences, no explanations.`;
      return callWithRetry(mode, systemPrompt, `${userMessage}\n\n${retryMsg}`, attempt + 1);
    }
    throw new Error(`AI returned invalid JSON after ${MAX_RETRIES + 1} attempts`);
  }

  const schema = getSchemaForMode(mode);
  const result = schema.safeParse(parsed);

  if (!result.success) {
    if (attempt < MAX_RETRIES) {
      const retryMessage = buildRetryPrompt(mode, userMessage, result.error);
      return callWithRetry(mode, systemPrompt, retryMessage, attempt + 1);
    }
    throw new Error(`AI response failed validation after ${MAX_RETRIES + 1} attempts: ${result.error.issues.map(i => i.message).join("; ")}`);
  }

  return result.data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode } = body as { mode: string };

    const validationError = validateInput(mode, body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const feedbackHint = (body as any).feedbackHint as { preferredTypes?: string[]; avoidTypes?: string[] } | undefined;
    const systemPrompt = buildSystemPrompt(mode, feedbackHint);

    let userMessage = "";
    switch (mode) {
      case "message_assist": {
        const { roughPoints, tone } = body as { roughPoints: string; tone: string };
        userMessage = `Rewrite these rough points in a "${tone}" tone:\n\n${roughPoints}`;
        break;
      }
      case "game_builder": {
        const { story, occasion, recipient, tone } = body as { story: string; occasion: string; recipient: string; tone: string };
        userMessage = `Story: ${story}\n\nOccasion: ${occasion}\nRecipient: ${recipient}\nTone: ${tone}\n\nGenerate 3 distinct interactive concepts.`;
        break;
      }
      case "surprise_me":
        userMessage = "Generate a random delightful demo concept for an interactive message.";
        break;
      case "regenerate_concept": {
        const { concept, instruction } = body as { concept: unknown; instruction: string };
        userMessage = `Regenerate this concept with the following changes: ${instruction}\n\nCurrent concept:\n${JSON.stringify(concept, null, 2)}`;
        break;
      }
      default:
        return NextResponse.json({ error: `Unhandled mode: ${mode}` }, { status: 400 });
    }

    const data = await callWithRetry(mode, systemPrompt, userMessage);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[AI Route Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
