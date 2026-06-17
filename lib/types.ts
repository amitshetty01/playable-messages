export type Tone =
  | "Romantic"
  | "Funny"
  | "Sorry"
  | "Savage"
  | "Emotional"
  | "Mystery"
  | "Birthday"
  | "Friendship";

export type ThemeName =
  | "Dark Romantic"
  | "Soft Pastel"
  | "Minimal Black"
  | "Cute Pink"
  | "Neon Glitch"
  | "Cinematic Purple"
  | "Clean White";

export type Category = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  accent: string;
};

export type Template = {
  id: string;
  slug: string;
  title: string;
  hook: string;
  categorySlugs: string[];
  bestFor: string;
  length: string;
  tone: Tone;
  theme: ThemeName;
  status: "full" | "placeholder";
  formula: string[];
  description: string;
};

export type RelationshipTag = "partner" | "friend" | "family" | "coworker" | "";

export const RELATIONSHIP_TAGS: { value: RelationshipTag; label: string; emoji: string }[] = [
  { value: "partner", label: "Partner", emoji: "💕" },
  { value: "friend", label: "Friend", emoji: "🤝" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { value: "coworker", label: "Coworker", emoji: "💼" },
  { value: "", label: "Other", emoji: "✨" },
];

export function getRelationshipLabel(tag: RelationshipTag): string {
  return RELATIONSHIP_TAGS.find((r) => r.value === tag)?.label ?? "";
}

export function getRelationshipIntro(tag: RelationshipTag, creatorName: string, receiverName: string): string {
  if (!receiverName && !creatorName) return "Someone made this for you.";
  switch (tag) {
    case "partner": return creatorName ? `${creatorName} has something to tell you.` : "Someone close has something to tell you.";
    case "friend": return creatorName ? `${creatorName} wanted you to see this.` : "A friend wanted you to see this.";
    case "family": return creatorName ? `${creatorName} made this for you.` : "Family made this for you.";
    case "coworker": return creatorName ? `${creatorName} sent this your way.` : "A coworker sent this your way.";
    default: return creatorName ? `${creatorName} made something for you.` : "Someone made something for you.";
  }
}

export function getRelationshipCloser(tag: RelationshipTag, creatorName: string): string {
  switch (tag) {
    case "partner": return `from someone who loves you`;
    case "friend": return `from a friend who gets you`;
    case "family": return `from family`;
    case "coworker": return `from someone who knows your grind`;
    default: return creatorName ? `from ${creatorName}` : `from someone who cares`;
  }
}

export const ANON_TONES: Tone[] = ["Mystery", "Savage", "Funny"];

export type CustomMessages = {
  landingText: string;
  buttonText: string;
  steps: string[];
  ctaMessage: string;
  sceneTitles?: string[];
};

export type ExperienceAnalytics = {
  opened: number;
  completed: number;
  selectedChoices: Record<string, number>;
  finalCtaClicks: number;
  templateUsed: string;
};

export type ExperienceRecord = {
  id: string;
  templateId: string;
  category: string;
  creatorName: string;
  receiverName: string;
  relationshipTag: RelationshipTag;
  showCreatorName: boolean;
  tone: Tone;
  theme: ThemeName;
  customMessages: CustomMessages;
  finalMessage: string;
  createdAt: string;
  expiresAt?: string;
  analytics: ExperienceAnalytics;
  images?: string[];
  reaction?: string;
};

export type AnalyticsEventType =
  | "experience_opened"
  | "experience_completed"
  | "selected_mood_choice"
  | "final_cta_clicked"
  | "template_used";

export type AnalyticsPayload = {
  eventType: AnalyticsEventType;
  templateId?: string;
  choice?: string;
};
