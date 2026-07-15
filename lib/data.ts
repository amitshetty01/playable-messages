import type { Category, Template, ThemeName, Tone } from "@/lib/types";

export const tones: Tone[] = ["Romantic", "Funny", "Sorry", "Savage", "Emotional", "Mystery", "Birthday", "Friendship"];

export const themes: ThemeName[] = [
  "Dark Romantic",
  "Soft Pastel",
  "Minimal Black",
  "Cute Pink",
  "Neon Glitch",
  "Cinematic Purple",
  "Clean White"
];

export const categories: Category[] = [
  {
    slug: "love-crush",
    name: "Love & Crush",
    icon: "LC",
    accent: "#e85a7a",
    description: "For romantic, crush, confession, missing someone, or relationship messages."
  },
  {
    slug: "apology-fight-repair",
    name: "Apology & Fight Repair",
    icon: "AF",
    accent: "#8c5a7c",
        description: "For saying sorry, fixing mood, calming anger, or restarting a conversation."
  },
  {
    slug: "friendship-best-friend",
    name: "Friendship & Best Friend",
    icon: "BF",
    accent: "#d4a080",
        description: "For best friends, inside jokes, teasing, appreciation, emotional friendship messages, and funny moments."
  },
  {
    slug: "birthday-special-days",
    name: "Birthday & Special Days",
    icon: "BD",
    accent: "#d4b060",
        description: "For birthdays, anniversaries, congratulations, achievements, and special memories."
  },
  {
    slug: "funny-roast",
    name: "Funny & Roast",
    icon: "FR",
    accent: "#e0706a",
        description: "For playful roasts, attitude jokes, dramatic reactions, and shareable fun."
  }
];

