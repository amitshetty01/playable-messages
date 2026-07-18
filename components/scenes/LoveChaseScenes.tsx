import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "mind-read",
      background: { type: "pulse-glow", gradient: "", color: "rgba(237,127,157,0.08)" },
      prop: { type: "sparkle", animation: "float" },
      content: { title: "I can read your mind… 🔮", body: "Are you ready? Let me show you what I see…" },
      interaction: { type: "auto", action: "next", label: "", delay: 2600 },
      reaction: "🔮",
    },
    {
      id: "reveal-vision",
      background: { type: "pulse-glow", gradient: "", color: "rgba(216,200,243,0.08)" },
      prop: { type: "sparkle", animation: "float" },
      content: {
        title: "I see two paths…",
        body: "One lives in your heart. The other runs forever. Don't try to catch the other one — the one meant for you never runs."
      },
      interaction: { type: "auto", action: "next", label: "", delay: 3200 },
      reaction: "💫",
    },
    {
      id: "yes-no",
      background: { type: "particles", gradient: "", color: "rgba(237,127,157,0.06)" },
      prop: { type: "sparkle", animation: "pulse" },
      content: {
        title: "You love me? 💕",
        body: "Two answers. Only one is true for you."
      },
      interaction: {
        type: "love-chase",
        label: "Yes 💖",
        action: "next",
        variant: "premium",
      },
      reaction: "💕",
    },
    {
      id: "reveal",
      background: { type: "pulse-glow", gradient: "", color: "rgba(237,127,157,0.10)" },
      prop: { type: "sparkle", animation: "reveal-scale" },
      content: { title: f },
      interaction: { type: "button", variant: "premium", label: "Keep this forever 💗", action: "complete" },
      reaction: "💖",
    },
  ];

  return { templateId: "love-chase", scenes };
}

export const loveChaseScenes = build;
