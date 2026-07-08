"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getVariant } from "@/lib/ab-testing";
import { useUndoRedo } from "@/lib/useUndoRedo";
import { DynamicFieldEditor } from "@/components/DynamicFieldEditor";
import { DraftRecoveryModal } from "@/components/DraftRecoveryModal";
import { ExperiencePlayer } from "@/components/ExperiencePlayer";
import { defaultCustomMessages, defaultFinalMessage, getTemplateCategory } from "@/lib/data";
import { saveExperience } from "@/lib/my-experiences";
import { Spinner } from "@/components/Spinner";
import { useAudio } from "@/lib/audio-engine";
import { getTemplateConfig } from "@/lib/template-configs";
import { ChainCreateForm } from "@/components/ChainCreateForm";
import { analyzeSentiment } from "@/lib/sentiment";
import { SentimentBadge } from "@/components/SentimentBadge";
import { VoiceInput } from "@/components/VoiceInput";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { haptic } from "@/lib/haptic";
import { playSound } from "@/lib/flowSounds";
import type { ExperienceRecord, RelationshipTag, Template, ThemeName, Tone } from "@/lib/types";
import { RELATIONSHIP_TAGS, ANON_TONES } from "@/lib/types";

const EXPIRY_OPTIONS = [
  { label: "Never expires", value: "" },
  { label: "1 hour", value: "1h" },
  { label: "24 hours", value: "24h" },
  { label: "7 days", value: "7d" }
] as const;

const DRAFT_KEY = "craft-message-draft";

function computeExpiresAt(option: string): string | undefined {
  if (!option) return undefined;
  const ms = option === "1h" ? 3600000 : option === "24h" ? 86400000 : option === "7d" ? 604800000 : 0;
  if (!ms) return undefined;
  return new Date(Date.now() + ms).toISOString();
}

// FP3: Auto-fill suggestions keyed by category slug, then tone
const FINAL_MESSAGE_SUGGESTIONS: Record<string, Partial<Record<Tone, string>>> = {
  "love-crush": {
    Romantic: "I've been wanting to tell you this for a while... You're the most amazing person I've ever met, and my world feels brighter when you're in it.",
    Funny: "So here's the thing — I'm pretty great, and you're pretty great, so statistically we should be together. Just saying.",
    Emotional: "I know I don't say it enough, but you matter to me more than I usually know how to express. Thank you for being you.",
    Savage: "You're not just my type. You're my exact type. Don't let it get to your head. (Okay, maybe a little.)",
    Mystery: "Some messages aren't meant to be read. This one is. Figure it out.",
    Birthday: "Happy birthday to the only person who makes getting older look this good. Cheers to you!",
    Friendship: "You're the kind of friend everyone deserves but very few find. I'm lucky to have you in my corner.",
  },
  "apology-fight-repair": {
    Romantic: "I know I messed up, and I hate that I hurt you. You deserve better, and I'm going to spend the time proving that I can be it.",
    Funny: "I'm sorry... that you're not as awesome as me. But seriously, I messed up and I'm really sorry.",
    Emotional: "There are no words big enough to say how sorry I am. But I'll spend as long as it takes showing you.",
    Savage: "I was wrong. You were right. There, I said it. Now can we go back to being us?",
    Sorry: "I messed up. I know that. But what I feel for you is bigger than any mistake I could make. I'm sorry.",
    Friendship: "I was an idiot and I took you for granted. Best friends don't do that. I'm sorry — can we fix this?",
  },
  "funny-roast": {
    Funny: "I was going to roast you, but clearly nature already did its job. Just kidding... mostly. 😏",
    Savage: "You're like a software update — I know I need you, but I'm going to put you off as long as possible. Just kidding, you're actually cool.",
    Friendship: "If being dumb is a crime, you'd be serving a life sentence. But hey, I love you anyway. 🔥",
  },
  "birthday-special-days": {
    Birthday: "Another year older, another year wiser... or at least older. Happy birthday to someone who makes life a little more interesting!",
    Romantic: "Every birthday of yours is a reminder of how lucky I am to share this journey with you. Here's to many more.",
    Funny: "Happy birthday! You don't look a day over fabulous. (Because that's timeless.)",
    Friendship: "Another trip around the sun and you're still my favorite person to annoy. Happy birthday!",
  },
  "friendship-best-friend": {
    Friendship: "You're not just a friend — you're family I got to choose. And I'd choose you every single time.",
    Funny: "Thanks for being the kind of friend who I can text at 2 AM about nothing. And for not judging my questionable life choices. Mostly.",
    Emotional: "Life is beautiful because people like you exist in it. Thank you for being mine.",
  },
};

