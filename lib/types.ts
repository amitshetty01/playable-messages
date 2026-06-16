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
  tone: Tone;
  theme: ThemeName;
  customMessages: CustomMessages;
  finalMessage: string;
  createdAt: string;
  expiresAt?: string;
  analytics: ExperienceAnalytics;
  images?: string[];
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
