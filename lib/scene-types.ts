export type SceneBackgroundType =
  | "gradient"
  | "particles"
  | "stars"
  | "pulse-glow"
  | "room-dark"
  | "room-lit"
  | "stage"
  | "chat"
  | "cards"
  | "envelope"
  | "minimal"
  | "vignette";

export type ScenePropType =
  | "none"
  | "button"
  | "floating-card"
  | "envelope"
  | "balloon-group"
  | "cake"
  | "banner"
  | "box"
  | "photo-card"
  | "chat-bubble"
  | "seal"
  | "roast-card"
  | "emoji-face"
  | "sparkle"
  | "mirror"
  | "polaroid";

export type PropAnimation =
  | "float"
  | "shake"
  | "pulse"
  | "bounce"
  | "sway"
  | "reveal-up"
  | "reveal-scale"
  | "drift"
  | "tilt"
  | "none";

export type SceneChoice = {
  id: string;
  label: string;
  emoji?: string;
};

export type SceneInteraction = {
  type: "button" | "tap-anywhere" | "auto" | "multi-tap" | "choices" | "love-chase" | "ghost-type" | "smash-emoji" | "flip-coin" | "candles" | "scratch-reveal" | "wax-seal" | "drag-box";
  label?: string;
  action: "next" | "complete";
  variant?: "premium" | "ghost" | "danger" | "escape";
  animation?: "shake" | "pulse" | "none";
  tapCount?: number;
  choices?: SceneChoice[];
  count?: number;
  words?: string[];
  delay?: number;
};

export type SceneStep = {
  id: string;
  background: {
    type: SceneBackgroundType;
    gradient?: string;
    color?: string;
    imageUrl?: string;
  };
  prop: {
    type: ScenePropType;
    animation?: PropAnimation;
    label?: string;
    size?: "sm" | "md" | "lg" | "xl";
    config?: Record<string, string | number | boolean>;
  };
  content: {
    title: string;
    body?: string;
    align?: "center" | "left";
  };
  interaction?: SceneInteraction;
  reaction?: string;
  dodge?: { attempts: number };
  nextId?: string;
};

export type SceneFlow = {
  templateId: string;
  scenes: SceneStep[];
};

import type { Tone } from "@/lib/types";

export type SceneContext = {
  step: number;
  total: number;
  customMessages: {
    landingText: string;
    buttonText: string;
    steps: string[];
    ctaMessage: string;
    sceneTitles?: string[];
  };
  finalMessage: string;
  receiverName: string;
  tone: Tone;
  onComplete: () => void;
  onTrack: (action: string) => void;
};
