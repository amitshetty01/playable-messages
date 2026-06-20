import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";

function build(experience: ExperienceRecord): SceneFlow {
  const m = experience.customMessages;
  const [s1 = "I typed something for you.", s2 = "Then I deleted it.", s3 = "Because words are hard."] = m.steps;
  const f = experience.finalMessage;

  const scenes: SceneStep[] = [
    {
      id: "typing",
      background: { type: "chat" },
      prop: { type: "chat-bubble", animation: "pulse", label: "I was typing something for you...", config: { align: "left" } },
      content: { title: "One message 💬", body: "Four versions. Only the last one was honest." },
      interaction: { type: "ghost-type", variant: "ghost", label: "📱 Restore draft", action: "next", words: ["I", "typed", "something", "for", "you"] },
      reaction: "💭",
    },
    {
      id: "funny",
      background: { type: "chat" },
      prop: { type: "chat-bubble", animation: "reveal-up", label: s1, config: { align: "left" } },
      content: { title: "The funny one 😂", body: "I started with a joke. It was safe. It was not real." },
      interaction: { type: "ghost-type", variant: "ghost", label: "📱 Restore draft", action: "next", words: ["I", "started", "with", "a", "joke"] },
      reaction: "😅",
    },
    {
      id: "safe",
      background: { type: "chat" },
      prop: { type: "chat-bubble", animation: "reveal-up", label: s2, config: { align: "left" } },
      content: { title: "The safe one 🤷", body: "I tried being normal. Polite. Well-worded. It felt hollow." },
      interaction: { type: "ghost-type", variant: "ghost", label: "📱 Restore draft", action: "next", words: ["I", "tried", "being", "normal", "polite"] },
      reaction: "😐",
    },
    {
      id: "risky",
      background: { type: "chat" },
      prop: { type: "chat-bubble", animation: "reveal-up", label: s3, config: { align: "left" } },
      content: { title: "The risky one 😰", body: "Almost sent this. My finger hovered. Then I backed out." },
      interaction: { type: "button", variant: "danger", label: "Show what I deleted", action: "next" },
      reaction: "😬",
    },
    {
      id: "deleted",
      background: { type: "chat" },
      prop: { type: "chat-bubble", animation: "reveal-scale", label: f, config: { align: "right" } },
      content: { title: "Deleted message restored 💌", body: "I did not delete it because it was wrong. I deleted it because I was scared of how true it was." },
      interaction: { type: "button", variant: "premium", label: "Keep this 💖", action: "complete" },
      reaction: "💖",
    },
  ];

  return { templateId: "deleted-drafts", scenes };
}

export const lastDeletedMessageScenes = build;
