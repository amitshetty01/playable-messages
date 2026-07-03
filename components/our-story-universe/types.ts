"use client"

export type StoryWorld =
  | "Classic Romance" | "Dark Fantasy" | "Manga" | "Comedy" | "Royal Kingdom"
  | "Sci-Fi" | "Cyberpunk" | "Horror" | "Mystery" | "Pirate Adventure"
  | "Slice of Life" | "Time Travel"

export type StoryTone =
  | "Romantic" | "Emotional" | "Funny" | "Mysterious"
  | "Dramatic" | "Cute" | "Dark comedy"

export type AppStep = "splash" | "onboarding" | "storybook" | "completion"

export interface StoryData {
  userName: string
  partnerName: string
  userPhoto: string | null
  partnerPhoto: string | null
  storyWorld: StoryWorld
  tone: StoryTone
  favoriteMemory: string
  habits: string
  promise: string
  finalMessage: string
  musicOn: boolean
  animationIntensity: "high" | "low"
}

export interface GeneratedChapter {
  chapter: string
  title: string
  text: string
  scene: string
  atmosphere: string[]
  illustration: string
  interactive?: {
    type: "tap-moon" | "tap-flower" | "tap-window" | "tap-heart" | "scratch" | "hold-photo" | "double-tap"
    label: string
    message: string
  }
}

export const DEFAULT_STORY: StoryData = {
  userName: "",
  partnerName: "",
  userPhoto: null,
  partnerPhoto: null,
  storyWorld: "Classic Romance",
  tone: "Romantic",
  favoriteMemory: "",
  habits: "",
  promise: "",
  finalMessage: "",
  musicOn: true,
  animationIntensity: "high",
}

export const STORY_WORLDS: StoryWorld[] = [
  "Classic Romance", "Dark Fantasy", "Manga", "Comedy", "Royal Kingdom",
  "Sci-Fi", "Cyberpunk", "Horror", "Mystery", "Pirate Adventure",
  "Slice of Life", "Time Travel",
]

export const STORY_TONES: StoryTone[] = [
  "Romantic", "Emotional", "Funny", "Mysterious",
  "Dramatic", "Cute", "Dark comedy",
]

