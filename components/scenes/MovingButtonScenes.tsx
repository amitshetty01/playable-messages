import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const m = experience.customMessages;
  const [s1 = "I wanted this to feel different.", s2 = "Like a moment you actually remember.", s3 = "So here is the truth."] = m.steps;
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "landing",
      background: { type: "pulse-glow", gradient: "from-[#1c1024] via-[#2d1a35] to-[#140c1a]", color: "rgba(246,177,201,0.15)" },
      prop: { type: "floating-card", animation: "float", label: "A single button" },
      content: { title: m.landingText, body: "One press changes everything." },
      interaction: { type: "multi-tap", variant: "ghost", label: "💪 Press 5 times", action: "next", tapCount: 5 },
      reaction: "💫",
    },
    {
      id: "forbidden",
      background: { type: "pulse-glow", gradient: "from-[#1c1024] via-[#2d1a35] to-[#140c1a]", color: "rgba(255,95,183,0.2)" },
      prop: { type: "button", animation: "pulse", label: "Do not press" },
      content: { title: "Catch the words before they escape!", body: "Every time you reach for it... it runs." },
      dodge: { attempts: 2 },
      reaction: "😈",
    },
    {
      id: "escape",
      background: { type: "pulse-glow", gradient: "from-[#1c1024] via-[#2d1a35] to-[#140c1a]", color: "rgba(246,177,201,0.25)" },
      prop: { type: "button", animation: "shake", label: "Too slow" },
      content: { title: "Some things run from being caught.", body: "But they always come back." },
      dodge: { attempts: 2 },
      reaction: "🔥",
    },
    {
      id: "caught",
      background: { type: "pulse-glow", gradient: "from-[#1c1024] via-[#2d1a35] to-[#140c1a]", color: "rgba(246,177,201,0.3)" },
      prop: { type: "floating-card", animation: "float" },
      content: { title: "You caught it.", body: s1 },
      interaction: { type: "button", variant: "premium", label: "I stopped running", action: "next" },
      reaction: "💖",
    },
    {
      id: "stillness",
      background: { type: "pulse-glow", gradient: "from-[#1c1024] via-[#2d1a35] to-[#140c1a]", color: "rgba(246,177,201,0.35)" },
      prop: { type: "floating-card", animation: "none" },
      content: { title: s2, body: s3 },
      interaction: { type: "button", variant: "premium", label: "Open the truth", action: "next" },
      reaction: "✨",
    },
    {
      id: "truth",
      background: { type: "pulse-glow", gradient: "from-[#1c1024] via-[#2d1a35] to-[#140c1a]", color: "rgba(246,177,201,0.4)" },
      prop: { type: "sparkle", animation: "pulse" },
      content: { title: f },
      interaction: { type: "button", variant: "premium", label: "Keep this moment", action: "complete" },
      reaction: "💗",
    },
  ];

  return { templateId: "the-final-button", scenes };
}

export const movingButtonScenes = build;
