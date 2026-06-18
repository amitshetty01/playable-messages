export type GameConfig = {
  icon: string;
  gradient: string;
  opener: string;
  gameHint: string;
  anonFallback: string;
  reactionEmojis: string[];
  bgClass: string;
};

function g(...stops: string[]) {
  return `linear-gradient(145deg, ${stops.join(", ")})`;
}

export const GAME_CONFIGS: Record<string, GameConfig> = {
  "love-crush": {
    icon: "💖",
    gradient: g("#2d0a1e", "#1f0a2e", "#0d0615"),
    opener: "Scratch to reveal what they said 💌",
    gameHint: "Drag your finger across the card",
    anonFallback: "— from someone who clearly means it",
    reactionEmojis: ["❤️", "🥹", "😍", "🥲"],
    bgClass: "shadow-[inset_0_0_120px_rgba(255,95,183,0.12)]",
  },
  "apology-fight-repair": {
    icon: "🤝",
    gradient: g("#1a1035", "#0f0a20", "#080415"),
    opener: "Help put this back together",
    gameHint: "Drag each piece into place",
    anonFallback: "— from someone who wants to make it right",
    reactionEmojis: ["🥺", "💔", "🤝", "❤️‍🩹"],
    bgClass: "shadow-[inset_0_0_120px_rgba(124,92,255,0.12)]",
  },
  "funny-roast": {
    icon: "😂",
    gradient: g("#2a1a05", "#1f1508", "#0f0a04"),
    opener: "Pull the lever and see what hits 😏",
    gameHint: "Pull to spin the slots",
    anonFallback: "— from someone with terrible humor",
    reactionEmojis: ["😂", "🤣", "💀", "😆"],
    bgClass: "shadow-[inset_0_0_120px_rgba(255,107,138,0.12)]",
  },
  "birthday-special-days": {
    icon: "🎂",
    gradient: g("#2a1f08", "#1f1708", "#0f0a04"),
    opener: "Time to cut the cake! 🎉",
    gameHint: "Drag the knife across the cake",
    anonFallback: "— from someone who's celebrating you",
    reactionEmojis: ["🎉", "🥳", "🎂", "❤️"],
    bgClass: "shadow-[inset_0_0_120px_rgba(255,209,102,0.12)]",
  },
  "mystery-confession": {
    icon: "🔮",
    gradient: g("#0f0a25", "#080415", "#03020a"),
    opener: "Shine a light on what's hidden...",
    gameHint: "Drag to move the flashlight",
    anonFallback: "— from someone who needed to say this",
    reactionEmojis: ["😳", "🤫", "😱", "👀"],
    bgClass: "shadow-[inset_0_0_120px_rgba(160,112,255,0.12)]",
  },
};

export const GAME_SLUG_BY_TEMPLATE: Record<string, string> = {
  "love-beats": "love-crush",
  "sorry-puzzle": "apology-fight-repair",
  "funny-slots": "funny-roast",
  "secret-decoder": "mystery-confession",
  "birthday-cake": "birthday-special-days",
  "roast-wheel": "funny-roast",
  "memory-flip": "love-crush",
  "mystery-fog": "mystery-confession",
};

export function getGameConfig(templateId: string, tone: string): GameConfig {
  const byTemplate = GAME_SLUG_BY_TEMPLATE[templateId];
  if (byTemplate && GAME_CONFIGS[byTemplate]) return GAME_CONFIGS[byTemplate];
  const toneMap: Record<string, string> = {
    Romantic: "love-crush", Funny: "funny-roast", Sorry: "apology-fight-repair",
    Savage: "funny-roast", Emotional: "love-crush", Mystery: "mystery-confession",
    Birthday: "birthday-special-days", Friendship: "funny-roast",
  };
  const key = toneMap[tone] || "love-crush";
  return GAME_CONFIGS[key] || GAME_CONFIGS["love-crush"];
}
