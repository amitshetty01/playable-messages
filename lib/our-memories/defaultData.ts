import type { OurMemoriesData } from "./types";
import { generateId } from "./types";

export const defaultData: OurMemoriesData = {
  heroGif: "",
  heroHeading: "Hey Cutie ❤️",
  heroSubtext:
    "Every moment with you feels like a dream I never want to wake up from. So I kept a few memories here, just for us. Scroll slowly\u2026 some feelings deserve time.",
  introText: "There are thousands of moments\u2026\nbut these are the ones my heart kept.",
  memories: [
    {
      id: generateId(),
      photo: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=800&fit=crop&auto=format",
      title: "The First Smile",
      caption: "Some smiles stay in your heart forever.",
    },
    {
      id: generateId(),
      photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop&auto=format",
      title: "The Little Moments",
      caption: "It was never about the place. It was always about you.",
    },
    {
      id: generateId(),
      photo: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&h=800&fit=crop&auto=format",
      title: "My Favorite Memory",
      caption: "If I could replay one feeling, it would be this.",
    },
  ],
  separators: [
    "Some memories don't fade. They glow.",
    "Not every moment becomes a memory. But these did.",
    "Some feelings have no words. That's why we keep them close.",
  ],
  quote: "Our best memories are not behind us.\nWe are still creating them.",
  promises: [
    { id: generateId(), text: "I promise to choose you even on ordinary days." },
    { id: generateId(), text: "I promise to make you smile when the world feels heavy." },
    { id: generateId(), text: "I promise to protect what we have." },
    { id: generateId(), text: "I promise to create more beautiful memories with you." },
    { id: generateId(), text: "I promise to stay\u2014not just in words, but in actions." },
  ],
  finalMessage:
    "Thank you for being part of my favorite memories. I don't just want to remember the past with you\u2026 I want to create every beautiful tomorrow with you.",
  endingImage: "",
  signature: "Forever yours \u2764\ufe0f",
  themeId: "romantic-cream",
};
