"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThreeParticleBackground } from "@/components/ThreeParticleBackground";
import { VoiceInput } from "@/components/VoiceInput";
import { templates } from "@/lib/data";
import type { Template } from "@/lib/types";

// ═══════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════

type CreatorStage =
  | "opening"
  | "identify_intent"
  | "identify_recipient"
  | "collect_story"
  | "identify_emotion"
  | "generate_draft"
  | "review_draft"
  | "collect_optional_features"
  | "recommend_experiences"
  | "complete";

type CreatorContext = {
  recipientName: string | null;
  relationship: string | null;
  intent: string | null;
  desiredEmotion: string | null;
  storyFacts: string[];
  generatedDraft: string | null;
  draftStatus: "not_created" | "reviewing" | "approved" | "skipped";
  passwordPreference: boolean | null;
  photoPreference: boolean | null;
};

type MessageIntent = "greeting" | "casual" | "creator_context" | "answer_to_question" | "clarification" | "off_topic" | "draft_feedback" | "experience_choice";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
  id: string;
};

let msgCounter = 0;
function nextId() {
  return `msg-${++msgCounter}`;
}

const AI_QUESTION = "What do you want them to feel today?";
const SUPPORTING_TEXT = "Tell me who this is for and what is on your mind. You do not need to write it perfectly.";

// ═══════════════════════════════════════════════════
// Extraction + Classification + Response helpers
// ═══════════════════════════════════════════════════

