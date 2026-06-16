"use client";

import type { Tone } from "@/lib/types";

const TONE_SOUND: Record<Tone, { tap: string; ding: string; whoosh: string }> = {
  Romantic: { tap: "WarmTap", ding: "WarmDing", whoosh: "WarmWhoosh" },
  Funny: { tap: "BrightTap", ding: "BrightDing", whoosh: "BrightWhoosh" },
  Sorry: { tap: "SoftTap", ding: "SoftDing", whoosh: "SoftWhoosh" },
  Savage: { tap: "SharpTap", ding: "SharpDing", whoosh: "SharpWhoosh" },
  Emotional: { tap: "WarmTap", ding: "WarmDing", whoosh: "WarmWhoosh" },
  Mystery: { tap: "SharpTap", ding: "SharpDing", whoosh: "SharpWhoosh" },
  Birthday: { tap: "BrightTap", ding: "BrightDing", whoosh: "BrightWhoosh" },
  Friendship: { tap: "BrightTap", ding: "BrightDing", whoosh: "BrightWhoosh" },
};

export function playSound(sound: "click" | "whoosh" | "ding" | "glitch" | "error") {
  if (typeof window === "undefined") return;
  const pref = localStorage.getItem("craft-message-sound");
  if (pref === "off") return;

  import("@/lib/sounds").then((m) => {
    switch (sound) {
      case "click": m.playClick(); break;
      case "whoosh": m.playWhoosh(); break;
      case "ding": m.playDing(); break;
      case "glitch": m.playGlitch(); break;
      case "error": m.playError(); break;
    }
  }).catch(() => {});
}

export function playToneSound(action: "tap" | "ding" | "whoosh", tone: Tone) {
  if (typeof window === "undefined") return;
  const pref = localStorage.getItem("craft-message-sound");
  if (pref === "off") return;

  const fn = TONE_SOUND[tone]?.[action] || (action === "tap" ? "WarmTap" : action === "ding" ? "WarmDing" : "WarmWhoosh");
  import("@/lib/sounds").then((m) => {
    const method = (m as Record<string, () => void>)[`play${fn}`];
    if (method) method();
  }).catch(() => {});
}

export function initSoundPref() {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("craft-message-sound");
  if (stored === null) {
    localStorage.setItem("craft-message-sound", "on");
    return true;
  }
  return stored === "on";
}

export function setSoundPref(enabled: boolean) {
  localStorage.setItem("craft-message-sound", enabled ? "on" : "off");
}
