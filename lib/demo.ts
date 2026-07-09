import { defaultFinalMessage, getTemplateCategory } from "@/lib/data";
import type { ExperienceRecord, Template } from "@/lib/types";

const CATEGORY_DEMO: Record<string, { landing: string; steps: [string, string, string]; cta: string }> = {
  confession: {
    landing: "Some words are harder to say than type. This one was written twice — deleted once, sent once.",
    steps: [
      "I've been carrying this sentence in my chest for weeks. It's heavier than it looks.",
      "The screen feels warm, almost like it knows what's about to happen.",
      "There. I said it. Not out loud — but it's yours now. Be gentle with it."
    ],
    cta: "Send your own confession with the same weight."
  },
  apology: {
    landing: "An apology shouldn't look like a text message. It should look like effort. This is mine.",
    steps: [
      "'Sorry' never felt like enough. So I built a moment that holds as much weight as I feel right now.",
      "Every word here was chosen slowly, carefully — the way I should have chosen mine back then.",
      "I can't undo what happened. But I can promise this: I'll carry the lesson, not the excuse."
    ],
    cta: "Make your apology unforgettable."
  },
  celebration: {
    landing: "Some moments deserve a standing ovation. This one gets a whole interactive experience.",
    steps: [
      "You made it. Through everything — the late nights, the doubts, the hard parts nobody saw. You made it.",
      "I built this because 'congratulations' felt too small for what you've done.",
      "Here's to you. Not just for reaching the destination — but for how you walked the whole way."
    ],
    cta: "Celebrate someone with the experience they deserve."
  },
  love: {
    landing: "Not a love letter — those feel too formal. This is closer to what I actually feel. A little messy, a lot honest.",
    steps: [
      "I don't have a single favorite memory of us. I have hundreds, and they keep multiplying.",
      "It's the small things — the way you say my name, the sound you make when you laugh at your own jokes.",
      "I don't know what forever looks like. But I know I want you in every version of it."
    ],
    cta: "Create a love message that feels like you."
  },
  funny: {
    landing: "Warning: this message contains sarcasm, mild exaggeration, and at least one factually questionable claim about you.",
    steps: [
      "If you were a vegetable, you'd be a 'cute-cumber'. I spent way too long thinking about that sentence.",
      "I like you more than pizza. That's serious. I once cried over a burnt pizza.",
      "Alright, jokes aside — you're genuinely the best thing that's happened to me. And I mean that. You're welcome."
    ],
    cta: "Send a playful message that makes them smile."
  },
  memory: {
    landing: "They say memories fade. I don't believe that. Some of them stay sharp enough to cut through any distance.",
    steps: [
      "I still remember the exact look on your face when you first realized something special was happening.",
      "Time passes. Seasons change. But certain moments don't belong to the past — they live inside you.",
      "This isn't nostalgia. It's proof that some things are worth remembering forever."
    ],
    cta: "Turn your favorite memory into an experience."
  },
  mystery: {
    landing: "Not everything needs to be said directly. Some things feel better when they're uncovered, one layer at a time.",
    steps: [
      "Look closer. The answer isn't hiding — it's waiting for you to be ready.",
      "Every message has a shadow version. The one you read and the one underneath.",
      "You found it. I knew you would. Now you know what I couldn't say out loud."
    ],
    cta: "Create a mysterious message that intrigues."
  },
  prank: {
    landing: "You're about to get got. Fair warning. (Also, I love you — which is why this is going to be good.)",
    steps: [
      "The setup: a mysterious screen. The stakes: your dignity. The payoff: absolutely worth it.",
      "You're still reading. That's either bravery or poor decision-making. Both are admirable.",
      "BOOM. Got you. And now that I have your attention — here's the real message."
    ],
    cta: "Prank someone with style (and affection)."
  }
};

export function createDemoExperience(template: Template): ExperienceRecord {
  const cat = getTemplateCategory(template).slug;
  const demo = CATEGORY_DEMO[cat] ?? CATEGORY_DEMO.confession;

  return {
    id: "demo",
    templateId: template.id,
    category: cat,
    creatorName: "Someone kind",
    receiverName: "You",
    relationshipTag: "",
    showCreatorName: true,
    tone: template.tone,
    theme: template.theme,
    customMessages: {
      landingText: demo.landing,
      buttonText: "Begin",
      steps: [template.hook, ...demo.steps],
      ctaMessage: demo.cta
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