export function CreateForm({ templates, initialTemplate, existingExperience }: { templates: Template[]; initialTemplate: Template; existingExperience?: ExperienceRecord }) {
  const isEdit = Boolean(existingExperience);
  const { play: playAudio } = useAudio();
  const getDefaultCategory = (t: Template) => getTemplateCategory(t).slug;
  const isAnonTone = ANON_TONES.includes(existingExperience?.tone ?? initialTemplate.tone);
  const initialFormState = {
    templateId: existingExperience?.templateId ?? initialTemplate.id,
    category: existingExperience?.category ?? getDefaultCategory(initialTemplate),
    creatorName: existingExperience?.creatorName ?? "Someone",
    receiverName: existingExperience?.receiverName ?? "",
    relationshipTag: (existingExperience?.relationshipTag ?? "") as RelationshipTag,
    showCreatorName: existingExperience?.showCreatorName ?? !isAnonTone,
    tone: existingExperience?.tone ?? initialTemplate.tone as Tone,
    theme: existingExperience?.theme ?? initialTemplate.theme as ThemeName,
    landingText: existingExperience?.customMessages.landingText ?? initialTemplate.hook,
    buttonText: existingExperience?.customMessages.buttonText ?? "Begin",
    steps: (existingExperience?.customMessages.steps ?? defaultCustomMessages.steps).join("\n"),
    finalMessage: existingExperience?.finalMessage ?? "",
    ctaMessage: existingExperience?.customMessages.ctaMessage ?? defaultCustomMessages.ctaMessage,
    sceneTitles: (existingExperience?.customMessages.sceneTitles ?? []).join("\n"),
    expiryOption: "",
    customPassword: existingExperience?.customPassword ?? "",
    passwordQuestion: existingExperience?.passwordQuestion ?? "Only one person has the permission to go inside.",
    passwordAnswer: existingExperience?.passwordAnswer ?? "",
    togetherSince: existingExperience?.togetherSince ?? "",
    scheduledAt: "",
    enableSchedule: false,
    viewOnce: false,
  };

  const { state: form, setState: setForm, undo, redo, canUndo, canRedo } = useUndoRedo(initialFormState);

  const template = templates.find((item) => item.id === form.templateId) ?? initialTemplate;
  const templateConfig = getTemplateConfig(form.templateId);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [draftToast, setDraftToast] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<Record<string, any> | null>(null);
  const [draftChecked, setDraftChecked] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [images, setImages] = useState<string[]>(existingExperience?.images ?? []);
  const [wizardStep, setWizardStep] = useState(1);
  const [isChain, setIsChain] = useState(false);
  let generateButtonStyle = 'premium-button';
  try { generateButtonStyle = getVariant('create-button-style') || 'premium-button'; } catch { /* SSR guard */ }
  const [chainTarget, setChainTarget] = useState(3);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showStepCustomization, setShowStepCustomization] = useState(false);
  const [showAdvancedTone, setShowAdvancedTone] = useState(false);
  const [templateData, setTemplateData] = useState<Record<string, any>>(() => {
    if (!existingExperience) return {};
    const td: Record<string, any> = {};
    if (existingExperience.images?.length) td.photos = existingExperience.images;
    if (existingExperience.customPassword) td.password = existingExperience.customPassword;
    if (existingExperience.passwordQuestion) td.passwordQuestion = existingExperience.passwordQuestion;
    if (existingExperience.togetherSince) td.startDate = existingExperience.togetherSince;
    return td;
  });
  const draftTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalMessageDirty = useRef(false);
  const [detectedSentiment, setDetectedSentiment] = useState<{ tone: Tone; theme: ThemeName; confidence: number } | null>(null);
  const [showSentimentBadge, setShowSentimentBadge] = useState(false);
  const manualToneSet = useRef(false);

  // Remix: auto-fill tone, theme, and finalMessage from original experience
  useEffect(() => {
    if (isEdit) return;
    const params = new URLSearchParams(window.location.search);
    const remixId = params.get("remix");
    if (!remixId) return;
    fetch(`/api/experiences/${remixId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setForm((prev) => ({
            ...prev,
            tone: data.tone ?? prev.tone,
            theme: data.theme ?? prev.theme,
            finalMessage: data.finalMessage ?? prev.finalMessage,
            creatorName: data.creatorName ?? prev.creatorName,
            receiverName: data.receiverName ?? prev.receiverName,
            relationshipTag: data.relationshipTag ?? prev.relationshipTag,
            ctaMessage: data.customMessages?.ctaMessage ?? prev.ctaMessage,
          }));
          finalMessageDirty.current = true;
        }
      })
      .catch(() => {});
  }, []);

  // FP3: Auto-fill finalMessage on template/tone change (if user hasn't manually typed)
  useEffect(() => {
    if (isEdit || finalMessageDirty.current) return;
    const catSlug = getDefaultCategory(template);
    const suggestions = FINAL_MESSAGE_SUGGESTIONS[catSlug];
    if (!suggestions) return;
    const matched = suggestions[form.tone];
    if (matched && !form.finalMessage) {
      setForm((prev) => ({ ...prev, finalMessage: matched }));
    }
  }, [form.templateId, form.tone]);

  // Feature 4: Sentiment-Driven Auto-Theming
  useEffect(() => {
    if (isEdit || !form.finalMessage.trim()) {
      setShowSentimentBadge(false);
      return;
    }
    const timer = setTimeout(() => {
      const result = analyzeSentiment(form.finalMessage);
      if (result.confidence >= 0.3 && !manualToneSet.current) {
        setDetectedSentiment(result);
        setShowSentimentBadge(true);
        setForm((prev) => ({
          ...prev,
          tone: result.tone,
          theme: result.theme,
        }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.finalMessage, isEdit]);

  useEffect(() => {
    if (!isEdit) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("strikeBack") === "true") {
      const replyTo = params.get("replyTo");
      const striker = params.get("from") || "Someone";
      setForm((prev) => ({
        ...prev,
        finalMessage: `Oh, you thought you could roast me and get away with it? Nice try, ${striker}. Time to return the favor. 🔥`,
      }));
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); redo(); }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const saveDraft = useCallback(() => {
    if (isEdit) return;
    const draft = { ...form, images, templateData };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* storage full */ }
  }, [form, images, templateData, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    draftTimer.current = setInterval(saveDraft, 30000);
    return () => { if (draftTimer.current) clearInterval(draftTimer.current); };
  }, [saveDraft, isEdit]);

  useEffect(() => {
    if (isEdit || draftChecked) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Record<string, any>;
      if (!draft.templateId) return;
      setPendingDraft(draft);
      setShowDraftModal(true);
    } catch { /* invalid draft */ }
    setDraftChecked(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDraftChoice(choice: "continue" | "fresh") {
    if (choice === "fresh") {
      clearDraft();
      setShowDraftModal(false);
      setPendingDraft(null);
      return;
    }
    if (!pendingDraft) return;
    const draft = pendingDraft;
    const restored = {
      templateId: draft.templateId ?? initialFormState.templateId,
      category: draft.category ?? initialFormState.category,
      creatorName: draft.creatorName ?? initialFormState.creatorName,
      receiverName: draft.receiverName ?? initialFormState.receiverName,
      tone: (draft.tone ?? initialFormState.tone) as Tone,
      theme: (draft.theme ?? initialFormState.theme) as ThemeName,
      landingText: draft.landingText ?? initialFormState.landingText,
      buttonText: draft.buttonText ?? initialFormState.buttonText,
      steps: draft.steps ?? initialFormState.steps,
      finalMessage: draft.finalMessage ?? initialFormState.finalMessage,
      ctaMessage: draft.ctaMessage ?? initialFormState.ctaMessage,
      sceneTitles: draft.sceneTitles ?? initialFormState.sceneTitles,
      expiryOption: draft.expiryOption ?? initialFormState.expiryOption,
      relationshipTag: (draft as any).relationshipTag ?? initialFormState.relationshipTag,
      showCreatorName: (draft as any).showCreatorName ?? initialFormState.showCreatorName,
      customPassword: (draft as any).customPassword ?? initialFormState.customPassword,
      passwordQuestion: (draft as any).passwordQuestion ?? initialFormState.passwordQuestion,
      passwordAnswer: (draft as any).passwordAnswer ?? initialFormState.passwordAnswer,
      togetherSince: (draft as any).togetherSince ?? initialFormState.togetherSince,
      scheduledAt: (draft as any).scheduledAt ?? initialFormState.scheduledAt,
      enableSchedule: (draft as any).enableSchedule ?? initialFormState.enableSchedule,
      viewOnce: (draft as any).viewOnce ?? initialFormState.viewOnce,
    };
    setForm(restored);
    if (Array.isArray(draft.images)) setImages(draft.images);
    if ((draft as any).templateData) setTemplateData((draft as any).templateData);
    setShowDraftModal(false);
    setPendingDraft(null);
    setDraftToast(true);
    setTimeout(() => setDraftToast(false), 4000);
  }

  const experience = useMemo<ExperienceRecord & { expiresAt?: string }>(() => ({
    id: isEdit ? existingExperience!.id : "preview",
    templateId: template.id,
    category: form.category,
    isChain,
    chainTarget: isChain ? chainTarget : 0,
    creatorName: form.creatorName,
    receiverName: form.receiverName || "You",
    relationshipTag: form.relationshipTag,
    showCreatorName: form.showCreatorName,
    tone: form.tone,
    theme: form.theme,
    customMessages: {
      landingText: form.landingText,
      buttonText: form.buttonText,
      steps: form.steps.split("\n").map((step: string) => step.trim()).filter(Boolean),
      ctaMessage: form.ctaMessage,
      sceneTitles: form.sceneTitles.split("\n").map((t: string) => t.trim()).filter(Boolean),
    },
    finalMessage: form.finalMessage,
    createdAt: existingExperience?.createdAt ?? new Date().toISOString(),
    expiresAt: computeExpiresAt(form.expiryOption),
    scheduledAt: form.enableSchedule && form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
    viewOnce: form.viewOnce,
    analytics: existingExperience?.analytics ?? {
      opened: 0,
      completed: 0,
      selectedChoices: {},
      finalCtaClicks: 0,
      templateUsed: template.id
    },
    images: templateData.photos || templateData.images || templateData.photo
      ? (Array.isArray(templateData.photos || templateData.images || templateData.photo)
        ? (templateData.photos || templateData.images || templateData.photo)
        : [templateData.photos || templateData.images || templateData.photo])
      : images,
    customPassword: templateData.password || form.customPassword || undefined,
    passwordQuestion: templateData.passwordQuestion || form.passwordQuestion || undefined,
    passwordAnswer: templateData.passwordAnswer || form.passwordAnswer || undefined,
    togetherSince: templateData.startDate || templateData.togetherSince || form.togetherSince || undefined,
    templateData,

  }), [form, existingExperience, isEdit, template.id, images, templateData]);

  const handleTemplateFieldChange = useCallback((key: string, value: any) => {
    setTemplateData((prev) => ({ ...prev, [key]: value }));
    if (key === "photos" || key === "images" || key === "photo") {
      setImages(Array.isArray(value) ? value : value ? [value] : []);
    }
  }, []);

  // FP7: Web Share API on success, fallback to URL display
  async function shareOrFallback(shareUrl: string, createdIdVal: string) {
    const shareData = { title: "I made something for you", text: form.finalMessage, url: shareUrl };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — show fallback
      }
    }
    // Also try WhatsApp deep link
    try {
      const waText = encodeURIComponent(`${form.finalMessage}\n\n${shareUrl}`);
      window.open(`https://wa.me/?text=${waText}`, "_blank");
      return;
    } catch {}
    // Fallback: show the URL
    setCreatedId(createdIdVal);
  }

  async function submit() {
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (template.status !== "full") { setError("This template is not available yet."); setIsSubmitting(false); return; }
    if (!form.finalMessage.trim()) errors.finalMessage = "Your message can't be empty.";
    if (!form.creatorName.trim()) errors.creatorName = "Who's sending this?";
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }
    try {
      const url = isEdit ? `/api/experiences/${existingExperience!.id}` : "/api/experiences";
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experience)
      });
      const json = await response.json() as { id?: string; error?: string };
      if (!response.ok || !json.id) {
        setError(json.error || "Could not generate the link. Check Supabase configuration.");
        return;
      }
      clearDraft();
      const targetId = json.id;
      const shareUrl = `${window.location.origin}/experience/${targetId}`;
      saveExperience({ id: targetId, templateTitle: template.title, receiverName: form.receiverName || "You", createdAt: new Date().toISOString(), creatorName: form.creatorName });
      // FP7: Try Web Share or WhatsApp, fallback to showing URL
      await shareOrFallback(shareUrl, targetId);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong while generating the link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }

  // FP7: Fallback success screen (when Web Share API fails)
  if (createdId) {
    const shareUrl = `${window.location.origin}/experience/${createdId}`;
    async function copyUrl() {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        haptic("success");
        playSound("ding");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard unavailable */
      }
    }
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="animate-section-fade rounded-[2rem] bg-gradient-to-b from-white/10 to-white/5 p-10 backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-3xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-300"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className="display-title text-4xl font-bold text-white">Your experience is ready!</h2>
          <p className="mt-3 text-white/60">Share this link:</p>

          {/* Copy button with visual toast */}
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-2">
            <input readOnly value={shareUrl} className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none" onClick={(e) => (e.target as HTMLInputElement).select()} />
            <button
              type="button"
              onClick={copyUrl}
              className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all active:scale-95 ${
                copied
                  ? "bg-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                  : "bg-white/15 hover:bg-white/25"
              }`}
            >
              {copied ? "Copied! 🎉" : "Copy Link"}
            </button>
          </div>

          {/* QR Code */}
          <div className="mt-6 flex justify-center">
            <QRCodeDisplay url={shareUrl} />
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button type="button" className="ghost-button" onClick={() => window.open(shareUrl, "_blank", "noopener,noreferrer")}>Preview it</button>
            <button type="button" className="premium-button" onClick={() => setCreatedId(null)}>Create another</button>
          </div>
          <div className="mt-6">
            <a className="text-sm font-bold text-blush underline underline-offset-4 transition-colors hover:text-white" href={`/my-experiences/${createdId}`}>
              Track your message&apos;s journey &rarr;
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-xs font-bold tracking-[0.08em] text-white/50">Preview</span>
          <button className="ghost-button text-sm" type="button" onClick={() => setShowPreview(false)}>
            Back to editing
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ExperiencePlayer experience={experience} mode="preview" template={template} />
        </div>
      </div>
    );
  }

  const WIZARD_STEPS = [
    { num: 1, title: "Choose Tone", icon: "🎨" },
    { num: 2, title: "Write Message", icon: "💬" },
    { num: 3, title: "Add Media", icon: "📸" },
    { num: 4, title: "Preview & Share", icon: "🚀" },
  ];

  return (
    <>
      {showDraftModal && pendingDraft && (
        <DraftRecoveryModal
          draft={pendingDraft}
          onChoose={handleDraftChoice}
        />
      )}
      <div className="mx-auto flex gap-8 lg:max-w-7xl">
      <div className="min-w-0 flex-1 lg:max-w-[50%]">
      <section className="glass min-w-0 rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">{isEdit ? "Edit Mode" : "Gamified Creation"}</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">
          {isEdit ? "Edit your version." : "Create your own version."}
        </h1>
        <p className="mt-4 max-w-2xl text-white/70">{isEdit ? "Update and save changes." : "Turn your words into a playable surprise."}</p>

        {/* Gamified progress bar */}
        <div className="mt-6 mb-8">
          <div className="flex items-center justify-between">
            {WIZARD_STEPS.map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={() => setWizardStep(s.num)}
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    wizardStep >= s.num
                      ? "bg-gradient-to-br from-blush to-violet text-white shadow-lg shadow-blush/30"
                      : "border border-white/15 bg-white/[0.04] text-white/40"
                  }`}
                  animate={wizardStep >= s.num ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {wizardStep > s.num ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    s.icon
                  )}
                </motion.button>
                <span className={`hidden sm:block text-xs font-bold ${wizardStep >= s.num ? "text-white" : "text-white/30"}`}>{s.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blush via-violet to-neon"
              initial={{ width: "0%" }}
              animate={{ width: `${(wizardStep / WIZARD_STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
        <motion.div
          key={wizardStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
        <div className="space-y-8">

        {wizardStep === 1 && (<>
          <Field label="Pick a template" full htmlFor="template-select">
            <select id="template-select" value={form.templateId} onChange={(event) => {
              const next = templates.find((item) => item.id === event.target.value) ?? template;
              finalMessageDirty.current = false;
              manualToneSet.current = true;
              setForm((prev) => ({
                ...prev, templateId: next.id, category: getTemplateCategory(next).slug, tone: next.tone, theme: next.theme, landingText: next.hook, buttonText: "Begin",
                finalMessage: "",
                customPassword: "", passwordQuestion: "Only one person has the permission to go inside.", passwordAnswer: "", togetherSince: "",
              }));
              setImages([]);
              setTemplateData({});
              setShowSentimentBadge(false);
            }} className="input">
              {templates.filter((item) => item.status === "full").sort((a, b) => a.title.localeCompare(b.title)).map((item) => <option className="bg-ink" key={item.id} value={item.id}>{item.title}</option>)}
            </select>
            <p className="mt-2 text-sm leading-5 text-white/50">{template.description}</p>
          </Field>

          <div>
            <p className="mb-2 text-xs font-bold text-white/40">Pick a Tone</p>
            {showSentimentBadge && detectedSentiment && (
              <div className="mb-2">
                <SentimentBadge tone={detectedSentiment.tone} confidence={detectedSentiment.confidence} onDismiss={() => setShowSentimentBadge(false)} />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {[
                { value: "Romantic" as Tone, emoji: "💖", gradient: "from-pink-400 to-rose-600" },
                { value: "Funny" as Tone, emoji: "😂", gradient: "from-yellow-400 to-orange-500" },
                { value: "Sorry" as Tone, emoji: "🥺", gradient: "from-blue-400 to-indigo-600" },
                { value: "Savage" as Tone, emoji: "🔥", gradient: "from-red-500 to-rose-700" },
                { value: "Emotional" as Tone, emoji: "💗", gradient: "from-purple-400 to-pink-600" },
                { value: "Mystery" as Tone, emoji: "🔮", gradient: "from-violet-500 to-purple-800" },
                { value: "Birthday" as Tone, emoji: "🎂", gradient: "from-amber-400 to-yellow-600" },
                { value: "Friendship" as Tone, emoji: "🤝", gradient: "from-teal-400 to-emerald-600" },
              ].map((toneOpt) => (
                <button
                  key={toneOpt.value}
                  type="button"
                  onClick={() => { manualToneSet.current = true; finalMessageDirty.current = false; setShowSentimentBadge(false); setForm((prev) => ({ ...prev, tone: toneOpt.value, finalMessage: "" })); }}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${toneOpt.gradient} text-sm transition-all duration-200 ${
                    form.tone === toneOpt.value
                      ? "ring-2 ring-white/60 ring-offset-2 ring-offset-[#15101f] scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                  title={toneOpt.value}
                >
                  {toneOpt.emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold text-white/40">Pick a Theme</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "Dark Romantic" as ThemeName, gradient: "from-[#2d1b3d] to-[#1a0a2e]" },
                { value: "Soft Pastel" as ThemeName, gradient: "from-[#fce4ec] to-[#f3e5f5]" },
                { value: "Minimal Black" as ThemeName, gradient: "from-[#1a1a1a] to-[#0d0d0d]" },
                { value: "Cute Pink" as ThemeName, gradient: "from-[#ffb6c1] to-[#ff69b4]" },
                { value: "Neon Glitch" as ThemeName, gradient: "from-[#00ffcc] to-[#ff00ff]" },
                { value: "Cinematic Purple" as ThemeName, gradient: "from-[#4a0e4e] to-[#1a0033]" },
                { value: "Clean White" as ThemeName, gradient: "from-[#f8f9fa] to-[#e9ecef]" },
              ].map((themeOpt) => (
                <button
                  key={themeOpt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, theme: themeOpt.value }))}
                  className={`relative h-8 w-8 rounded-full bg-gradient-to-br ${themeOpt.gradient} transition-all duration-200 ${
                    form.theme === themeOpt.value
                      ? "ring-2 ring-white/60 ring-offset-2 ring-offset-[#15101f] scale-110"
                      : "opacity-50 hover:opacity-100 hover:scale-105"
                  }`}
                  title={themeOpt.value}
                />
              ))}
            </div>
          </div>
        </>)}

        {wizardStep === 2 && (<>
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">💬 Message</p>
            <div className="grid gap-5">
              <Field label="What's your real message?" full>
                <div className="flex items-start gap-2">
                  <textarea value={form.finalMessage} onChange={(event) => { finalMessageDirty.current = true; setFieldErrors((prev) => { const next = { ...prev }; delete next.finalMessage; return next; }); setForm((prev) => ({ ...prev, finalMessage: event.target.value })); }} onKeyDown={(e) => { if (!e.shiftKey && !e.ctrlKey && !e.metaKey && !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) { playAudio("type"); } }} maxLength={520} className={`input min-h-28 py-3 flex-1 ${fieldErrors.finalMessage ? "border-rose-400/50" : ""}`} placeholder="I've been meaning to tell you..." aria-label="Your real message" />
                  <VoiceInput onTranscript={(text) => setForm((prev) => ({ ...prev, finalMessage: prev.finalMessage + text }))} />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  {fieldErrors.finalMessage && <p className="text-xs font-bold text-rose-300">{fieldErrors.finalMessage}</p>}
                  <span className="ml-auto text-xs text-white/30">{form.finalMessage.length}/520</span>
                </div>
              </Field>

              {form.finalMessage.trim() && (
                <div className="animate-section-fade rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-2 text-[10px] font-bold tracking-[0.08em] text-white/30">PREVIEW</p>
                  <div className="mx-auto max-w-[280px] rounded-2xl bg-[#005c4b] p-3">
                    <p className="text-sm leading-relaxed text-white">{form.finalMessage}</p>
                    <p className="mt-1.5 text-right text-[10px] text-white/40">Just now</p>
                  </div>
                </div>
              )}

              <details className="group" open={showStepCustomization} onToggle={(e) => setShowStepCustomization((e.target as HTMLDetailsElement).open)}>
                <summary className="cursor-pointer text-xs font-bold tracking-[0.08em] text-white/40 hover:text-white/60 transition-colors">
                  Customize Build-up Steps ▾
                </summary>
                <div className="mt-3 animate-section-fade space-y-4">
                  <Field label="Build-up steps (one per line)" full>
                    <textarea value={form.steps} onChange={(event) => { setFieldErrors((prev) => { const next = { ...prev }; delete next.steps; return next; }); setForm((prev) => ({ ...prev, steps: event.target.value })); }} className={`input min-h-36 py-3 ${fieldErrors.steps ? "border-rose-400/50" : ""}`} placeholder="You mean a lot to me...&#10;I don't say it enough...&#10;So here's something special..." />
                    {fieldErrors.steps && <p className="mt-1 text-xs font-bold text-rose-300">{fieldErrors.steps}</p>}
                  </Field>
                  <Field label="Scene titles (one per line, optional)" full>
                    <textarea value={form.sceneTitles} onChange={(event) => setForm((prev) => ({ ...prev, sceneTitles: event.target.value }))} className="input min-h-24 py-3" placeholder="Step 1 title&#10;Step 2 title&#10;Step 3 title" />
                  </Field>
                </div>
              </details>
            </div>
          </div>
        </>)}

        {wizardStep === 3 && (<>
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">👤 People</p>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Your name (who's sending this?)" htmlFor="creator-name">
                <input id="creator-name" value={form.creatorName} onChange={(event) => { setFieldErrors((prev) => { const next = { ...prev }; delete next.creatorName; return next; }); setForm((prev) => ({ ...prev, creatorName: event.target.value })); }} maxLength={80} className={`input ${fieldErrors.creatorName ? "border-rose-400/50" : ""}`} placeholder="Your name" />
                {fieldErrors.creatorName && <p className="mt-1 text-xs font-bold text-rose-300">{fieldErrors.creatorName}</p>}
              </Field>
              <Field label="Their name (optional)">
                <input value={form.receiverName} onChange={(event) => { setForm((prev) => ({ ...prev, receiverName: event.target.value })); }} maxLength={80} className="input" placeholder="e.g. Sarah (Leave blank for 'You')" />
                <p className="mt-1 text-xs text-white/40">If blank, we&apos;ll use &ldquo;You&rdquo; in the message.</p>
              </Field>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold text-white/70">How do you know them? (optional)</p>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_TAGS.map((r) => (
                  <button key={r.value} type="button" onClick={() => setForm((prev) => ({ ...prev, relationshipTag: r.value }))}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                      form.relationshipTag === r.value ? "border-white/40 bg-white/15 text-white" : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:text-white/70"
                    }`}>
                    {r.emoji} {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, showCreatorName: !prev.showCreatorName }))}
                className={`h-5 w-9 rounded-full transition-colors ${form.showCreatorName ? "bg-neon" : "bg-white/20"}`}>
                <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${form.showCreatorName ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
              </button>
              <span className="text-sm text-white/60">Reveal who sent this</span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">🔘 Buttons &amp; Labels</p>
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Hook / landing text">
                <textarea value={form.landingText} onChange={(event) => setForm((prev) => ({ ...prev, landingText: event.target.value }))} maxLength={180} className="input min-h-24 py-3" placeholder="I made something for you..." />
              </Field>
              <Field label="Button label">
                <input value={form.buttonText} onChange={(event) => setForm((prev) => ({ ...prev, buttonText: event.target.value }))} maxLength={48} className="input" placeholder="Begin" />
              </Field>
              <Field label="Ending CTA text">
                <input value={form.ctaMessage} onChange={(event) => setForm((prev) => ({ ...prev, ctaMessage: event.target.value }))} maxLength={140} className="input" placeholder="Create your own" />
              </Field>
            </div>
          </div>

          {templateConfig.editableFields.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">✨ Template Settings</p>
              <DynamicFieldEditor
                fields={templateConfig.editableFields}
                values={templateData}
                onChange={handleTemplateFieldChange}
                errors={fieldErrors}
              />
            </div>
          )}

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold tracking-[0.08em] text-white/40">🔗 Link settings</p>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Link expiry">
                <select value={form.expiryOption} onChange={(event) => setForm((prev) => ({ ...prev, expiryOption: event.target.value }))} className="input">
                  {EXPIRY_OPTIONS.map((opt) => <option className="bg-ink" key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </Field>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, viewOnce: !prev.viewOnce }))}
                  className={`h-5 w-9 rounded-full transition-colors ${form.viewOnce ? "bg-neon" : "bg-white/20"}`}>
                  <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${form.viewOnce ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                </button>
                <span className="text-sm font-bold text-white/80">View-once message</span>
              </div>
              {form.viewOnce && (
                <p className="text-xs text-amber-300/80">The message will self-destruct after the recipient reads it.</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setIsChain((prev) => !prev)}
                className={`h-5 w-9 rounded-full transition-colors ${isChain ? "bg-blush" : "bg-white/20"}`}>
                <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${isChain ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
              </button>
              <span className="text-sm font-bold text-white/80">Make it a group message?</span>
            </div>
            {isChain && (
              <div className="mt-4">
                <ChainCreateForm chainTarget={chainTarget} onChange={setChainTarget} />
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, enableSchedule: !prev.enableSchedule, scheduledAt: !prev.enableSchedule ? "" : prev.scheduledAt }))}
                className={`h-5 w-9 rounded-full transition-colors ${form.enableSchedule ? "bg-neon" : "bg-white/20"}`}>
                <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${form.enableSchedule ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
              </button>
              <span className="text-sm font-bold text-white/80">Schedule for later</span>
            </div>
            {form.enableSchedule && (
              <div className="mt-4">
                <Field label="Unlock date & time" full>
                  <input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => setForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                    className="input"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="mt-1 text-xs text-white/40">The message will stay locked until this date and time.</p>
                </Field>
              </div>
            )}
          </div>
        </>)}

        {wizardStep === 4 && (<>
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blush/20 to-violet/20 text-3xl">
              🚀
            </div>
            <h2 className="text-2xl font-bold text-white">Ready to launch!</h2>
            <p className="mt-2 text-white/60">Review your message, then share the link.</p>

            {form.finalMessage.trim() && (
              <div className="mx-auto mt-6 max-w-[280px] rounded-2xl bg-[#005c4b] p-4">
                <p className="text-sm leading-relaxed text-white">{form.finalMessage}</p>
                <p className="mt-1.5 text-right text-[10px] text-white/40">Just now</p>
              </div>
            )}

            {error ? <p className="mt-5 rounded-2xl border border-rose-200/30 bg-rose-300/10 p-4 text-sm font-bold text-rose-100" role="alert">{error}</p> : null}

            {draftToast ? <p className="mt-4 animate-section-fade rounded-2xl border border-emerald-200/30 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100" role="status">Draft restored — your unsaved work is back.</p> : null}

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="ghost-button" type="button" onClick={() => setShowPreview(true)}>Preview</button>
              <button className={generateButtonStyle} type="button" disabled={isSubmitting} onClick={submit}>
                {isSubmitting ? <span className="inline-flex items-center gap-2"><Spinner className="h-4 w-4" /> Saving...</span> : "Generate link 🎉"}
              </button>
            </div>
          </div>
        </>)}
      </div>
      </motion.div>
      </AnimatePresence>

      {/* Wizard navigation */}
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
          disabled={wizardStep === 1}
          className="ghost-button"
        >
          ← Back
        </button>
        {wizardStep < WIZARD_STEPS.length && (
          <button
            type="button"
            onClick={() => setWizardStep((s) => Math.min(WIZARD_STEPS.length, s + 1))}
            className="premium-button"
          >
            Continue →
          </button>
        )}
      </div>
    </section>
    </div>

    {/* ─── Live Phone Preview (desktop/tablet) ─── */}
    <aside className="hidden lg:block sticky top-4 self-start w-[45%] shrink-0">
      <div className="relative">
        <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-b from-violet/20 via-blush/10 to-neon/10 blur-3xl opacity-40" />
        <div className="relative overflow-hidden rounded-[2.6rem] bg-gradient-to-b from-zinc-500 via-zinc-400 to-zinc-600 p-[3px] shadow-[0_0_80px_rgba(0,0,0,0.5),0_0_40px_rgba(184,165,255,0.08)]">
          <div className="relative overflow-hidden rounded-[2.4rem] bg-black">
            <div className="pointer-events-none absolute inset-0 z-30 rounded-[2.4rem] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[2.4rem]">
              <div className="absolute -left-1/2 top-0 h-full w-1/3 skew-x-[20deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            </div>
            <div className="absolute left-1/2 top-0 z-20 h-[4px] w-20 -translate-x-1/2 rounded-b-full bg-zinc-900" />
            <div className="absolute right-4 top-3 z-20 h-[6px] w-[6px] rounded-full bg-zinc-900 shadow-inner">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-zinc-600 to-zinc-900" />
            </div>
            <div className="relative aspect-[9/19] w-full max-h-[75vh] overflow-hidden bg-zinc-950" style={{ transform: "translateZ(0)" }}>
              <ExperiencePlayer
                key={form.finalMessage.length + form.tone + form.theme}
                template={template}
                experience={experience}
                mode="demo"
              />
            </div>
            <div className="absolute bottom-2 left-1/2 z-20 h-[4px] w-28 -translate-x-1/2 rounded-full bg-zinc-900" />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase">Live Preview</p>
          <p className="text-[9px] text-white/20 mt-0.5">Updates as you type</p>
        </div>
      </div>
    </aside>
    </div>
    </>
  );
}

function Field({ label, children, full = false, htmlFor }: { label: string; children: React.ReactNode; full?: boolean; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className={full ? "grid min-w-0 gap-2 md:col-span-2" : "grid min-w-0 gap-2"}><span className="text-sm font-bold text-white/90">{label}</span>{children}</label>;
}
