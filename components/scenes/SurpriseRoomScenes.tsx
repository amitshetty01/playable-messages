import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const m = experience.customMessages;
  const [s1 = "This box holds a moment I noticed.", s2 = "This one is full of good things.", s3 = "The last box keeps the real words."] = m.steps;
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "enter",
      background: { type: "room-dark", gradient: "from-[#0d0a18] via-[#151020] to-[#0a0612]" },
      prop: { type: "none" },
      content: { title: "A private room.", body: "Four boxes sit in the corners. Choose which one to open first." },
      interaction: {
        type: "choices",
        label: "Pick a box",
        action: "next",
        choices: [
          { id: "memory", label: "Memory box", emoji: "📦" },
          { id: "compliment", label: "Compliment box", emoji: "🎁" },
          { id: "secret", label: "Secret box", emoji: "🔮" },
        ],
      },
      reaction: "🤔",
    },
    {
      id: "memory-box",
      background: { type: "vignette", gradient: "from-[#151020] via-[#1a1228] to-[#0d0a18]" },
      prop: { type: "box", animation: "reveal-up", label: "Memory", config: { index: 0 } },
      content: { title: "A memory box 📦", body: s1 },
      interaction: { type: "drag-box", variant: "ghost", label: "📦 Drag to open", action: "next" },
      reaction: "📸",
    },
    {
      id: "compliment-box",
      background: { type: "vignette", gradient: "from-[#151020] via-[#1a1228] to-[#0d0a18]" },
      prop: { type: "box", animation: "reveal-up", label: "Compliment", config: { index: 1 } },
      content: { title: "A compliment box 🎁", body: s2 },
      interaction: { type: "drag-box", variant: "ghost", label: "🎁 Drag to open", action: "next" },
      reaction: "🌟",
    },
    {
      id: "secret-box",
      background: { type: "vignette", gradient: "from-[#151020] via-[#1a1228] to-[#0d0a18]" },
      prop: { type: "box", animation: "reveal-up", label: "Secret", config: { index: 2 } },
      content: { title: "A secret box 🔮", body: s3 },
      interaction: { type: "drag-box", variant: "ghost", label: "🔮 Drag to open", action: "next" },
      reaction: "✨",
    },
    {
      id: "surprise-box",
      background: { type: "vignette", gradient: "from-[#151020] via-[#1d1230] to-[#0d0a18]" },
      prop: { type: "box", animation: "reveal-scale", label: "Surprise", config: { index: 3 } },
      content: { title: "One last box 🎉", body: f },
      interaction: { type: "button", variant: "premium", label: "Open the surprise 🎉", action: "complete" },
      reaction: "🎉",
    },
  ];

  return { templateId: "surprise-room-scenes", scenes };
}

export const surpriseRoomScenes = build;
