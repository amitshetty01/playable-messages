import { templateCapabilities } from "@/lib/ai-template-capabilities";
import type { UseCase, Emotion, TemplateCapability } from "@/lib/ai-template-capabilities";

export type AIUserInput = {
  useCase: UseCase;
  emotion: Emotion;
  recipientName: string;
  creatorName: string;
  message: string;
  wantsPhotos: boolean;
  wantsPassword: boolean;
  specialDetails: string;
  memoryDate?: string;
  nickname?: string;
  insideJoke?: string;
};

export type AISelectionResult = {
  primary: TemplateCapability;
  score: number;
  reason: string;
  photoAddOn: boolean;
  passwordAddOn: boolean;
  editableData: Record<string, string>;
};

export type ConceptOption = {
  label: string;
  tagline: string;
  template: TemplateCapability;
  emotion: Emotion;
  photoAddOn: boolean;
  passwordAddOn: boolean;
  reason: string;
};

function scoreEmotion(capEmotions: Emotion[], targetEmotion: Emotion): number {
  const order: Emotion[] = ["romantic", "emotional", "nostalgic", "premium", "dramatic", "mysterious", "cute", "playful", "funny", "savage"];
  const targetIdx = order.indexOf(targetEmotion);
  let best = 0;
  for (const e of capEmotions) {
    const idx = order.indexOf(e);
    const diff = Math.abs(targetIdx - idx);
    const s = Math.max(0, 5 - diff);
    if (s > best) best = s;
  }
  return best;
}

function generateMessage(title: string, input: AIUserInput, template: TemplateCapability): string {
  const msg = input.message || `I wanted to say something meaningful to ${input.recipientName || "you"}.`;
  if (template.id === "kitty-apology") {
    return `I'm so sorry, ${input.recipientName || "my love"}${input.insideJoke ? ` — about ${input.insideJoke}` : ""}. ${msg}`;
  }
  if (template.id === "love-chase" || template.id === "the-final-button") {
    return `${input.nickname ? `${input.nickname}, ` : ""}${msg}${input.specialDetails ? ` ${input.specialDetails}` : ""}`;
  }
  if (template.id === "our-memories" || template.id === "memory-maze") {
    const nick = input.nickname ? ` (${input.nickname})` : "";
    return `${msg}${input.specialDetails ? `\n\n${input.specialDetails}` : ""}`;
  }
  if (template.id === "love-contract") {
    return `This contract is between ${input.creatorName || "Me"} and ${input.recipientName || "You"}${input.nickname ? ` (aka ${input.nickname})` : ""}.\n\n${msg}`;
  }
  return msg;
}

export function selectTemplate(input: AIUserInput): AISelectionResult {
  const needsPhoto = input.wantsPhotos;
  const needsPassword = input.wantsPassword;

  let scored = templateCapabilities.map((cap) => {
    let score = 0;

    if (cap.useCases.includes(input.useCase)) score += 10;
    const emScore = scoreEmotion(cap.emotions, input.emotion);
    score += emScore * 1.5;

    if (needsPhoto && cap.supportsPhotos) score += 5;
    if (needsPassword && cap.supportsPassword) score += 5;

    if (input.useCase === "apology" && ["kitty-apology", "sorry-maze"].includes(cap.id)) score += 3;
    if (input.useCase === "confession" && ["love-chase", "the-final-button", "escape-me", "memory-maze"].includes(cap.id)) score += 2;
    if (input.useCase === "birthday" && cap.useCases.includes("birthday")) score += 3;
    if (input.useCase === "anniversary" && cap.useCases.includes("anniversary")) score += 4;
    if (input.emotion === "nostalgic" && cap.emotions.includes("nostalgic")) score += 2;

    return { cap, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored[0];

  const photoAddOn = needsPhoto && !top.cap.supportsPhotos;
  const passwordAddOn = needsPassword && !top.cap.supportsPassword;

  const reason = buildReason(top.cap, input, photoAddOn, passwordAddOn);

  const message = generateMessage(top.cap.name, input, top.cap);

  const editableData: Record<string, string> = {
    finalMessage: message,
    creatorName: input.creatorName || "Someone",
    receiverName: input.recipientName || "You",
  };

  if (input.nickname) editableData.nickname = input.nickname;
  if (input.specialDetails) editableData.specialDetails = input.specialDetails;
  if (input.insideJoke) editableData.insideJoke = input.insideJoke;

  return {
    primary: top.cap,
    score: top.score,
    reason,
    photoAddOn,
    passwordAddOn,
    editableData,
  };
}

export function generateConcepts(input: AIUserInput): ConceptOption[] {
  const concepts: ConceptOption[] = [];

  const emotional = templateCapabilities.filter((c) =>
    c.emotions.includes("emotional") || c.emotions.includes("romantic") || c.emotions.includes("nostalgic")
  );
  const playful = templateCapabilities.filter((c) =>
    c.emotions.includes("funny") || c.emotions.includes("playful") || c.emotions.includes("cute")
  );
  const premium = templateCapabilities.filter((c) =>
    c.emotions.includes("premium") || c.emotions.includes("dramatic") || c.emotions.includes("mysterious")
  );

  const pickBest = (pool: TemplateCapability[], forUseCase: UseCase): TemplateCapability | null => {
    if (!pool.length) return null;
    const preferred = pool.filter((c) => c.useCases.includes(forUseCase));
    return (preferred.length > 0 ? preferred : pool).slice(0, 3).sort(() => Math.random() - 0.5)[0] || pool[0];
  };

  const eTpl = pickBest(emotional, input.useCase);
  const pTpl = pickBest(playful, input.useCase);
  const prTpl = pickBest(premium, input.useCase);

  if (eTpl) concepts.push({
    label: "Emotional",
    tagline: "Heartfelt and sincere — lets the words sink in deep.",
    template: eTpl,
    emotion: "emotional",
    photoAddOn: input.wantsPhotos && !eTpl.supportsPhotos,
    passwordAddOn: input.wantsPassword && !eTpl.supportsPassword,
    reason: `${eTpl.name} — ${eTpl.description}`,
  });

  if (pTpl) concepts.push({
    label: "Playful",
    tagline: "Fun, lighthearted, and full of personality.",
    template: pTpl,
    emotion: "playful",
    photoAddOn: input.wantsPhotos && !pTpl.supportsPhotos,
    passwordAddOn: input.wantsPassword && !pTpl.supportsPassword,
    reason: `${pTpl.name} — ${pTpl.description}`,
  });

  if (prTpl) concepts.push({
    label: "Cinematic",
    tagline: "A premium, dramatic experience with style.",
    template: prTpl,
    emotion: "premium",
    photoAddOn: input.wantsPhotos && !prTpl.supportsPhotos,
    passwordAddOn: input.wantsPassword && !prTpl.supportsPassword,
    reason: `${prTpl.name} — ${prTpl.description}`,
  });

  return concepts;
}

function buildReason(cap: TemplateCapability, input: AIUserInput, photoAddOn: boolean, passwordAddOn: boolean): string {
  const parts: string[] = [];
  parts.push(`I chose **${cap.name}** because it's perfect for ${input.useCase.replace("-", " ")} messages`);
  if (cap.emotions.includes(input.emotion)) parts.push(`with a ${input.emotion} feel`);
  if (photoAddOn) parts.push("I'll add a photo gallery since this template doesn't support photos natively");
  if (passwordAddOn) parts.push("I'll add a password gate before the experience starts");
  return parts.join(". ") + ".";
}