const MINIMAL_PATTERNS = [
  /^(hi|hey|hello|yo|sup|heyy?|heya|helloo?|hii+)$/i,
  /^(ok|okay|k|kk|a?h[oa]?|mm?h?m?|yep|yeah|yup|nah|nope|no|yes)$/i,
  /^(idk|i don'?t know|whatever|maybe|sure|fine|alright)$/i,
  /^[😀-🙏🫶🫸-🫹🐶-🦄🍕-🥂🌈-🦋💕-💯✨-💥]+$/u,
  /^[a-z]{1,3}$/i,
  /^[^a-zA-Z0-9]{1,5}$/,
];

function isMinimal(input: string): boolean {
  return MINIMAL_PATTERNS.some(p => p.test(input.trim()));
}

function extractRecipientInfo(input: string): { name: string | null; relationship: string | null } {
  const lower = input.toLowerCase();
  const nameMatch = input.match(/(?:my|for|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)(?:\s*[,.]|$|\s+(?:is|was|he|she|they|and))/);
  const name = nameMatch ? nameMatch[1] : null;
  let relationship: string | null = null;
  if (lower.includes("girlfriend") || lower.includes("gf")) relationship = "girlfriend";
  else if (lower.includes("boyfriend") || lower.includes("bf")) relationship = "boyfriend";
  else if (lower.includes("wife")) relationship = "wife";
  else if (lower.includes("husband")) relationship = "husband";
  else if (lower.includes("partner") || lower.includes("spouse")) relationship = "partner";
  else if (lower.includes("best friend") || lower.includes("bff")) relationship = "best friend";
  else if (lower.includes("friend") && !lower.includes("best friend") && !lower.includes("girlfriend") && !lower.includes("boyfriend")) relationship = "friend";
  else if (lower.includes("crush")) relationship = "crush";
  else if (lower.includes("mom") || lower.includes("mother") || lower.includes("mum")) relationship = "mother";
  else if (lower.includes("dad") || lower.includes("father")) relationship = "father";
  else if (lower.includes("sister") || lower.includes("brother") || lower.includes("sibling")) relationship = "sibling";
  else if (lower.includes("daughter") || lower.includes("son")) relationship = "child";
  return { name, relationship };
}

function extractIntent(input: string): string | null {
  const lower = input.toLowerCase();
  if (lower.includes("sorry") || lower.includes("apolog") || lower.includes("forgive") || lower.includes("messed up") || lower.includes("mistake") || lower.includes("wrong") || lower.includes("forgot") || lower.includes("anniversary") || lower.includes("regret")) return "apology";
  if (lower.includes("love") || lower.includes("confess") || lower.includes("crush") || lower.includes("romantic") || lower.includes("feelings")) return "confession";
  if (lower.includes("thank") || lower.includes("grateful") || lower.includes("appreciate")) return "gratitude";
  if (lower.includes("birthday") || lower.includes("celebrate") || lower.includes("party") || lower.includes("surprise") || lower.includes("wish")) return "celebration";
  if (lower.includes("miss") || lower.includes("nostalgia") || lower.includes("remember") || lower.includes("memory")) return "missing";
  if (lower.includes("encourage") || lower.includes("proud") || lower.includes("support") || lower.includes("believe")) return "encouragement";
  return null;
}

function extractDesiredEmotion(input: string): string | null {
  const lower = input.toLowerCase();
  if (lower.includes("happy") || lower.includes("joy") || lower.includes("smile") || lower.includes("delight")) return "joy";
  if (lower.includes("touched") || lower.includes("heart") || lower.includes("warm") || lower.includes("sweet") || lower.includes("meaningful") || lower.includes("loved")) return "touched";
  if (lower.includes("excited") || lower.includes("excitement") || lower.includes("thrill")) return "excitement";
  if (lower.includes("nostalgic") || lower.includes("nostalgia") || lower.includes("memory")) return "nostalgia";
  if (lower.includes("laugh") || lower.includes("fun") || lower.includes("funny") || lower.includes("humor")) return "amusement";
  return null;
}

function extractStoryFacts(input: string): string[] {
  return input.split(/[.?!\n]+/).map(s => s.trim()).filter(s => s.length > 5 && !isMinimal(s));
}

function extractAllContext(input: string): Partial<CreatorContext> {
  const ri = extractRecipientInfo(input);
  return {
    recipientName: ri.name,
    relationship: ri.relationship,
    intent: extractIntent(input),
    desiredEmotion: extractDesiredEmotion(input),
    storyFacts: extractStoryFacts(input),
  };
}

function hasNewContext(oldCtx: CreatorContext, nu: Partial<CreatorContext>): boolean {
  if (nu.recipientName && !oldCtx.recipientName) return true;
  if (nu.relationship && !oldCtx.relationship) return true;
  if (nu.intent && !oldCtx.intent) return true;
  if (nu.desiredEmotion && !oldCtx.desiredEmotion) return true;
  if (nu.storyFacts?.length && oldCtx.storyFacts.length === 0) return true;
  return false;
}

function mergeContexts(existing: CreatorContext, extracted: Partial<CreatorContext>): CreatorContext {
  return {
    recipientName: existing.recipientName ?? extracted.recipientName ?? null,
    relationship: existing.relationship ?? extracted.relationship ?? null,
    intent: existing.intent ?? extracted.intent ?? null,
    desiredEmotion: existing.desiredEmotion ?? extracted.desiredEmotion ?? null,
    storyFacts: [...existing.storyFacts, ...(extracted.storyFacts ?? [])],
    generatedDraft: existing.generatedDraft,
    draftStatus: existing.draftStatus,
    passwordPreference: existing.passwordPreference ?? extracted.passwordPreference ?? null,
    photoPreference: existing.photoPreference ?? extracted.photoPreference ?? null,
  };
}

function getNextMissingStage(ctx: CreatorContext): CreatorStage | null {
  if (!ctx.intent) return "identify_intent";
  if (!ctx.recipientName && !ctx.relationship) return "identify_recipient";
  if (!ctx.storyFacts.length) return "collect_story";
  if (!ctx.desiredEmotion) return "identify_emotion";
  if (ctx.passwordPreference === null) return "collect_optional_features";
  return null;
}

function evaluateCreationReadiness(ctx: CreatorContext) {
  const hasRecipient = Boolean(ctx.recipientName || ctx.relationship);
  const hasPurpose = Boolean(ctx.intent);
  const hasStory = Boolean(ctx.storyFacts.length);
  return {
    readyForDraft: hasRecipient && hasPurpose && hasStory,
    readyForExperiences: hasRecipient && hasPurpose && hasStory && (ctx.draftStatus === "approved" || ctx.draftStatus === "skipped"),
  };
}

function classifyMessage(input: string): MessageIntent {
  const t = input.trim().toLowerCase();
  if (/^(hi|hey|hello|yo|sup|heyy?|heya|helloo?|howdy|good morning|good evening|good afternoon|what'?s up|wassup|hii+)$/i.test(t)) return "greeting";
  if (/^(how are you|what are you|are you real|who are you|what can you do|how do you work|tell me about yourself)$/i.test(t)) return "casual";
  const ctx = extractAllContext(input);
  if (ctx.recipientName || ctx.relationship || ctx.intent || ctx.desiredEmotion || (ctx.storyFacts && ctx.storyFacts.length > 0)) return "creator_context";
  if (/^(i don'?t know|what do you mean|i don'?t understand|can you explain|how|what should i|help|confused|not sure|idk)$/i.test(t)) return "clarification";
  return "off_topic";
}

function generateResponse(
  classification: MessageIntent,
  stage: CreatorStage,
  ctx: CreatorContext,
  extracted: Partial<CreatorContext>,
  newlyUseful: boolean,
): string {
  const name = ctx.recipientName || ctx.relationship || "";
  const ref = name ? ` for ${name}` : "";

  if (stage === "review_draft" || stage === "recommend_experiences") {
    if (classification === "greeting") return "Hey! Take your time—let me know if you'd like to adjust anything.";
    return "I'm here. Let me know what you think of the draft.";
  }

  if (classification === "greeting") {
    if (!ctx.intent && !ctx.recipientName && !ctx.relationship) return "Hey 👋 I'm here. Tell me who this is for and what you want them to feel.";
    if (!ctx.intent) return "Hey 👋 I'm listening. What do you want to tell them?";
    if (!ctx.recipientName && !ctx.relationship) return "Hey! Who is this for?";
    if (!ctx.storyFacts.length) return "Hey! I've got the basics. What happened?";
    if (!ctx.desiredEmotion) return "Hey! How do you want them to feel when they read this?";
    return "Hey 👋 I'm still with you. Let me know how to refine it.";
  }

  if (classification === "casual") {
    if (!ctx.recipientName && !ctx.relationship) return "I'm good—and ready to help you create something meaningful. Who is this for?";
    if (!ctx.intent) return "I'm here. What do you want to say to them?";
    if (!ctx.storyFacts.length) return "I'm listening. What happened?";
    return "Let's keep going. How do you want them to feel?";
  }

  if (classification === "creator_context" || classification === "answer_to_question") {
    if (newlyUseful && ctx.intent && (ctx.recipientName || ctx.relationship) && ctx.storyFacts.length) {
      const tone = ctx.intent === "apology" ? "sincere" : "beautiful";
      return `I understand. Let me turn that into something ${tone}${ref}.`;
    }
    if (ctx.storyFacts.length && !ctx.desiredEmotion) {
      const followUp = ctx.recipientName ? `I've got the situation${ref}. How do you want them to feel when they read this?` : `I hear you. How do you want them to feel?`;
      return followUp;
    }
    if ((ctx.recipientName || ctx.relationship) && !ctx.intent) return `I hear you${ref}. What do you want to say? A rough idea is fine.`;
    if (ctx.intent && !ctx.recipientName && !ctx.relationship) return "I understand the feeling. Who is this for?";
    if (!ctx.intent && !ctx.recipientName && !ctx.relationship) return "Tell me who this is for and what's on your mind.";
    return "I'm listening. Tell me more.";
  }

  if (classification === "clarification") {
    if (!ctx.recipientName && !ctx.relationship) return "That's okay. Start with just one thing: who is this for?";
    if (!ctx.intent) return "No pressure. Are you apologizing, confessing feelings, celebrating something, or just reaching out?";
    if (!ctx.storyFacts.length) return "Even a rough sentence works. For example: 'I forgot our anniversary' or 'I said something I regret.'";
    if (!ctx.desiredEmotion) return "Think about the feeling. When they open this, what do you hope they feel?";
    return "Take your time. What else comes to mind?";
  }

  if (!ctx.recipientName && !ctx.relationship) return "I can help with that later. For now, who is this message for?";
  if (!ctx.intent) return "Got it. Let's focus on the message. What do you want to say to them?";
  if (!ctx.storyFacts.length) return "I hear you. Let's come back to that. What happened between you two?";
  return "I'm here when you're ready. What's the feeling you want to create?";
}

function debugLog(stage: string, extras: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.debug("[AI Creator]", { stage, ...extras });
  }
}

const STAGE_QUESTIONS: Record<string, string> = {
  identify_intent: "What do you want to say? Are you apologizing, confessing your feelings, celebrating something, or just reaching out?",
  identify_recipient: "Who is this for? Tell me their name and how you know them.",
  collect_story: "What happened? Share a memory, a moment, or what's been on your mind.",
  identify_emotion: "How do you want them to feel when they read this? Happy, touched, nostalgic, excited?",
  collect_optional_features: "Would you like to add a password before they open the message?",
};

const STAGE_FALLBACK_OPTIONS: Record<string, { label: string; value: string }[]> = {
  identify_intent: [
    { label: "💔 Apologize for something", value: "I want to apologize" },
    { label: "💖 Confess my feelings", value: "I want to confess my feelings" },
    { label: "🎉 Celebrate a birthday", value: "I want to celebrate a birthday" },
    { label: "💝 Just reach out", value: "I want to tell them I care" },
  ],
  identify_recipient: [
    { label: "💑 My partner", value: "My partner" },
    { label: "💕 My crush", value: "My crush" },
    { label: "👫 A close friend", value: "My best friend" },
    { label: "👪 A family member", value: "My family member" },
  ],
  collect_story: [
    { label: "✨ A special memory", value: "I remember when we shared a special moment together" },
    { label: "💭 What's on my mind", value: "I've been thinking about you and wanted to share how I feel" },
    { label: "🙏 Something I need to say", value: "There's something I need to tell you that's been on my heart" },
  ],
  identify_emotion: [
    { label: "😊 Happy & warm", value: "I want them to feel happy and warm inside" },
    { label: "💜 Touched & meaningful", value: "I want them to feel deeply touched" },
    { label: "🌟 Nostalgic", value: "I want them to feel nostalgic and remember our moments" },
    { label: "😂 Make them laugh", value: "I want them to laugh and have fun" },
  ],
  collect_optional_features: [
    { label: "🔒 Yes, add a password", value: "password" },
    { label: "No password", value: "no-password" },
  ],
};

// ═══════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════

const TEMPLATE_EMOJI: Record<string, string> = {
  "the-final-button": "🎯",
  "memory-maze": "💜",
  "birthday-surprise-journey": "🎂",
  "love-chase": "💖",
  "kitty-apology": "🐱",
  "come-closer": "👻",
  "birthday-journey": "🎈",
  "escape-me": "🧩",
  "sorry-maze": "💛",
  "our-memories": "📖",
  "love-contract": "📜",
};

function getBestTemplateEmoji(id: string): string {
  return TEMPLATE_EMOJI[id] || "✨";
}

function generateDraft(input: string, usePassword: boolean): string {
  const base = input.length > 80 ? input.slice(0, 77) + "…" : input;
  const passwordLine = usePassword
    ? "\n\nI've wrapped this with a secret password — a question only you can answer. 😊"
    : "\n\nNo locks, no games — just my heart, out in the open for you.";
  return `${base}\n\nI've been thinking about what to say, and I want you to know that you mean more to me than words can capture. Every moment with you feels like a gift I don't deserve, but one I'll cherish forever.${passwordLine}`;
}

function shortenDraft(draft: string): string {
  const lines = draft.split("\n").filter(Boolean);
  return lines.slice(0, Math.min(3, lines.length)).join("\n") + "\n\n— In short, you matter.";
}

function emotionalizeDraft(draft: string): string {
  return draft.replace(
    /mean more to me/g,
    "are the most beautiful part of my world"
  ).replace(
    /gift I don't deserve/g,
    "treasure I never knew I needed"
  ).replace(
    /cherish forever/g,
    "hold in my heart for all of eternity"
  );
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "love-crush": ["love", "crush", "girlfriend", "boyfriend", "romantic", "confess", "feelings", "heart", "date", "partner"],
  "apology-fight-repair": ["sorry", "apolog", "messed up", "fight", "argument", "mistake", "wrong", "forgive", "hurt"],
  "birthday-special-days": ["birthday", "anniversary", "celebration", "surprise", "party", "wish", "congrat"],
  "friendship-best-friend": ["friend", "best friend", "buddy", "mate", "brother", "sister", "appreciate"],
  "funny-roast": ["funny", "roast", "joke", "laugh", "prank", "tease", "comedy"],
};

function matchTemplates(prompt: string): Template[] {
  const lower = prompt.toLowerCase();
  let matchedCat = "love-crush";
  let maxScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((sum, kw) => sum + (lower.includes(kw) ? 1 : 0), 0);
    if (score > maxScore) {
      maxScore = score;
      matchedCat = cat;
    }
  }

  const full = templates.filter((t) => t.status === "full");
  const preferred = full.filter((t) => t.categorySlugs.includes(matchedCat));
  const others = full.filter((t) => !t.categorySlugs.includes(matchedCat));

  const picked = preferred.slice(0, 3);
  const remaining = 3 - picked.length;
  if (remaining > 0) {
    picked.push(...others.slice(0, remaining));
  }
  return picked;
}

// ═══════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════

function AIPresenceDot({ size = "sm" }: { size?: "sm" | "xs" }) {
  const sizeClass = size === "sm" ? "h-3 w-3" : "h-2 w-2";
  return (
    <motion.div
      className={`${sizeClass} shrink-0 rounded-full bg-violet`}
      style={{ boxShadow: "0 0 28px rgba(184,165,255,0.7)" }}
      animate={{ scale: [1, 1.35, 1], opacity: [0.55, 1, 0.55] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function OpeningQuestion() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="display-title text-center text-3xl font-normal leading-tight tracking-tight text-cream sm:text-4xl md:text-5xl"
    >
      {AI_QUESTION}
    </motion.h1>
  );
}

function SupportingSentence() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="text-center text-sm leading-relaxed text-white/[0.52] sm:text-base"
    >
      {SUPPORTING_TEXT}
    </motion.p>
  );
}

function AIWritingState({ messages }: { messages: string[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= messages.length - 1) return;
    const t = setTimeout(() => setIdx((p) => p + 1), 1200);
    return () => clearTimeout(t);
  }, [idx, messages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 text-sm text-white/40"
    >
      <div className="flex items-center gap-1">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-violet/60"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-violet/60"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-violet/60"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="tabular-nums">{messages[idx]}</span>
    </motion.div>
  );
}

function UserResponseBlock({ text, faded }: { text: string; faded?: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: faded ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="ml-auto max-w-[80%] text-right"
    >
      <p
        className={`leading-relaxed text-cream ${
          faded ? "text-sm sm:text-base" : "text-base sm:text-lg"
        }`}
      >
        {text}
      </p>
    </motion.div>
  );
}

function AIResponseBlock({ text, showDot = true }: { text: string; showDot?: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-[85%]"
    >
      {showDot && (
        <div className="mb-3">
          <AIPresenceDot size="xs" />
        </div>
      )}
      <p className="text-sm leading-relaxed text-white/50 sm:text-base">
        {text}
      </p>
    </motion.div>
  );
}

function ActiveAiPrompt({ text, dot }: { text: string; dot?: boolean }) {
  return (
    <motion.div
      layout
      ref={null as any}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full flex-col items-center"
    >
      {dot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <AIPresenceDot />
        </motion.div>
      )}
      <p className="display-title max-w-[85%] text-center text-2xl font-normal leading-tight tracking-tight text-cream sm:text-3xl md:text-4xl">
        {text}
      </p>
      <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </motion.div>
  );
}

