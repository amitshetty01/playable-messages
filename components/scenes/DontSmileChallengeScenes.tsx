import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const m = experience.customMessages;
  const [s1 = "Your challenge is simple.", s2 = "Still not smiling. Impressive.", s3 = "Okay, I have more material."] = m.steps;
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "challenge",
      background: { type: "minimal" },
      prop: { type: "emoji-face", animation: "float" },
      content: { title: "Don't Smile Challenge 😏", body: "I bet you cannot get through this without smiling. Ready?" },
      interaction: { type: "smash-emoji", variant: "ghost", label: "😐 Prove it", action: "next", count: 5 },
      reaction: "😏",
    },
    {
      id: "round-1",
      background: { type: "minimal" },
      prop: { type: "emoji-face", animation: "shake" },
      content: { title: "Still straight-faced?", body: "You have incredible control. Or zero sense of humor." },
      interaction: { type: "smash-emoji", variant: "danger", label: "😶 Not smiling", action: "next", count: 5 },
      reaction: "😶",
    },
    {
      id: "round-2",
      background: { type: "minimal" },
      prop: { type: "emoji-face", animation: "shake" },
      content: { title: "Okay, you are tough.", body: "I respect the commitment. But I have layers." },
      interaction: { type: "smash-emoji", variant: "danger", label: "🤨 Still nothing", action: "next", count: 5 },
      reaction: "🤨",
    },
    {
      id: "round-3",
      background: { type: "minimal" },
      prop: { type: "emoji-face", animation: "shake" },
      content: { title: "I brought out the big guns.", body: "You held strong. But were you smiling on the inside?" },
      interaction: { type: "smash-emoji", variant: "ghost", label: "😏 Final round", action: "next", count: 3 },
      reaction: "😏",
    },
    {
      id: "reveal",
      background: { type: "minimal" },
      prop: { type: "sparkle", animation: "float" },
      content: { title: f },
      interaction: { type: "button", variant: "premium", label: "You made it 🎉", action: "complete" },
      reaction: "🎉",
    },
  ];

  return { templateId: "dont-smile-challenge", scenes };
}

export const dontSmileChallengeScenes = build;