export const templates: Template[] = [
  {
    id: "the-final-button",
    slug: "moving-button",
    title: "Moving Button",
    hook: "Catch the button if you can.",
    categorySlugs: ["love-crush"],
    bestFor: "love, crush, mystery, playful dares",
    length: "1 minute",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Chase the button", "Catch the words", "Final reveal"],
    description: "Write a short secret message. The button runs away — they have to catch it to read what you said."
  },
  {
    id: "memory-maze",
    slug: "memory-maze",
    title: "Heart Vault",
    hook: "Touch the beating heart. Speak the password. Enter a world of memories.",
    categorySlugs: ["friendship-best-friend"],
    bestFor: "friendship, memories, nostalgia",
    length: "2 minutes",
    tone: "Emotional",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Touch the heart", "Knock knock", "Enter the password", "Blackout", "Memory world", "Final words"],
    description: "A beating heart waits to be touched. Once you knock, a password screen appears — prove who you are to unlock a world of memories with photos, messages, and a final love note."
  },
  {
    id: "birthday-surprise-journey",
    slug: "birthday-surprise-journey",
    title: "Blow Out the Candles",
    hook: "Blow out each candle. The message appears in icing.",
    categorySlugs: ["birthday-special-days", "friendship-best-friend"],
    bestFor: "birthday, celebration, surprise",
    length: "2 minutes",
    tone: "Birthday",
    theme: "Cute Pink",
    status: "full",
    formula: ["Candle 1", "Candle 2", "Candle 3", "Candle 4", "Message in icing"],
    description: "Click or hold to blow out candles on a cake one by one, and the message appears in icing once the last one's out."
  },
  {
    id: "love-chase",
    slug: "love-chase",
    title: "Catch My Heart",
    hook: "Two buttons. One truth. The other runs forever.",
    categorySlugs: ["love-crush"],
    bestFor: "love confessions, crushes, romantic dares",
    length: "1 minute",
    tone: "Romantic",
    theme: "Cute Pink",
    status: "full",
    formula: ["Love chase", "Truth or dodge", "Final reveal"],
    description: "Two buttons appear. One says 'You love me'. The other runs away forever. Catch the truth."
  },
  {
    id: "kitty-apology",
    slug: "kitty-apology",
    title: "Kitty Apology",
    hook: "A tiny kitty brought a letter. Please don't be mad…",
    categorySlugs: ["apology-fight-repair"],
    bestFor: "apologies, fight repair, making amends, cute sorry",
    length: "30 seconds",
    tone: "Sorry",
    theme: "Cute Pink",
    status: "full",
    formula: ["Kitty enters", "Cute comedy", "Letter appears", "Adorable sorry"],
    description: "A cute kitty appears, does funny little actions, then reveals an apology letter in the most adorable way possible."
  },
  {
    id: "come-closer",
    slug: "come-closer",
    title: "Come Closer Prank",
    hook: "i want to show u something only see it if u are alone and in a dark room",
    categorySlugs: ["funny-roast", "friendship-best-friend"],
    bestFor: "funny pranks, teasing, playful roasts, meme-worthy moments",
    length: "15 seconds",
    tone: "Funny",
    theme: "Minimal Black",
    status: "full",
    formula: ["Dark room setup", "Countdown 3-2-1", "BOOM flash", "Prank reveal"],
    description: "Tricks them into going to a dark room, then a sudden 3-2-1 countdown leads to a full-screen brightness blast and a hilarious reveal."
  },
  {
    id: "birthday-journey",
    slug: "birthday-journey",
    title: "Birthday Journey",
    hook: "A dark room. Balloons rise. A candle-lit cake waits.",
    categorySlugs: ["birthday-special-days"],
    bestFor: "birthday wishes, celebrations",
    length: "45 seconds",
    tone: "Birthday",
    theme: "Cute Pink",
    status: "full",
    formula: ["Dark room", "Balloons", "Blow candles", "Message revealed"],
    description: "Step into a dark room. Pop balloons. Blow out the candles A birthday message awaits in the light."
  },
  {
    id: "escape-me",
    slug: "escape-me",
    title: "Escape Me",
    hook: "Tap the arrows. Clear the heart Unlock what's hidden inside.",
    categorySlugs: ["love-crush", "funny-roast"],
    bestFor: "mystery, funny, suspense, hidden messages, puzzles",
    length: "30 seconds",
    tone: "Mystery",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Heart of arrows", "Tap to remove", "Clear the path", "Message revealed"],
    description: "A heart made of arrow pieces Tap each arrow in the right order to clear the walls and unlock a hidden personal message inside."
  },
  {
    id: "sorry-maze",
    slug: "sorry-maze",
    title: "Sorry Maze",
    hook: "Find your way back through the maze",
    categorySlugs: ["funny-roast"],
    bestFor: "funny apologies, playful mazes, emotional puzzles",
    length: "30 seconds",
    tone: "Funny",
    theme: "Cinematic Purple",
    status: "full",
    formula: ["Enter maze", "Navigate walls", "Collect gems", "Reach the heart"],
    description: "Navigate a glowing maze to find your way back. Collect gems, avoid dead ends, and unlock a heartfelt message at the center."
  },
  {
    id: "our-memories",
    slug: "our-memories",
    title: "Our Memories",
    hook: "A beautiful scrapbook of your favorite memories together.",
    categorySlugs: ["friendship-best-friend", "love-crush"],
    bestFor: "love, memories, anniversaries, couples",
    length: "2 minutes",
    tone: "Romantic",
    theme: "Soft Pastel",
    status: "full",
    formula: ["Share your first memory", "Recall the little moments", "Make promises", "End with a heartfelt message"],
    description: "A beautiful interactive scrapbook where you can share your favorite memories, make promises, and create a lasting keepsake for someone special."
  },
  {
    id: "love-contract",
    slug: "love-contract",
    title: "Love Contract",
    hook: "A funny + emotional relationship contract with promises, rules, penalties, and signatures.",
    categorySlugs: ["love-crush", "funny-roast"],
    bestFor: "couples, anniversaries, proposals, funny relationship goals",
    length: "5 minutes",
    tone: "Romantic",
    theme: "Dark Romantic",
    status: "full",
    formula: ["Parchment opening", "Partner details", "Funny rules", "Heartfelt promises", "Penalties clause", "Secret wax seal", "Signatures", "Certificate"],
    description: "An interactive relationship contract between two partners with funny rules, heartfelt promises, playful penalties, a secret wax seal clause, and a beautiful signed certificate."
  },
];

