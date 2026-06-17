import type { Tone } from "@/lib/types";

export type Pacing = "slow" | "normal" | "fast" | "build";

export function getPacing(tone: Tone): Pacing {
  switch (tone) {
    case "Romantic":
    case "Sorry":
    case "Emotional":
      return "slow";
    case "Funny":
    case "Savage":
    case "Birthday":
      return "fast";
    case "Mystery":
      return "build";
    case "Friendship":
      return "normal";
  }
}

export function getAnimationDuration(tone: Tone, base: number): number {
  const pacing = getPacing(tone);
  switch (pacing) {
    case "slow": return Math.round(base * 1.6);
    case "fast": return Math.round(base * 0.55);
    case "build": return Math.round(base * 1.3);
    case "normal": return base;
  }
}

export function getPacingLabel(tone: Tone): string {
  const pacing = getPacing(tone);
  switch (pacing) {
    case "slow": return "slow and breathing";
    case "fast": return "snappy and bright";
    case "build": return "building tension";
    case "normal": return "steady";
  }
}
