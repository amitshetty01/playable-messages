import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "mind-read",
      background: { type: "pulse-glow", gradient: "from-[#0d0d1a] via-[#1a102e] to-[#0a0512]", color: "rgba(180,130,255,0.15)" },
      prop: { type: "sparkle", animation: "float" },
      content: { title: "I can read your mind… 🔮", body: "Every thought you have, I already know." },
      interaction: { type: "auto", action: "next", label: "", delay: 2200 },
      reaction: "🔮",
    },
    {
      id: "ready",
      background: { type: "pulse-glow", gradient: "from-[#0d0d1a] via-[#1a102e] to-[#0a0512]", color: "rgba(180,130,255,0.2)" },
      prop: { type: "sparkle", animation: "pulse" },
      content: { title: "Are you ready?", body: "Let me show you what I see…" },
      interaction: { type: "auto", action: "next", label: "", delay: 2000 },
      reaction: "✨",
    },
    {
      id: "three",
      background: { type: "pulse-glow", gradient: "from-[#0d0d1a] via-[#1a102e] to-[#0a0512]", color: "rgba(180,130,255,0.18)" },
      prop: { type: "sparkle", animation: "reveal-scale" },
      content: { title: "3", body: "Focus on your heart…" },
      interaction: { type: "auto", action: "next", label: "", delay: 800 },
    },
    {
      id: "two",
      background: { type: "pulse-glow", gradient: "from-[#1a0820] via-[#2d1040] to-[#0a0512]", color: "rgba(255,95,183,0.2)" },
      prop: { type: "sparkle", animation: "reveal-scale" },
      content: { title: "2", body: "I'm getting closer…" },
      interaction: { type: "auto", action: "next", label: "", delay: 800 },
    },
    {
      id: "one",
      background: { type: "pulse-glow", gradient: "from-[#1a0820] via-[#3a1050] to-[#0a0512]", color: "rgba(255,95,183,0.3)" },
      prop: { type: "sparkle", animation: "reveal-scale" },
      content: { title: "1", body: "Here it comes…" },
      interaction: { type: "auto", action: "next", label: "", delay: 800 },
    },
    {
      id: "reveal-vision",
      background: { type: "pulse-glow", gradient: "from-[#1c0824] via-[#2d1040] to-[#14041a]", color: "rgba(255,95,183,0.28)" },
      prop: { type: "sparkle", animation: "float" },
      content: { title: "I see two paths…", body: "One lives in your heart. The other runs forever." },
      interaction: { type: "auto", action: "next", label: "", delay: 2200 },
      reaction: "💫",
    },
    {
      id: "dont-chase",
      background: { type: "pulse-glow", gradient: "from-[#1c0824] via-[#2d1040] to-[#14041a]", color: "rgba(180,130,255,0.15)" },
      prop: { type: "sparkle", animation: "float" },
      content: {
        title: "Don't try to catch the other one",
        body: "You can't — because that's not what your heart wants. The one meant for you never runs."
      },
      interaction: { type: "auto", action: "next", label: "", delay: 3000 },
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
