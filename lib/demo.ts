import { defaultFinalMessage, getTemplateCategory } from "@/lib/data";
import type { ExperienceRecord, Template } from "@/lib/types";

const DEMO_STEPS: Record<string, [string, string, string]> = {
  "the-final-button": [
    "I made this because a normal text felt too easy to ignore.",
    "I don't always know how to say this directly.",
    "But this moment deserves better than a plain message."
  ],
  "the-last-deleted-message": [
    "I typed something for you... then deleted it.",
    "Four versions existed. Only the last one was honest.",
    "The deleted message wasn't wrong — it was just vulnerable."
  ],
  "the-risk-button": [
    "Every risk reveals something true.",
    "The boldest choice leads to the real message.",
    "You picked a level. Now see what it unlocks."
  ],
  "glitch-truth": [
    "This page seems normal. But something is breaking through.",
    "The glitch keeps replacing the text with truth.",
    "System restored. The truth stayed."
  ],
  "dont-smile-challenge": [
    "Your challenge is simple. Don't smile.",
    "Still holding strong? I have more material.",
    "You smiled. I win. Now read the message."
  ],
  "choose-my-punishment": [
    "Pick how I make it up to you.",
    "Okay, you chose. Now I get to say the real part.",
    "I'm sorry. Truly."
  ],
  "mood-repair-machine": [
    "Machine started. Select the mood that needs repairing.",
    "Scan complete. Human attention required.",
    "The best repair is a real message."
  ],
  "the-secret-room": [
    "A secret room. But the password is something honest.",
    "Box 1: What I noticed about you.",
    "Box 3: What I want you to know."
  ],
  "memory-maze": [
    "You are inside a memory. Find the exit.",
    "Each door is a moment we shared.",
    "You found the exit. But this memory stayed."
  ],
  "roast-to-respect": [
    "I will roast you first. Then say the truth.",
    "Your texting style needs a parental advisory label.",
    "Alright. Jokes aside."
  ],
  "type-or-else": [
    "This message only reveals itself one keystroke at a time.",
    "Every correct letter advances the reveal.",
    "If you stop typing, the text starts fading back."
  ],
  "the-trust-scale": [
    "Drag the slider to reveal the hidden message.",
    "The higher you go, the more you see.",
    "Let go and the text slowly fades back."
  ],
  "inkblot": [
    "The message is hidden in the ink.",
    "Drag across the canvas to develop it.",
    "The full message appears at 70% coverage."
  ],
  "two-lies-one-truth": [
    "I have never told you a lie.",
    "I once ate your last snack and blamed the cat.",
    "I think about you more than I admit."
  ],
  "the-closer-you-get": [
    "The message is hidden in plain sight.",
    "Click or scroll to zoom in closer.",
    "At full zoom, every word becomes clear."
  ],
  "come-closer": [
    "The screen looks serious\u2026 almost suspicious.",
    "You get told to go to a dark room alone. Obviously you go.",
    "3\u2026 2\u2026 1\u2026 BOOM. Full brightness flash. You just got pranked."
  ],
  "spin-to-reveal": [
    "Spin the wheel to see what fate chooses.",
    "Each segment unlocks a different theme.",
    "The real message awaits after the spin."
  ],
  "our-memories": [
    "Every smile, every quiet moment, every laugh we shared\u2014I kept them all right here for you.",
    "Some memories don't fade. They stay in your chest and breathe with you. These are the ones I'll carry forever.",
    "I don't want to live in the past. I want every sunrise, every sunset, every breath in between\u2014with you."
  ]
};

export function createDemoExperience(template: Template): ExperienceRecord {
  const steps = DEMO_STEPS[template.id] ?? [
    "Welcome to this interactive experience.",
    "Each step brings you closer to the message.",
    "The final reveal is worth the wait."
  ];

  return {
    id: "demo",
    templateId: template.id,
    category: getTemplateCategory(template).slug,
    creatorName: "Someone kind",
    receiverName: "You",
    relationshipTag: "",
    showCreatorName: true,
    tone: template.tone,
    theme: template.theme,
    customMessages: {
      landingText: template.hook,
      buttonText: "Begin",
      steps,
      ctaMessage: "Create your own interactive message."
    },
    finalMessage: defaultFinalMessage,
    createdAt: new Date().toISOString(),
    analytics: {
      opened: 0,
      completed: 0,
      selectedChoices: {},
      finalCtaClicks: 0,
      templateUsed: template.id
    }
  };
}
