import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const m = experience.customMessages;
  const [s1 = "Every memory starts somewhere.", s2 = "This one starts with you.", s3 = "Not all moments are big. But some stay.", s4 = "And the little things? They matter most.", s5 = "Some memories sneak up on you.", s6 = "This one? It stays forever."] = m.steps;
  const f = experience.finalMessage;
  const images = experience.images ?? [];

  const scenes: SceneStep[] = [
    {
      id: "start",
      background: { type: "cards", gradient: "from-[#2a1f1a] via-[#3d2c24] to-[#1e1612]" },
      prop: { type: "polaroid", animation: "sway", config: { index: 0 } },
      content: { title: "A journey through moments.", body: "Some memories fade. These ones stayed. Tap to relive each one." },
      interaction: { type: "button", variant: "ghost", label: "Begin the journey 📸", action: "next" },
      reaction: "📷",
    },
    {
      id: "memory-1",
      background: { type: "cards", gradient: "from-[#2a1f1a] via-[#3d2c24] to-[#1e1612]" },
      prop: { type: "polaroid", animation: "sway", config: { index: 0, image: images[0] } },
      content: { title: "First memory 📸", body: s1 },
      interaction: { type: "scratch-reveal", variant: "ghost", label: "Scratch to relive this moment", action: "next" },
      reaction: "💫",
    },
    {
      id: "memory-2",
      background: { type: "cards", gradient: "from-[#2a1f1a] via-[#3d2c24] to-[#1e1612]" },
      prop: { type: "polaroid", animation: "sway", config: { index: 1, image: images[1] } },
      content: { title: "A funny moment 😊", body: "The one that still makes you smile when you remember it." },
      interaction: { type: "scratch-reveal", variant: "ghost", label: "Scratch to relive this moment", action: "next" },
      reaction: "😊",
    },
    {
      id: "memory-3",
      background: { type: "cards", gradient: "from-[#2a1f1a] via-[#3d2c24] to-[#1e1612]" },
      prop: { type: "polaroid", animation: "sway", config: { index: 2, image: images[2] } },
      content: { title: "A special one 💗", body: s3 },
      interaction: { type: "scratch-reveal", variant: "ghost", label: "Scratch to relive this moment", action: "next" },
      reaction: "💗",
    },
    {
      id: "memory-4",
      background: { type: "cards", gradient: "from-[#2a1f1a] via-[#3d2c24] to-[#1e1612]" },
      prop: { type: "polaroid", animation: "sway", config: { index: 3, image: images[3] } },
      content: { title: "The quiet moments 🌙", body: s4 },
      interaction: { type: "scratch-reveal", variant: "ghost", label: "Scratch to relive this moment", action: "next" },
      reaction: "🌙",
    },
    {
      id: "memory-5",
      background: { type: "cards", gradient: "from-[#2a1f1a] via-[#3d2c24] to-[#1e1612]" },
      prop: { type: "polaroid", animation: "sway", config: { index: 4, image: images[4] } },
      content: { title: "One that snuck up ✨", body: s5 },
      interaction: { type: "scratch-reveal", variant: "ghost", label: "Scratch to relive this moment", action: "next" },
      reaction: "✨",
    },
    {
      id: "memory-6",
      background: { type: "cards", gradient: "from-[#2a1f1a] via-[#3d2c24] to-[#1e1612]" },
      prop: { type: "polaroid", animation: "sway", config: { index: 5, image: images[5] } },
      content: { title: "The one that stays 💫", body: s6 },
      interaction: { type: "scratch-reveal", variant: "ghost", label: "Scratch to relive this moment", action: "next" },
      reaction: "💫",
    },
    {
      id: "letter",
      background: { type: "cards", gradient: "from-[#2a1f1a] via-[#3d2c24] to-[#1e1612]" },
      prop: { type: "sparkle", animation: "float" },
      content: { title: f },
      interaction: { type: "button", variant: "premium", label: "Save this memory 💖", action: "complete" },
      reaction: "💖",
    },
  ];

  return { templateId: "memory-journey", scenes };
}

export const memoryJourneyScenes = build;
