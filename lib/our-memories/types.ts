export type Memory = {
  id: string;
  photo: string;
  title: string;
  caption: string;
};

export type ThemePreset = {
  id: string;
  name: string;
  bg: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  heartColor: string;
  headingFont: string;
  bodyFont: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "romantic-cream",
    name: "Romantic Cream",
    bg: "#faf5f0",
    cardBg: "#ffffff",
    cardBorder: "rgba(201, 168, 124, 0.25)",
    accent: "#d4899e",
    textPrimary: "#3d2c2c",
    textSecondary: "#8c7a7a",
    heartColor: "#e8a0bf",
    headingFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Nunito Sans', system-ui, sans-serif",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    bg: "#fdf8f3",
    cardBg: "#fffcf8",
    cardBorder: "rgba(201, 168, 124, 0.3)",
    accent: "#c9a87c",
    textPrimary: "#4a3535",
    textSecondary: "#9a8585",
    heartColor: "#d4a373",
    headingFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Nunito Sans', system-ui, sans-serif",
  },
  {
    id: "midnight-love",
    name: "Midnight Love",
    bg: "#1a1622",
    cardBg: "#252030",
    cardBorder: "rgba(200, 180, 220, 0.15)",
    accent: "#c9a0d4",
    textPrimary: "#ede4f0",
    textSecondary: "#a898b0",
    heartColor: "#b889c4",
    headingFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Nunito Sans', system-ui, sans-serif",
  },
  {
    id: "soft-peach",
    name: "Soft Peach",
    bg: "#fef5ed",
    cardBg: "#fffbf8",
    cardBorder: "rgba(235, 180, 150, 0.25)",
    accent: "#e8a87c",
    textPrimary: "#4a3630",
    textSecondary: "#9a7a70",
    heartColor: "#f0b89a",
    headingFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Nunito Sans', system-ui, sans-serif",
  },
  {
    id: "classic-white",
    name: "Classic White",
    bg: "#f8f8f8",
    cardBg: "#ffffff",
    cardBorder: "rgba(0, 0, 0, 0.08)",
    accent: "#b088a0",
    textPrimary: "#2c2c2c",
    textSecondary: "#888888",
    heartColor: "#c8a0b8",
    headingFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Nunito Sans', system-ui, sans-serif",
  },
];

export type OurMemoriesData = {
  heroGif: string;
  heroHeading: string;
  heroSubtext: string;
  introText: string;
  memories: Memory[];
  separators: string[];
  quote: string;
  promises: { id: string; text: string }[];
  finalMessage: string;
  endingImage: string;
  signature: string;
  themeId: string;
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function encodeData(data: OurMemoriesData): string {
  try {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  } catch {
    return "";
  }
}

export function decodeData(hash: string): OurMemoriesData | null {
  try {
    const json = decodeURIComponent(atob(hash));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getTheme(id: string): ThemePreset {
  return THEME_PRESETS.find((t) => t.id === id) || THEME_PRESETS[0];
}

export const DEFAULT_SEPARATORS = [
  "Some memories don't fade. They glow.",
  "Not every moment becomes a memory. But these did.",
  "Some feelings have no words. That's why we keep them close.",
  "A heart keeps what matters most.",
];
