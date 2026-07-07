import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "mind-read",
      background: { type: "pulse-glow", gradient: "from-[#0d0d1a] via-[#1a102e] to-[#0a0512]", color: "rgba(180,130,255,0.15)" },
      prop: { type: "sparkle", animation: "float" },
      content: { title: "I can read your mind… 🔮", body: "Are you ready? Let me show you what I see…" },
      interaction: { type: "auto", action: "next", label: "", delay: 2600 },
      reaction: "🔮",
    },
    {
      id: "reveal-vision",
      background: { type: "pulse-glow", gradient: "from-[#1c0824] via-[#2d1040] to-[#14041a]", color: "rgba(180,130,255,0.15)" },
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
      background: { type: "particles", gradient: "from-[#1c0824] via-[#2d1040] to-[#14041a]", color: "rgba(255,95,183,0.25)" },
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
      background: { type: "pulse-glow", gradient: "from-[#1c0824] via-[#2d1040] to-[#14041a]", color: "rgba(255,95,183,0.35)" },
      prop: { type: "sparkle", animation: "reveal-scale" },
      content: { title: f },
      interaction: { type: "button", variant: "premium", label: "Keep this forever 💗", action: "complete" },
      reaction: "💖",
    },
  ];

  return { templateId: "love-chase", scenes };
}

export const loveChaseScenes = build;
