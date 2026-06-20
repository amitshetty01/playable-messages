import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const m = experience.customMessages;
  const [s1 = "You walked into a dark room.", s2 = "I was waiting in the light.", s3 = "Every candle here is for you."] = m.steps;
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "dark-room",
      background: { type: "room-dark" },
      prop: { type: "none" },
      content: { title: "It is dark in here 🕯️", body: "Somewhere in the silence, something is waiting for you. Take a breath." },
      interaction: { type: "multi-tap", variant: "ghost", label: "🕯️ Find the light 3x", action: "next", tapCount: 3 },
      reaction: "🌑",
    },
    {
      id: "lights-on",
      background: { type: "stage", gradient: "from-[#1a1428] via-[#2a1f3d] to-[#0d0a18]" },
      prop: { type: "banner", animation: "reveal-scale" },
      content: { title: s1, body: "The room fills with warm light. You are not alone." },
      interaction: { type: "multi-tap", variant: "premium", label: "🎈 Release 3x", action: "next", tapCount: 3 },
      reaction: "✨",
    },
    {
      id: "balloons",
      background: { type: "stage", gradient: "from-[#1a1428] via-[#2a1f3d] to-[#0d0a18]" },
      prop: { type: "balloon-group", animation: "drift" },
      content: { title: "Balloons rise 🎈", body: "Each one carries a color. Each color holds a wish I have for you." },
      interaction: { type: "multi-tap", variant: "ghost", label: "🎈 Pop balloons 5x", action: "next", tapCount: 5 },
      reaction: "🎈",
    },
    {
      id: "cake",
      background: { type: "stage", gradient: "from-[#1a1428] via-[#2a1f3d] to-[#0d0a18]" },
      prop: { type: "cake", animation: "reveal-up" },
      content: { title: "A candle-lit cake 🎂", body: s3 },
      interaction: { type: "candles", variant: "ghost", label: "🕯️ Blow the candles", action: "next", count: 5 },
      reaction: "🎂",
    },
    {
      id: "message",
      background: { type: "stage", gradient: "from-[#1a1428] via-[#2a1f3d] to-[#0d0a18]" },
      prop: { type: "sparkle", animation: "pulse" },
      content: { title: f },
      interaction: { type: "button", variant: "premium", label: "Blow the candles 🎉", action: "complete" },
      reaction: "🎉",
    },
  ];

  return { templateId: "birthday-journey", scenes };
}

export const birthdayJourneyScenes = build;