function QuickReplyGroup({
  options,
  disabled,
  onSelect,
  selected,
}: {
  options: { label: string; value: string }[];
  disabled: boolean;
  onSelect: (value: string) => void;
  selected: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3"
    >
      {options.map((opt) => {
        const isChosen = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled && !isChosen}
            onClick={() => onSelect(opt.value)}
            className={`ghost-button !min-h-[44px] !rounded-full !px-5 !py-2.5 text-sm ${
              isChosen ? "!border-violet/50 !bg-violet/10 !text-violet" : ""
            } ${disabled && !isChosen ? "pointer-events-none opacity-40" : ""}`}
          >
            {opt.label}
          </button>
        );
      })}
    </motion.div>
  );
}

function DraftRevealCard({
  draft,
  onLoveIt,
  onShorter,
  onMoreEmotional,
  onEdit,
}: {
  draft: string;
  onLoveIt: () => void;
  onShorter: () => void;
  onMoreEmotional: () => void;
  onEdit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-8"
    >
      <p className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase">
        A draft for you
      </p>
      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="display-title whitespace-pre-wrap text-lg leading-relaxed text-cream sm:text-xl">
          {draft}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onLoveIt}
          className="premium-button text-sm"
        >
          Love it, use this 💕
        </button>
        <button
          type="button"
          onClick={onShorter}
          className="ghost-button !min-h-[44px] !rounded-full !px-5 !py-2.5 text-sm"
        >
          Make it shorter
        </button>
        <button
          type="button"
          onClick={onMoreEmotional}
          className="ghost-button !min-h-[44px] !rounded-full !px-5 !py-2.5 text-sm"
        >
          More emotional
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="ghost-button !min-h-[44px] !rounded-full !px-5 !py-2.5 text-sm"
        >
          Let me edit
        </button>
      </div>
    </motion.div>
  );
}

