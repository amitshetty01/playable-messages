export type FeedbackType = "positive" | "negative";

export type FeedbackSource = "explicit" | "implicit_generate" | "implicit_customize" | "implicit_regenerate";

export type AIFeedbackEntry = {
  conceptId: string;
  conceptTitle: string;
  templateType: string;
  vibe: string;
  visualStyle: string;
  feedbackType: FeedbackType;
  source: FeedbackSource;
  timestamp: number;
  tone?: string;
  occasion?: string;
  recipient?: string;
};

const LOCAL_KEY = "ai_concept_feedback";
const MAX_LOCAL = 100;

export function getLocalFeedback(): AIFeedbackEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalFeedback(entry: AIFeedbackEntry): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalFeedback();
    existing.push(entry);
    const trimmed = existing.slice(-MAX_LOCAL);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(trimmed));
  } catch {
    /* storage full - silently ignore */
  }
}

export function getTemplateTypeScores(): Record<string, number> {
  const feedback = getLocalFeedback();
  const scores: Record<string, number> = {};
  for (const f of feedback) {
    const key = f.templateType.toLowerCase();
    if (scores[key] === undefined) scores[key] = 0;
    scores[key] += f.feedbackType === "positive" ? 1 : -1;
  }
  return scores;
}

export function getTopTemplateTypes(limit: number = 3): string[] {
  const scores = getTemplateTypeScores();
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([type]) => type);
}

export function getWorstTemplateTypes(limit: number = 3): string[] {
  const scores = getTemplateTypeScores();
  return Object.entries(scores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, limit)
    .map(([type]) => type);
}

export async function recordFeedback(entry: AIFeedbackEntry): Promise<void> {
  saveLocalFeedback(entry);
  try {
    await fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    }).catch(() => {});
  } catch {
    /* silently fail */
  }
}