const templateRouteAliases: Record<string, string> = {};

export type Mood = {
  slug: string;
  name: string;
  emoji: string;
  tones: Tone[];
  categorySlugs: string[];
  description: string;
};

export const moods: Mood[] = [
  { slug: "love", name: "Love", emoji: "💖", tones: ["Romantic"], categorySlugs: ["love-crush"], description: "Romantic, crush, confession, missing someone, or relationship messages." },
  { slug: "sorry", name: "Sorry", emoji: "💔", tones: ["Sorry"], categorySlugs: ["apology-fight-repair"], description: "For saying sorry, fixing mood, calming anger, or restarting a conversation." },
  { slug: "funny", name: "Funny", emoji: "😂", tones: ["Funny"], categorySlugs: ["funny-roast"], description: "For playful roasts, attitude jokes, dramatic reactions, and shareable fun." },
  { slug: "birthday", name: "Birthday", emoji: "🎂", tones: ["Birthday"], categorySlugs: ["birthday-special-days"], description: "For birthdays, anniversaries, congratulations, achievements, and special memories." },
  { slug: "roast", name: "Roast", emoji: "🏆", tones: ["Savage"], categorySlugs: ["funny-roast"], description: "For playful roasts, attitude jokes, and savage comebacks." },
  { slug: "memory", name: "Memory", emoji: "💓", tones: ["Emotional", "Friendship"], categorySlugs: ["friendship-best-friend"], description: "For best friends, inside jokes, emotional friendship messages, and appreciation." },
  { slug: "mystery", name: "Mystery", emoji: "🔥", tones: ["Mystery"], categorySlugs: ["love-crush", "friendship-best-friend"], description: "For suspenseful reveals, hidden messages, emotional secrets, and dramatic storytelling." },
];

export function getMood(slug: string) {
  return moods.find((m) => m.slug === slug);
}

export function getTemplatesByMood(moodSlug: string) {
  const mood = getMood(moodSlug);
  if (!mood) return [];
  const result = templates.filter(
    (t) => t.status === "full" && (mood.tones.includes(t.tone) || t.categorySlugs.some((cs) => mood.categorySlugs.includes(cs)))
  );
  result.sort((a, b) => {
    if (a.id === "our-memories") return -1;
    if (b.id === "our-memories") return 1;
    return a.title.localeCompare(b.title);
  });
  return result;
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getTemplate(idOrSlug: string) {
  const normalized = templateRouteAliases[idOrSlug] || idOrSlug;
  return templates.find((template) => template.id === normalized || template.slug === normalized);
}

export function getTemplateSeoSlug(template: Template) {
  return template.id === "the-secret-room" ? "secret-room" : template.slug;
}

export function getTemplatesByCategory(slug: string) {
  return templates.filter((template) => template.categorySlugs.includes(slug));
}

export function getTemplateCategory(template: Template) {
  return categories.find((category) => template.categorySlugs.includes(category.slug)) ?? categories[0];
}

export function getAllTemplates(): Template[] {
  return templates;
}

export const defaultCustomMessages = {
  landingText: "There is one button I made for you to press.",
  buttonText: "Start the reveal",
  steps: [
    "I made this because a normal text felt too easy to ignore.",
    "I don't always know how to say this directly.",
    "But this moment deserves better than a plain message.",
    "Some things are better said than typed.",
    "And some feelings need more than words.",
    "This is my way of making sure you know."
  ],
  ctaMessage: "Create your own interactive message."
};

export const defaultFinalMessage = "Here is the real message: you matter more than I usually know how to say.";