export const WORLD_VISUALS: Record<string, {
  gradient: string; glow: string; scene: string; emoji: string;
  musicNote: string; palette: string[]
}> = {
  "Classic Romance": {
    gradient: "from-rose-900/60 via-pink-800/40 to-purple-900/60",
    glow: "rgba(255,107,138,0.3)",
    scene: "A soft sunset over distant hills, cherry blossoms floating in warm light",
    emoji: "\uD83C\uDF39",
    musicNote: "\u266A romantic strings",
    palette: ["#ff6b8a", "#ffb6c1", "#ffd700", "#8b0000"],
  },
  "Dark Fantasy": {
    gradient: "from-slate-900/80 via-purple-950/60 to-red-950/60",
    glow: "rgba(139,0,0,0.4)",
    scene: "A misty forest under a blood moon, ancient ruins glowing with violet light",
    emoji: "\uD83D\uDDE1\uFE0F",
    musicNote: "\u266A dark orchestral",
    palette: ["#8b0000", "#4a0e4e", "#ff4500", "#1a1a2e"],
  },
  Comedy: {
    gradient: "from-yellow-800/50 via-orange-800/40 to-rose-800/40",
    glow: "rgba(255,140,0,0.3)",
    scene: "A colorful carnival at golden hour, confetti dancing in the breeze",
    emoji: "\uD83D\uDE02",
    musicNote: "\u266A upbeat whimsical",
    palette: ["#ff8c00", "#ffd700", "#00ff7f", "#ff69b4"],
  },
  Manga: {
    gradient: "from-rose-900/50 via-sky-900/40 to-purple-900/50",
    glow: "rgba(255,105,180,0.3)",
    scene: "A sakura-lined school path at twilight, stars beginning to peek through",
    emoji: "\uD83D\uDCD6",
    musicNote: "\u266A anime piano",
    palette: ["#ff69b4", "#87ceeb", "#ffffff", "#ffd700"],
  },
  "Slice of Life": {
    gradient: "from-emerald-900/50 via-teal-800/40 to-sky-900/40",
    glow: "rgba(152,251,152,0.3)",
    scene: "A sunlit caf\u00E9 terrace, steam rising from coffee cups, gentle morning light",
    emoji: "\u2615",
    musicNote: "\u266A acoustic guitar",
    palette: ["#98fb98", "#87ceeb", "#ffd700", "#cd853f"],
  },
  "Royal Kingdom": {
    gradient: "from-amber-900/60 via-red-800/40 to-yellow-900/40",
    glow: "rgba(255,215,0,0.3)",
    scene: "A grand ballroom with crystal chandeliers, rose petals on marble floors",
    emoji: "\uD83D\uDC51",
    musicNote: "\u266A royal waltz",
    palette: ["#ffd700", "#8b0000", "#ffffff", "#4a0e4e"],
  },
  Cyberpunk: {
    gradient: "from-fuchsia-900/60 via-blue-900/50 to-cyan-900/50",
    glow: "rgba(255,0,255,0.3)",
    scene: "A neon-lit cityscape at midnight, holographic advertisements reflecting in rain",
    emoji: "\uD83D\uDCBB",
    musicNote: "\u266A synthwave",
    palette: ["#ff00ff", "#00ffff", "#ffff00", "#ff4500"],
  },
  "Sci-Fi": {
    gradient: "from-blue-900/60 via-indigo-800/50 to-cyan-900/50",
    glow: "rgba(0,191,255,0.3)",
    scene: "A breathtaking view of a nebula from a glass observatory, stars swirling endlessly",
    emoji: "\uD83D\uDE80",
    musicNote: "\u266A ambient electronic",
    palette: ["#00bfff", "#7b68ee", "#00ff00", "#ff69b4"],
  },
  Mystery: {
    gradient: "from-stone-900/60 via-slate-800/40 to-zinc-900/40",
    glow: "rgba(105,105,105,0.3)",
    scene: "A foggy London street at dusk, gas lamps casting long shadows",
    emoji: "\uD83D\uDD0D",
    musicNote: "\u266A mysterious noir",
    palette: ["#2f4f4f", "#696969", "#ffff00", "#8b4513"],
  },
  Horror: {
    gradient: "from-neutral-950/80 via-red-950/60 to-black",
    glow: "rgba(255,0,0,0.3)",
    scene: "An abandoned Victorian mansion under a full moon, mist creeping through broken windows",
    emoji: "\uD83D\uDC7B",
    musicNote: "\u266A dark ambient",
    palette: ["#ff0000", "#1a1a1a", "#ffffff", "#4a0e0e"],
  },
  "Pirate Adventure": {
    gradient: "from-amber-900/50 via-blue-900/50 to-emerald-900/40",
    glow: "rgba(139,69,19,0.3)",
    scene: "A wooden galleon sailing into a golden sunset, treasure map in hand",
    emoji: "\uD83C\uDFF4\u200D\u2620\uFE0F",
    musicNote: "\u266A sea shanty",
    palette: ["#8b4513", "#d2b48c", "#ffd700", "#2e8b57"],
  },
  "Time Travel": {
    gradient: "from-cyan-900/60 via-blue-800/50 to-violet-900/50",
    glow: "rgba(0,255,255,0.3)",
    scene: "A swirling vortex of clocks and memories, moments from every era colliding in a beautiful dance",
    emoji: "\u23F3",
    musicNote: "\u266A ethereal synth",
    palette: ["#00ffff", "#7b68ee", "#ff69b4", "#00ff88"],
  },
}

export const ATMOSPHERE_EFFECTS = [
  "stars", "petals", "fireflies", "moonlight", "hearts",
  "candle", "glow", "wind", "rain", "clouds",
  "birds", "sparkles", "fog", "embers", "bubbles",
] as const

export const TONE_ADJECTIVES: Record<string, string[]> = {
  Romantic: ["tender", "sweet", "passionate", "gentle", "radiant"],
  Emotional: ["profound", "moving", "heartfelt", "vulnerable", "raw"],
  Funny: ["hilarious", "whimsical", "playful", "charming", "delightful"],
  Mysterious: ["enigmatic", "fateful", "subtle", "intriguing", "shadowed"],
  Dramatic: ["intense", "powerful", "monumental", "fateful", "electric"],
  Cute: ["adorable", "charming", "lovely", "sweet", "cozy"],
  "Dark comedy": ["absurd", "ironic", "unexpected", "quirky", "bold"],
}
