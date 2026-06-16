import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const m = experience.customMessages;
  const [s1 = "The first seal hides a quiet truth.", s2 = "The second seal holds something warmer.", s3 = "The third seal keeps the real words."] = m.steps;
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "envelope",
      background: { type: "envelope", gradient: "from-[#1c1018] via-[#2d1824] to-[#1a0e14]" },
      prop: { type: "envelope", animation: "float" },
      content: { title: "A sealed letter 💌", body: "Three seals guard the words inside. Each one holds a piece of what I needed to say." },
      interaction: { type: "wax-seal", variant: "ghost", label: "✉️ Break the seal", action: "next" },
      reaction: "💌",
    },
    {
      id: "seal-1",
      background: { type: "envelope", gradient: "from-[#1c1018] via-[#2d1824] to-[#1a0e14]" },
      prop: { type: "seal", animation: "reveal-up", label: "Seal", config: { index: 0 } },
      content: { title: "First seal broken 📜", body: s1 },
      interaction: { type: "wax-seal", variant: "ghost", label: "🔨 Break the seal", action: "next" },
      reaction: "📜",
    },
    {
      id: "seal-2",
      background: { type: "envelope", gradient: "from-[#1c1018] via-[#2d1824] to-[#1a0e14]" },
      prop: { type: "seal", animation: "reveal-up", label: "Seal", config: { index: 1 } },
      content: { title: "Second seal falls ✉️", body: s2 },
      interaction: { type: "wax-seal", variant: "ghost", label: "🔨 Break the seal", action: "next" },
      reaction: "📜",
    },
    {
      id: "seal-3",
      background: { type: "envelope", gradient: "from-[#1c1018] via-[#2d1824] to-[#1a0e14]" },
      prop: { type: "seal", animation: "reveal-up", label: "Seal", config: { index: 2 } },
      content: { title: "Last seal 🔑", body: s3 },
      interaction: { type: "multi-tap", variant: "premium", label: "🔓 Break final seal 3x", action: "next", tapCount: 3 },
      reaction: "🔑",
    },
    {
      id: "letter-open",
      background: { type: "envelope", gradient: "from-[#1c1018] via-[#2d1824] to-[#1a0e14]" },
      prop: { type: "sparkle", animation: "float" },
      content: { title: f },
      interaction: { type: "button", variant: "premium", label: "Keep this letter 💖", action: "complete" },
      reaction: "💖",
    },
  ];

  return { templateId: "secret-letter", scenes };
}

export const secretLetterScenes = build;
