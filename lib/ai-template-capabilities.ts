import type { Tone, ThemeName } from "@/lib/types";

export type UseCase =
  | "confession"
  | "apology"
  | "birthday"
  | "anniversary"
  | "proposal"
  | "friendship"
  | "secret-message"
  | "surprise-reveal"
  | "custom";

export type Emotion =
  | "romantic"
  | "funny"
  | "emotional"
  | "dramatic"
  | "cute"
  | "mysterious"
  | "premium"
  | "savage"
  | "playful"
  | "nostalgic";

export type TemplateCapability = {
  id: string;
  name: string;
  emotions: Emotion[];
  useCases: UseCase[];
  supportsPhotos: boolean;
  supportsPassword: boolean;
  editableFields: string[];
  optionalAddOns: string[];
  tone: string;
  theme: ThemeName;
  description: string;
};

export const templateCapabilities: TemplateCapability[] = [
  {
    id: "the-final-button",
    name: "Moving Button",
    emotions: ["romantic", "emotional", "playful"],
    useCases: ["confession", "secret-message", "surprise-reveal"],
    supportsPhotos: false,
    supportsPassword: false,
    editableFields: ["finalMessage", "creatorName", "receiverName", "landingText", "buttonText"],
    optionalAddOns: ["password-gate", "photo-gallery"],
    tone: "Emotional",
    theme: "Dark Romantic",
    description: "The button runs away — they must chase and catch it to read your message."
  },
  {
    id: "memory-maze",
    name: "Heart Vault",
    emotions: ["romantic", "emotional", "nostalgic", "premium"],
    useCases: ["confession", "anniversary", "friendship", "proposal", "surprise-reveal"],
    supportsPhotos: true,
    supportsPassword: true,
    editableFields: ["photos", "password", "passwordQuestion", "startDate", "startTime", "finalMessage", "creatorName", "receiverName"],
    optionalAddOns: [],
    tone: "Emotional",
    theme: "Dark Romantic",
    description: "A beating heart reveals a password gate into a memory world with photos and a final love note."
  },
  {
    id: "birthday-surprise-journey",
    name: "Blow Out the Candles",
    emotions: ["cute", "playful", "emotional"],
    useCases: ["birthday", "surprise-reveal"],
    supportsPhotos: true,
    supportsPassword: false,
    editableFields: ["photos", "finalMessage", "creatorName", "receiverName"],
    optionalAddOns: ["password-gate"],
    tone: "Birthday",
    theme: "Cute Pink",
    description: "Blow out candles one by one — the message appears in icing on the cake."
  },
  {
    id: "love-chase",
    name: "Catch My Heart",
    emotions: ["romantic", "playful", "cute"],
    useCases: ["confession", "surprise-reveal", "secret-message"],
    supportsPhotos: false,
    supportsPassword: false,
    editableFields: ["finalMessage", "creatorName", "receiverName"],
    optionalAddOns: ["password-gate", "photo-gallery"],
    tone: "Romantic",
    theme: "Cute Pink",
    description: "Two buttons — one says the truth, the other runs. Catch the real message."
  },
  {
    id: "kitty-apology",
    name: "Kitty Apology",
    emotions: ["cute", "emotional", "playful"],
    useCases: ["apology"],
    supportsPhotos: false,
    supportsPassword: false,
    editableFields: ["finalMessage", "creatorName", "receiverName"],
    optionalAddOns: ["password-gate"],
    tone: "Sorry",
    theme: "Cute Pink",
    description: "A cute kitty does funny actions then reveals an apology letter."
  },
  {
    id: "come-closer",
    name: "Come Closer Prank",
    emotions: ["funny", "playful", "savage"],
    useCases: ["friendship", "custom"],
    supportsPhotos: false,
    supportsPassword: false,
    editableFields: ["finalMessage", "creatorName", "receiverName"],
    optionalAddOns: ["password-gate", "photo-gallery"],
    tone: "Funny",
    theme: "Minimal Black",
    description: "A dark room prank with 3-2-1 countdown and a flash reveal."
  },
  {
    id: "birthday-journey",
    name: "Birthday Journey",
    emotions: ["emotional", "cute", "nostalgic"],
    useCases: ["birthday"],
    supportsPhotos: false,
    supportsPassword: false,
    editableFields: ["finalMessage", "creatorName", "receiverName"],
    optionalAddOns: ["password-gate", "photo-gallery"],
    tone: "Birthday",
    theme: "Cute Pink",
    description: "Step into a dark room, pop balloons, blow out candles — a birthday message awaits."
  },
  {
    id: "escape-me",
    name: "Escape Me",
    emotions: ["mysterious", "dramatic", "romantic"],
    useCases: ["confession", "secret-message", "surprise-reveal"],
    supportsPhotos: false,
    supportsPassword: false,
    editableFields: ["finalMessage", "creatorName", "receiverName"],
    optionalAddOns: ["password-gate", "photo-gallery"],
    tone: "Mystery",
    theme: "Dark Romantic",
    description: "A heart of arrow pieces — tap to clear each one and unlock the message inside."
  },
  {
    id: "sorry-maze",
    name: "Sorry Maze",
    emotions: ["funny", "playful"],
    useCases: ["apology", "friendship", "custom"],
    supportsPhotos: false,
    supportsPassword: false,
    editableFields: ["finalMessage", "creatorName", "receiverName"],
    optionalAddOns: ["password-gate"],
    tone: "Funny",
    theme: "Cinematic Purple",
    description: "Navigate a glowing maze to find your way back and unlock a heartfelt message."
  },
  {
    id: "our-memories",
    name: "Our Memories",
    emotions: ["romantic", "emotional", "nostalgic", "premium"],
    useCases: ["anniversary", "confession", "friendship", "proposal"],
    supportsPhotos: true,
    supportsPassword: false,
    editableFields: ["photos", "steps", "finalMessage", "creatorName", "receiverName"],
    optionalAddOns: ["password-gate"],
    tone: "Romantic",
    theme: "Soft Pastel",
    description: "An interactive scrapbook where you share memories, add photos, and create a lasting keepsake."
  },
  {
    id: "love-contract",
    name: "Love Contract",
    emotions: ["romantic", "funny", "premium"],
    useCases: ["anniversary", "proposal", "friendship", "custom"],
    supportsPhotos: true,
    supportsPassword: false,
    editableFields: ["photos", "finalMessage", "creatorName", "receiverName"],
    optionalAddOns: ["password-gate"],
    tone: "Romantic",
    theme: "Dark Romantic",
    description: "A relationship contract with funny rules, promises, penalties, and signed certificates."
  },
];

export function getCapability(templateId: string): TemplateCapability | undefined {
  return templateCapabilities.find((c) => c.id === templateId);
}

export function findBestTemplate(useCase: UseCase, emotion: Emotion, needsPhotos: boolean, needsPassword: boolean): TemplateCapability[] {
  const scored = templateCapabilities.map((cap) => {
    let score = 0;
    if (cap.useCases.includes(useCase)) score += 3;
    if (cap.emotions.includes(emotion)) score += 2;
    if (needsPhotos && cap.supportsPhotos) score += 2;
    if (needsPassword && cap.supportsPassword) score += 2;
    return { cap, score };
  });
  return scored.sort((a, b) => b.score - a.score).map((s) => s.cap);
}