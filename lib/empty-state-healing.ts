export const THEME_GRADIENTS: Record<string, { gradient: string; emoji: string }[]> = {
  "Dark Romantic": [
    { gradient: "linear-gradient(135deg, #2d1b36, #4a2d52, #1a0a1e)", emoji: "💜" },
    { gradient: "linear-gradient(135deg, #4a2d52, #ff6b9d33, #2d1b36)", emoji: "🌸" },
    { gradient: "linear-gradient(135deg, #1a0a1e, #c44dff22, #2d1b36)", emoji: "✨" },
  ],
  "Soft Pastel": [
    { gradient: "linear-gradient(135deg, #fce4ec, #f8bbd0, #e1bee7)", emoji: "🌸" },
    { gradient: "linear-gradient(135deg, #e1bee7, #b39ddb, #ce93d8)", emoji: "💫" },
    { gradient: "linear-gradient(135deg, #f8bbd0, #fce4ec, #ffcdd2)", emoji: "💗" },
  ],
  "Minimal Black": [
    { gradient: "linear-gradient(135deg, #1a1a1a, #333333, #000000)", emoji: "⬛" },
    { gradient: "linear-gradient(135deg, #000000, #1a1a1a, #333333)", emoji: "🌑" },
    { gradient: "linear-gradient(135deg, #333333, #555555, #1a1a1a)", emoji: "⚪" },
  ],
  "Cute Pink": [
    { gradient: "linear-gradient(135deg, #ffb3c6, #ff8fab, #fb6f92)", emoji: "💖" },
    { gradient: "linear-gradient(135deg, #ffc8dd, #ffd1dc, #ffb3c6)", emoji: "🎀" },
    { gradient: "linear-gradient(135deg, #fb6f92, #ff8fab, #ffb3c6)", emoji: "💕" },
  ],
  "Neon Glitch": [
    { gradient: "linear-gradient(135deg, #0a0a0a, #ff00ff22, #00ffff22)", emoji: "💜" },
    { gradient: "linear-gradient(135deg, #0a0a0a, #00ffff22, #ff00ff22)", emoji: "💚" },
    { gradient: "linear-gradient(135deg, #1a1a2e, #ff006622, #ff00ff22)", emoji: "🔥" },
  ],
  "Cinematic Purple": [
    { gradient: "linear-gradient(135deg, #0d0221, #150534, #2d0a52)", emoji: "🌌" },
    { gradient: "linear-gradient(135deg, #150534, #2d0a52, #7b2d8e33)", emoji: "⭐" },
    { gradient: "linear-gradient(135deg, #2d0a52, #7b2d8e33, #b84dff22)", emoji: "💫" },
  ],
  "Clean White": [
    { gradient: "linear-gradient(135deg, #f5f5f5, #e0e0e0, #ffffff)", emoji: "🤍" },
    { gradient: "linear-gradient(135deg, #e0e0e0, #cccccc, #f5f5f5)", emoji: "🕊️" },
    { gradient: "linear-gradient(135deg, #ffffff, #f0f0f0, #e0e0e0)", emoji: "✨" },
  ],
};

const DEFAULT_GRADIENTS = [
  { gradient: "linear-gradient(135deg, #667eea, #764ba2)", emoji: "✨" },
  { gradient: "linear-gradient(135deg, #f093fb, #f5576c)", emoji: "💫" },
  { gradient: "linear-gradient(135deg, #4facfe, #00f2fe)", emoji: "🌟" },
];

export function getPlaceholderForIndex(theme: string, index: number): { gradient: string; emoji: string } {
  const palettes = THEME_GRADIENTS[theme] || DEFAULT_GRADIENTS;
  return palettes[index % palettes.length];
}