function ExperienceCard({
  template,
  onChoose,
}: {
  template: Template;
  onChoose: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-sheen group flex shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 sm:w-auto"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-2xl ring-1 ring-white/10">
          {getBestTemplateEmoji(template.id)}
        </span>
        <div className="min-w-0">
          <h4 className="text-sm font-extrabold text-white">{template.title}</h4>
          <p className="mt-0.5 text-[10px] text-white/40">{template.length}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-white/50 line-clamp-2">
        {template.hook}
      </p>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/demo/${template.id}`}
          target="_blank"
          className="flex-1 rounded-lg border border-white/15 bg-white/[0.06] py-2 text-center text-[11px] font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white"
        >
          Preview
        </Link>
        <button
          type="button"
          onClick={() => onChoose(template.id)}
          className="flex-1 rounded-lg bg-gradient-to-r from-blush/80 to-violet/80 py-2 text-center text-[11px] font-extrabold text-white shadow transition-all hover:scale-[1.02]"
        >
          Choose this
        </button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════

export function AIHomePage() {
  const [creatorStage, setCreatorStage] = useState<CreatorStage>("opening");
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState<CreatorContext>({
    recipientName: null,
    relationship: null,
    intent: null,
    desiredEmotion: null,
    storyFacts: [],
    generatedDraft: null,
    draftStatus: "not_created",
    passwordPreference: null,
    photoPreference: null,
  });
  const [stallCount, setStallCount] = useState(0);
  const [draftMessage, setDraftMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [quickReplySelected, setQuickReplySelected] = useState<string | null>(null);
  const [recommendedTemplates, setRecommendedTemplates] = useState<Template[]>([]);
  const [editingDraft, setEditingDraft] = useState(false);
  const [editText, setEditText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Template | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [mood, setMood] = useState<"default" | "apology" | "birthday" | "confession" | "missing">("default");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const activeTemplates = useMemo(() => templates.filter((t) => t.status === "full"), []);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 260) + "px";
  }, []);

  function detectMood(text: string) {
    const lower = text.toLowerCase();
    if (lower.includes("sorry") || lower.includes("apolog") || lower.includes("messed up") || lower.includes("fight") || lower.includes("mistake") || lower.includes("forgive")) return "apology" as const;
    if (lower.includes("birthday") || lower.includes("celebrate") || lower.includes("party")) return "birthday" as const;
    if (lower.includes("confess") || lower.includes("crush") || lower.includes("love") || lower.includes("feelings") || lower.includes("romantic")) return "confession" as const;
    if (lower.includes("miss") || lower.includes("gone") || lower.includes("away") || lower.includes("distance") || lower.includes("nostalgia")) return "missing" as const;
    return "default" as const;
  }

  function triggerDraftGeneration(ctx: CreatorContext, userText: string) {
    setCreatorStage("generate_draft");
    setTimeout(() => {
      const draftInput = [ctx.storyFacts.join(". "), ctx.intent, ctx.recipientName].filter(Boolean).join(". ") || userText;
      const draft = generateDraft(draftInput, ctx.passwordPreference ?? false);
      setDraftMessage(draft);
      setEditText(draft);
      setContext((p) => ({ ...p, generatedDraft: draft, draftStatus: "reviewing" }));
      setChatMessages((p) => [
        ...p,
        { role: "ai", text: `Here's a draft based on what you shared:`, id: nextId() },
      ]);
      setCreatorStage("review_draft");
    }, 2800);
  }

  // ── Shared message processor ──

  const processUserInput = useCallback((text: string) => {
    if (!text.trim()) return;
    const trimmed = text.trim();
    setPrompt("");
    setMood(detectMood(trimmed));

    const classification = classifyMessage(trimmed);
    const extracted = extractAllContext(trimmed);
    const merged = mergeContexts(context, extracted);
    const newlyUseful = hasNewContext(context, extracted);

    setContext(merged);
    if (newlyUseful) setStallCount(0);
    else setStallCount((p) => p + 1);

    const response = generateResponse(classification, creatorStage, merged, extracted, newlyUseful);
    const readiness = evaluateCreationReadiness(merged);

    // Determine next stage
    let nextStage = creatorStage;
    if (readiness.readyForDraft && creatorStage !== "generate_draft" && creatorStage !== "review_draft") {
      nextStage = "generate_draft";
    } else if (!readiness.readyForDraft && creatorStage !== "generate_draft" && creatorStage !== "review_draft" && creatorStage !== "recommend_experiences") {
      nextStage = getNextMissingStage(merged) ?? creatorStage;
    }

    // Add messages to chat
    setChatMessages((p) => [
      ...p,
      { role: "user", text: trimmed, id: nextId() },
      { role: "ai", text: response, id: nextId() },
    ]);

    // Stage transition
    if (nextStage !== creatorStage && nextStage !== "generate_draft") {
      setCreatorStage(nextStage);
    }

    if (nextStage === "generate_draft") {
      triggerDraftGeneration(merged, trimmed);
    }

    setShowQuickReplies(false);
    setQuickReplySelected(null);
    setIsExpanded(false);
    setTimeout(() => autoResize(), 50);

    debugLog(creatorStage, {
      classification,
      extracted,
      merged,
      newlyUseful,
      readiness,
      nextStage,
      stale: stallCount,
    });
  }, [context, creatorStage, stallCount, autoResize]);

  // ── Handlers ──

  const handleInitialSubmit = useCallback(() => {
    const text = prompt.trim();
    if (!text) return;
    setPrompt("");
    setMood(detectMood(text));

    const classification = classifyMessage(text);
    const extracted = extractAllContext(text);
    const merged = mergeContexts(context, extracted);

    setContext(merged);

    const response = generateResponse(classification, "opening", merged, extracted, hasNewContext(context, extracted));
    const readiness = evaluateCreationReadiness(merged);

    let nextStage: CreatorStage = getNextMissingStage(merged) ?? "identify_intent";
    if (readiness.readyForDraft) nextStage = "generate_draft";

    setCreatorStage(nextStage);
    setChatMessages([
      { role: "user", text, id: nextId() },
      { role: "ai", text: response, id: nextId() },
    ]);

    if (nextStage === "generate_draft") {
      triggerDraftGeneration(merged, text);
    }

    setShowQuickReplies(false);
    setQuickReplySelected(null);
    setSelectedExperience(null);
    setIsExpanded(false);
    setTimeout(() => autoResize(), 50);

    debugLog("opening", { classification, extracted, merged, readiness, nextStage });
  }, [prompt, context, autoResize]);

  const processConversationInput = useCallback(() => {
    processUserInput(prompt.trim());
  }, [prompt, processUserInput]);

  const handleQuickReply = useCallback(
    (value: string) => {
      setQuickReplySelected(value);
      setShowQuickReplies(false);

      if (creatorStage === "collect_optional_features") {
        const usePassword = value === "password";
        const label = usePassword ? "🔒 Yes, add a password" : "No password";
        setChatMessages((p) => [...p, { role: "user", text: label, id: nextId() }]);
        const merged = mergeContexts(context, { passwordPreference: usePassword });
        setContext(merged);
        const readiness = evaluateCreationReadiness(merged);
        if (readiness.readyForDraft) {
          triggerDraftGeneration(merged, label);
        } else {
          const nextStage = getNextMissingStage(merged) ?? creatorStage;
          setCreatorStage(nextStage);
        }
        return;
      }

      // Fallback quick-reply for other stages
      processUserInput(value);
    },
    [context, creatorStage, processUserInput]
  );

  const handleDraftApproved = useCallback(() => {
    const searchTerms = [context.intent, context.recipientName, context.relationship, ...context.storyFacts].filter(Boolean).join(" ");
    const matched = matchTemplates(searchTerms);
    setRecommendedTemplates(matched);
    setContext((p) => ({ ...p, draftStatus: "approved" }));
    setCreatorStage("recommend_experiences");
    setIsExpanded(true);
    setChatMessages((p) => [
      ...p,
      { role: "ai", text: "Beautiful! I found three ways to deliver this message. Each one creates a different feeling.", id: nextId() },
    ]);
  }, [context]);

  const handleShorter = useCallback(() => {
    const shorter = shortenDraft(draftMessage);
    setDraftMessage(shorter);
    setEditText(shorter);
  }, [draftMessage]);

  const handleMoreEmotional = useCallback(() => {
    const emotional = emotionalizeDraft(draftMessage);
    setDraftMessage(emotional);
    setEditText(emotional);
  }, [draftMessage]);

  const handleEdit = useCallback(() => {
    setEditingDraft(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    setDraftMessage(editText);
    setEditingDraft(false);
  }, [editText]);

  const handleChooseExperience = useCallback(
    (id: string) => {
      const t = activeTemplates.find((tmpl) => tmpl.id === id);
      if (!t) return;
      setSelectedExperience(t);
      const params = new URLSearchParams();
      params.set("template", t.id);
      params.set("message", draftMessage);
      window.location.href = `/create/${t.id}?${params.toString()}`;
    },
    [draftMessage, activeTemplates]
  );

  const handleVoiceTranscript = useCallback((text: string) => {
    setPrompt(text);
    setTimeout(() => autoResize(), 50);
  }, [autoResize]);

  const resetAll = useCallback(() => {
    setCreatorStage("opening");
    setPrompt("");
    setContext({
      recipientName: null,
      relationship: null,
      intent: null,
      desiredEmotion: null,
      storyFacts: [],
      generatedDraft: null,
      draftStatus: "not_created",
      passwordPreference: null,
      photoPreference: null,
    });
    setStallCount(0);
    setDraftMessage("");
    setChatMessages([]);
    setQuickReplySelected(null);
    setRecommendedTemplates([]);
    setEditingDraft(false);
    setEditText("");
    setIsExpanded(false);
    setSelectedExperience(null);
    setShowQuickReplies(false);
    setMood("default");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (creatorStage === "opening") handleInitialSubmit();
        else if (
          creatorStage === "identify_intent" ||
          creatorStage === "identify_recipient" ||
          creatorStage === "collect_story" ||
          creatorStage === "identify_emotion"
        ) processConversationInput();
      }
    },
    [creatorStage, handleInitialSubmit, processConversationInput]
  );

  // ── Hide layout header for immersive experience ──

  useEffect(() => {
    const el = document.querySelector("header");
    if (el) el.style.display = "none";
    return () => {
      const h = document.querySelector("header");
      if (h) h.style.display = "";
    };
  }, []);

  // ── Auto-scroll to keep active prompt visible ──

  useEffect(() => {
    if (creatorStage === "opening" || creatorStage === "recommend_experiences") return;
    const t = setTimeout(() => {
      activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    return () => clearTimeout(t);
  }, [chatMessages.length, creatorStage]);

  // ── Live region for AI messages ──

  const lastAiMessage = chatMessages.filter((m) => m.role === "ai").pop()?.text ?? "";

  return (
    <>
      <ThreeParticleBackground />

      {/* ═══════════════════════════════════════════════
          IMMERSIVE MINIMAL HEADER
          ═══════════════════════════════════════════════ */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 text-sm font-bold text-white/55 transition-colors hover:text-cream"
          aria-label="Craft Your Message home"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-blush to-violet text-[9px] font-extrabold text-white">
            CY
          </span>
          <span className="hidden sm:inline">Craft Your Message</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            if (creatorStage === "opening") {
              document.getElementById("creator-inspiration")?.scrollIntoView({ behavior: "smooth" });
            } else {
              resetAll();
            }
          }}
          className="pointer-events-auto rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-bold text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white/80"
        >
          Exit
        </button>
      </header>

      {/* ═══════════════════════════════════════════════
          CREATOR — LIVING CONVERSATION
          ═══════════════════════════════════════════════ */}
      <section
        ref={containerRef}
        className={`relative z-10 w-full transition-all duration-700`}
        data-glow-color={
          mood === "apology" ? "neon" :
          mood === "birthday" ? "amber" :
          mood === "confession" ? "violet" :
          mood === "missing" ? "sky" :
          undefined
        }
      >
        {/* ─── OPENING STATE ─── */}
        {creatorStage === "opening" && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[calc(100dvh-80px)] w-full flex-col items-center justify-center px-5 py-12"
          >
            <div className="flex w-full max-w-4xl flex-col items-center gap-6">
              {/* ─── Dot ─── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <AIPresenceDot />
              </motion.div>

              {/* ─── Question + Support ─── */}
              <div className="flex flex-col items-center gap-3">
                <OpeningQuestion />
                <SupportingSentence />
              </div>

              {/* ─── Floating Composer ─── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full rounded-[32px] border border-white/[0.07] bg-white/[0.035] px-7 py-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 focus-within:border-violet/30 focus-within:shadow-[0_30px_100px_rgba(184,165,255,0.14)]"
              >
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    autoResize();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. My girlfriend Sarah. I messed up last night and I need to apologise…"
                  className="min-h-[150px] w-full resize-none border-0 bg-transparent pr-4 pb-4 text-lg leading-8 text-cream placeholder:text-white/25 outline-none ring-0 focus:outline-none focus:ring-0 sm:text-[20px] sm:leading-9"
                  autoFocus
                  aria-label="Describe who this is for and what happened"
                />
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="hidden text-sm text-white/38 sm:block">
                    Write naturally. I&apos;ll shape the words for you.
                  </p>
                  <div className="flex items-center justify-end gap-2 self-end sm:self-auto">
                    <VoiceInput onTranscript={handleVoiceTranscript} />
                    <motion.button
                      type="button"
                      onClick={handleInitialSubmit}
                      disabled={!prompt.trim()}
                      className="premium-button !min-h-[46px] !rounded-xl !px-6 !py-2.5 text-sm disabled:opacity-30 disabled:grayscale-[0.6] enabled:shadow-[0_0_35px_rgba(184,165,255,0.12)]"
                      whileTap={{ scale: 0.96 }}
                    >
                      ✨ Craft it
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* ─── Manual Browse ─── */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link
                  href="/templates"
                  className="text-sm text-white/50 transition-colors hover:text-cream"
                >
                  Prefer to browse experiences manually?
                </Link>
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* ─── LIVING CONVERSATION ─── */}
        {creatorStage !== "opening" && (
          <div
            className={`mx-auto w-full px-5 transition-all duration-700 ${
              isExpanded ? "max-w-6xl" : "max-w-4xl"
            }`}
          >
            {(() => {
              const historyMessages = chatMessages.slice(0, -1);
              const lastMessage = chatMessages[chatMessages.length - 1];
              const hasActiveAi =
                lastMessage?.role === "ai" && creatorStage !== "review_draft" && creatorStage !== "recommend_experiences";

              return (
                <div className="flex min-h-screen flex-col pt-24 pb-20" aria-live="polite" aria-atomic="true">
                  {/* ─── LAYER 1: Conversation History ─── */}
                  {historyMessages.length > 0 && (
                    <div className="flex flex-col gap-5">
                      {historyMessages.map((msg) => (
                        msg.role === "user" ? (
                          <UserResponseBlock key={msg.id} text={msg.text} faded />
                        ) : (
                          <AIResponseBlock key={msg.id} text={msg.text} showDot={false} />
                        )
                      ))}
                    </div>
                  )}

                  {/* ─── LAYER 2: Active AI Prompt ─── */}
                  <div
                    ref={activeRef}
                    className={`flex w-full ${
                      hasActiveAi ? "flex-1 items-center justify-center min-h-[35vh]" : ""
                    }`}
                  >
                    <div className="flex w-full flex-col items-center gap-8">
                      {hasActiveAi && (
                        <ActiveAiPrompt text={lastMessage!.text} dot />
                      )}

                      {/* AI Writing State */}
                      {creatorStage === "generate_draft" && (
                        <AIWritingState
                          messages={[
                            "Understanding what happened…",
                            "Finding the right tone…",
                            "Writing something honest…",
                          ]}
                        />
                      )}
                    </div>
                  </div>

                  {/* ─── LAYER 3: Controls ─── */}
                  <div className="mt-auto flex w-full flex-col items-center gap-8">
                    {/* Conversation stages: show composer or quick-replies */}
                    {(() => {
                      const isConversationStage =
                        creatorStage === "identify_intent" ||
                        creatorStage === "identify_recipient" ||
                        creatorStage === "collect_story" ||
                        creatorStage === "identify_emotion";
                      const isPasswordStage = creatorStage === "collect_optional_features";

                      if (isConversationStage && !showQuickReplies) {
                        return (
                          <div className="w-full">
                            {validationError && (
                              <motion.p
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-3 text-sm text-amber-300/80"
                              >
                                {validationError}
                              </motion.p>
                            )}
                            <motion.div
                              layout
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="w-full rounded-[32px] border border-white/[0.07] bg-white/[0.035] px-7 py-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 focus-within:border-violet/30 focus-within:shadow-[0_30px_100px_rgba(184,165,255,0.14)]"
                            >
                              <textarea
                                ref={textareaRef}
                                value={prompt}
                                onChange={(e) => {
                                  setPrompt(e.target.value);
                                  autoResize();
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={STAGE_QUESTIONS[creatorStage] ?? "Tell me more…"}
                                className="min-h-[90px] w-full resize-none border-0 bg-transparent pr-4 pb-3 text-base leading-7 text-cream placeholder:text-white/25 outline-none ring-0 focus:outline-none focus:ring-0 sm:text-lg sm:leading-8"
                                aria-label={STAGE_QUESTIONS[creatorStage] ?? "Tell me more"}
                              />
                              <div className="mt-1 flex items-center justify-end gap-2">
                                <VoiceInput onTranscript={handleVoiceTranscript} />
                                <motion.button
                                  type="button"
                                  onClick={processConversationInput}
                                  disabled={!prompt.trim()}
                                  className="premium-button !min-h-[42px] !rounded-xl !px-5 !py-2 text-sm disabled:opacity-30 disabled:grayscale-[0.6] enabled:shadow-[0_0_30px_rgba(184,165,255,0.12)]"
                                  whileTap={{ scale: 0.96 }}
                                >
                                  ✨ Send
                                </motion.button>
                              </div>
                            </motion.div>
                          </div>
                        );
                      }

                      if ((isConversationStage || isPasswordStage) && showQuickReplies) {
                        const options = isPasswordStage
                          ? STAGE_FALLBACK_OPTIONS.collect_optional_features
                          : STAGE_FALLBACK_OPTIONS[creatorStage] ?? [
                              { label: "Tell me more", value: "Tell me more about this" },
                            ];
                        return (
                          <QuickReplyGroup
                            options={options}
                            disabled={quickReplySelected !== null}
                            selected={quickReplySelected}
                            onSelect={handleQuickReply}
                          />
                        );
                      }

                      return null;
                    })()}

                    {/* Draft Review */}
                    {creatorStage === "review_draft" && !editingDraft && (
                      <>
                        <DraftRevealCard
                          draft={draftMessage}
                          onLoveIt={handleDraftApproved}
                          onShorter={handleShorter}
                          onMoreEmotional={handleMoreEmotional}
                          onEdit={handleEdit}
                        />
                        <button
                          type="button"
                          onClick={resetAll}
                          className="text-xs text-white/30 underline underline-offset-4 transition-colors hover:text-white/50"
                        >
                          ← Start over
                        </button>
                      </>
                    )}

                    {/* Editing Draft */}
                    {creatorStage === "review_draft" && editingDraft && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full rounded-[26px] border border-white/[0.08] bg-white/[0.04] px-7 py-6 backdrop-blur-2xl"
                      >
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-[160px] w-full resize-none border-0 bg-transparent text-lg leading-relaxed text-cream placeholder:text-white/30 outline-none ring-0 focus:outline-none focus:ring-0"
                          aria-label="Edit your draft"
                          autoFocus
                        />
                        <div className="mt-4 flex items-center gap-3">
                          <button type="button" onClick={handleSaveEdit} className="premium-button text-sm">
                            Save 💕
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingDraft(false)}
                            className="ghost-button !min-h-[44px] !rounded-full !px-5 !py-2.5 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Experience Selection */}
                    {creatorStage === "recommend_experiences" && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                      >
                        <div className="grid gap-4 sm:grid-cols-3">
                          {recommendedTemplates.map((t) => (
                            <ExperienceCard key={t.id} template={t} onChoose={handleChooseExperience} />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={resetAll}
                          className="mt-8 text-xs text-white/30 underline underline-offset-4 transition-colors hover:text-white/50"
                        >
                          ← Start over
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: REASSURANCE SCROLL
          ══════════════════════════════════════════ */}
      <section className="relative z-10 w-full overflow-hidden px-4 py-24 lg:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-video overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet/20 via-blush/10 to-neon/10 shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/60" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/60" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-2xl border border-white/20 bg-white/[0.08] p-6 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet/20 text-lg">💭</div>
                    <div className="flex-1 text-left">
                      <div className="h-2 w-24 rounded-full bg-white/20" />
                      <div className="mt-1.5 h-2 w-16 rounded-full bg-white/10" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full rounded-full bg-violet/20" />
                    <div className="h-2 w-3/4 rounded-full bg-violet/10" />
                    <div className="h-2 w-5/6 rounded-full bg-blush/20" />
                  </div>
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-4 rounded-xl bg-emerald-500/20 px-4 py-2 text-center text-sm font-bold text-emerald-300"
                  >
                    ✨ Interactive experience generated!
                  </motion.div>
                </motion.div>
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet/10 via-transparent to-blush/10 blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-center lg:text-left"
          >
            <h2 className="display-title text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              From a single thought to an unforgettable experience in{" "}
              <span className="text-gradient">60 seconds</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/60 sm:text-xl">
              You provide the words. Our AI wraps them in stunning, interactive 3D worlds, games, and cinematic moments. No design skills required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link href="/demo/love-chase" target="_blank" className="ghost-button">
                See an Example →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4: INSPIRATION CAROUSEL
          ══════════════════════════════════════════ */}
      <section id="creator-inspiration" className="relative z-10 w-full overflow-hidden px-4 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Inspiration</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Need a little inspiration?</h2>
            <p className="mt-2 text-sm text-white/50">Click any idea to auto-fill your story prompt</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {INSPIRATION_CARDS.map((card, idx) => (
              <motion.button
                key={card.id}
                type="button"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => {
                  setPrompt(card.prompt);
                  setCreatorStage("opening");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => textareaRef.current?.focus(), 500);
                }}
                className="card-sheen glass group flex w-[240px] shrink-0 flex-col rounded-2xl border border-white/10 p-5 text-left"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl backdrop-blur-sm">
                  {card.emoji}
                </span>
                <h3 className="mt-3 text-base font-bold text-white leading-tight">{card.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  Click to auto-fill the prompt
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5: FOOTER
          ══════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/10 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="text-center sm:text-left">
              <Link href="/" className="text-lg font-bold text-white">
                <span className="bg-gradient-to-r from-blush to-violet bg-clip-text text-transparent">CY</span>
              </Link>
              <p className="mt-1 text-xs text-white/40">
                Craft Your Message. Say it like never before.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-white/50">
              <Link href="/about" className="hover:text-white/75 transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-white/75 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white/75 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white/75 transition-colors">Contact</Link>
              <Link href="/faq" className="hover:text-white/75 transition-colors">FAQ</Link>
              <Link href="/report" className="hover:text-white/75 transition-colors">Report</Link>
            </div>

            <div className="text-center sm:text-right">
              <Link href="/templates" className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-4">
                Prefer the old way? Browse Manual Templates →
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-[10px] text-white/20">
            &copy; {new Date().getFullYear()} Craft Your Message. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

// ═══════════════════════════════════════════════════
// Static data
// ═══════════════════════════════════════════════════

const INSPIRATION_CARDS = [
  { id: "love", emoji: "💖", title: "A love confession", prompt: "I want to confess my feelings to my crush. Make it sweet and romantic." },
  { id: "sorry", emoji: "💔", title: "A sincere apology", prompt: "I need to apologize to my partner for messing up last night. I feel terrible." },
  { id: "birthday", emoji: "🎂", title: "A birthday surprise", prompt: "I want to create a fun birthday surprise for my best friend. Make it playful!" },
  { id: "friend", emoji: "🤝", title: "A friendship note", prompt: "I want to tell my best friend how much they mean to me. Keep it warm." },
  { id: "anniversary", emoji: "💍", title: "An anniversary gift", prompt: "I want to celebrate our anniversary with something romantic and memorable." },
];
