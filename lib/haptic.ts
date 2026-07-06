"use client";

import type { Tone } from "@/lib/types";

const TONE_HAPTIC: Record<Tone, { tap: number[]; ding: number[]; whoosh: number[] }> = {
  Romantic: { tap: [8], ding: [12, 30, 12], whoosh: [6, 20, 6] },
  Funny: { tap: [6, 10, 6], ding: [10, 20, 15], whoosh: [8, 15, 8] },
  Sorry: { tap: [6], ding: [8, 25, 8], whoosh: [4, 15, 4] },
  Savage: { tap: [12], ding: [15, 40, 15], whoosh: [10, 25, 10] },
  Emotional: { tap: [8], ding: [12, 30, 12], whoosh: [6, 20, 6] },
  Mystery: { tap: [10], ding: [15, 35, 15], whoosh: [8, 22, 8] },
  Birthday: { tap: [6, 8, 6], ding: [10, 20, 10, 20, 10], whoosh: [8, 15, 8] },
  Friendship: { tap: [6, 10, 6], ding: [10, 20, 15], whoosh: [8, 15, 8] },
};

export function haptic(pattern: "tap" | "success" | "error" | "emphasis") {
  if (typeof navigator === "undefined") return;
  const patterns: Record<string, number[]> = {
    tap: [10],
    success: [20, 50, 20],
    error: [40, 80, 40],
    emphasis: [10, 30, 10, 30, 10]
  };
  if (navigator.vibrate) {
    navigator.vibrate(patterns[pattern] ?? [10]);
  }
}

export function hapticTone(action: "tap" | "ding" | "whoosh", tone: Tone) {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  const pattern = TONE_HAPTIC[tone]?.[action] || [10];
  navigator.vibrate(pattern);
}
