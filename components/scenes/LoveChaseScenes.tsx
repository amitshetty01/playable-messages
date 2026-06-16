import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "chase",
      background: { type: "pulse-glow", gradient: "from-[#1c0824] via-[#2d1040] to-[#14041a]", color: "rgba(255,95,183,0.15)" },
      prop: { type: "sparkle", animation: "float" },
      content: {
        title: "One question 💖",
        body: "There are two buttons. Only one tells the truth. The other runs forever."
      },
      interaction: {
        type: "love-chase",
        label: "You love me 💖",
        action: "next",
        variant: "premium",
      },
      reaction: "💖",
    },
    {
      id: "reveal",
      background: { type: "pulse-glow", gradient: "from-[#1c0824] via-[#2d1040] to-[#14041a]", color: "rgba(255,95,183,0.3)" },
      prop: { type: "sparkle", animation: "pulse" },
      content: { title: f },
      reaction: "💖",
    },
  ];

  return { templateId: "love-chase", scenes };
}

export const loveChaseScenes = build;
