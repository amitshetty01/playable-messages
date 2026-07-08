"use client";

import type { Tone } from "@/lib/types";
import { playClick, playWhoosh, playDing, playGlitch, playError, playWarmTap, playWarmDing, playWarmWhoosh, playBrightTap, playBrightDing, playBrightWhoosh, playSharpTap, playSharpDing, playSharpWhoosh, playSoftTap, playSoftDing, playSoftWhoosh } from "@/lib/sounds";

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

const SOUND_FN: Record<string, () => void> = {
  click: playClick,
  whoosh: playWhoosh,
  ding: playDing,
  glitch: playGlitch,
  error: playError,
  WarmTap: playWarmTap,
  WarmDing: playWarmDing,
  WarmWhoosh: playWarmWhoosh,
  BrightTap: playBrightTap,
  BrightDing: playBrightDing,
  BrightWhoosh: playBrightWhoosh,
  SharpTap: playSharpTap,
  SharpDing: playSharpDing,
  SharpWhoosh: playSharpWhoosh,
  SoftTap: playSoftTap,
  SoftDing: playSoftDing,
  SoftWhoosh: playSoftWhoosh,
};

export function playSound(sound: "click" | "whoosh" | "ding" | "glitch" | "error") {
  if (typeof window === "undefined") return;
  const pref = localStorage.getItem("craft-message-sound");
  if (pref === "off") return;
  SOUND_FN[sound]?.();
}

export function playToneSound(action: "tap" | "ding" | "whoosh", tone: Tone) {
  if (typeof window === "undefined") return;
  const pref = localStorage.getItem("craft-message-sound");
  if (pref === "off") return;

  const fn = TONE_SOUND[tone]?.[action] || (action === "tap" ? "WarmTap" : action === "ding" ? "WarmDing" : "WarmWhoosh");
  SOUND_FN[fn]?.();
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
  if (typeof window === "undefined") return;
  try { localStorage.setItem("craft-message-sound", enabled ? "on" : "off"); } catch { /* storage unavailable */ }
}
