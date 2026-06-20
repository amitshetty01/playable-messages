import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const m = experience.customMessages;
  const [s1 = "I will roast you first.", s2 = "Then say the truth.", s3 = "Jokes aside."] = m.steps;
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "intro",
      background: { type: "cards", gradient: "from-[#1a0e0e] via-[#2d1418] to-[#120a0a]" },
      prop: { type: "roast-card", animation: "reveal-up", label: "I have some things to say about you. Most are jokes. One is real." },
      content: { title: "Roast mode activated 🔥", body: "I will roast you. Hard. But there is a twist at the end." },
      interaction: { type: "flip-coin", variant: "danger", label: "🔥 Bring it", action: "next", count: 3 },
      reaction: "🔥",
    },
    {
      id: "roast-1",
      background: { type: "cards", gradient: "from-[#1a0e0e] via-[#2d1418] to-[#120a0a]" },
      prop: { type: "roast-card", animation: "reveal-up", label: "Your reply speed is slower than my grandmother's dial-up." },
      content: { title: "Mild 🌶️", body: s1 },
      interaction: { type: "flip-coin", variant: "danger", label: "🌶️ Harder", action: "next", count: 3 },
      reaction: "😅",
    },
    {
      id: "roast-2",
      background: { type: "cards", gradient: "from-[#1a0e0e] via-[#2d1418] to-[#120a0a]" },
      prop: { type: "roast-card", animation: "reveal-up", label: "Your texting style needs a parental advisory warning." },
      content: { title: "Medium 🌶️🌶️", body: s2 },
      interaction: { type: "flip-coin", variant: "danger", label: "🌶️ Keep going", action: "next", count: 3 },
      reaction: "😳",
    },
    {
      id: "roast-3",
      background: { type: "cards", gradient: "from-[#1a0e0e] via-[#2d1418] to-[#120a0a]" },
      prop: { type: "roast-card", animation: "reveal-up", label: "You take compliments worse than a cat takes a bath." },
      content: { title: "Spicy 🌶️🌶️🌶️", body: s3 },
      interaction: { type: "flip-coin", variant: "ghost", label: "💫 Show the truth", action: "next", count: 3 },
      reaction: "😤",
    },
    {
      id: "respect",
      background: { type: "vignette", gradient: "from-[#2a1418] via-[#3d2028] to-[#1a0e12]" },
      prop: { type: "mirror", animation: "float" },
      content: { title: f },
      interaction: { type: "button", variant: "premium", label: "Save this 💖", action: "complete" },
      reaction: "💖",
    },
  ];

  return { templateId: "roast-scenes", scenes };
}

export const roastToRespectScenes = build;
