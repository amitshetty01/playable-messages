import { categories, defaultCustomMessages, defaultFinalMessage, getTemplate, themes, tones } from "@/lib/data";
import type { CustomMessages, ExperienceAnalytics, ExperienceRecord, ThemeName, Tone } from "@/lib/types";

const max = (value: unknown, fallback: string, length: number) => {
  const text = typeof value === "string" ? value.trim() : fallback;
  return text.slice(0, length) || fallback;
};

export function emptyAnalytics(templateId: string): ExperienceAnalytics {
  return {
    opened: 0,
    completed: 0,
    selectedChoices: {},
    finalCtaClicks: 0,
    templateUsed: templateId
  };
}

function parseExpiresAt(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw) return null;
  const date = new Date(raw);
  if (isNaN(date.getTime()) || date.getTime() <= Date.now()) return null;
  return date.toISOString();
}

export function normalizeExperiencePayload(body: Record<string, unknown>): Omit<ExperienceRecord, "id" | "createdAt" | "analytics"> & { expiresAt?: string } {
  const rawImages = body.images;
  const images = Array.isArray(rawImages) ? rawImages.filter((img): img is string => typeof img === "string" && img.startsWith("data:image")).slice(0, 6) : undefined;
  const templateId = max(body.templateId, "the-final-button", 80);
  const template = getTemplate(templateId) ?? getTemplate("the-final-button")!;
  const category = categories.some((item) => item.slug === body.category) ? String(body.category) : template.categorySlugs[0];
  const tone = tones.includes(body.tone as Tone) ? (body.tone as Tone) : template.tone;
  const theme = themes.includes(body.theme as ThemeName) ? (body.theme as ThemeName) : template.theme;
  const inputMessages = typeof body.customMessages === "object" && body.customMessages !== null ? (body.customMessages as Partial<CustomMessages>) : {};
  const steps = Array.isArray(inputMessages.steps) ? inputMessages.steps.map((step) => max(step, "", 320)).filter(Boolean).slice(0, 8) : defaultCustomMessages.steps;
  const sceneTitles = Array.isArray(inputMessages.sceneTitles) ? inputMessages.sceneTitles.map((t) => max(t, "", 120)).filter(Boolean).slice(0, 10) : undefined;

  return {
    templateId: template.id,
    category,
    creatorName: max(body.creatorName, "Someone", 80),
    receiverName: max(body.receiverName, "You", 80),
    tone,
    theme,
    customMessages: {
      landingText: max(inputMessages.landingText, template.hook, 180),
      buttonText: max(inputMessages.buttonText, defaultCustomMessages.buttonText, 48),
      steps: steps.length ? steps : defaultCustomMessages.steps,
      ctaMessage: max(inputMessages.ctaMessage, defaultCustomMessages.ctaMessage, 140),
      ...(sceneTitles?.length ? { sceneTitles } : {}),
    },
    finalMessage: max(body.finalMessage, defaultFinalMessage, 520),
    expiresAt: parseExpiresAt(body.expiresAt) ?? undefined,
    images,
  };
}

export function generateExperienceId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 14);
}
