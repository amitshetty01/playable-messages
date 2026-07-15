"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { selectTemplate, generateConcepts } from "@/lib/ai-template-selector";
import type { AIUserInput, AISelectionResult, ConceptOption } from "@/lib/ai-template-selector";
import type { UseCase, Emotion } from "@/lib/ai-template-capabilities";

type Step =
  | "welcome"
  | "use-case"
  | "recipient"
  | "message"
  | "photos"
  | "password"
  | "details"
  | "preview"
  | "concepts";

const USE_CASES: { value: UseCase; label: string; emoji: string; description: string }[] = [
  { value: "confession", label: "Confession", emoji: "💖", description: "Tell someone how you really feel" },
  { value: "apology", label: "Apology", emoji: "💔", description: "Make things right" },
  { value: "birthday", label: "Birthday", emoji: "🎂", description: "Celebrate their special day" },
  { value: "anniversary", label: "Anniversary", emoji: "💍", description: "Celebrate your time together" },
  { value: "proposal", label: "Proposal", emoji: "💎", description: "Ask the big question" },
  { value: "friendship", label: "Friendship", emoji: "🤝", description: "Show your bestie some love" },
  { value: "secret-message", label: "Secret Message", emoji: "🤫", description: "Share something only for them" },
  { value: "surprise-reveal", label: "Surprise Reveal", emoji: "🎁", description: "Unveil something unexpected" },
  { value: "custom", label: "Custom", emoji: "✨", description: "Anything else" },
];

const EMOTIONS: { value: Emotion; label: string; emoji: string }[] = [
  { value: "romantic", label: "Romantic", emoji: "💕" },
  { value: "funny", label: "Funny", emoji: "😂" },
  { value: "emotional", label: "Emotional", emoji: "🥹" },
  { value: "dramatic", label: "Dramatic", emoji: "🎭" },
  { value: "cute", label: "Cute", emoji: "🥰" },
  { value: "mysterious", label: "Mysterious", emoji: "🔮" },
  { value: "premium", label: "Premium", emoji: "👑" },
  { value: "savage", label: "Savage", emoji: "🔥" },
  { value: "playful", label: "Playful", emoji: "😏" },
  { value: "nostalgic", label: "Nostalgic", emoji: "💭" },
];

type AICreationWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (templateId: string, data: Record<string, any>) => void;
};

export function AICreationWindow({ isOpen, onClose, onComplete }: AICreationWindowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [progress, setProgress] = useState(0);
  const [input, setInput] = useState<AIUserInput>({
    useCase: "confession",
    emotion: "romantic",
    recipientName: "",
    creatorName: "",
    message: "",
    wantsPhotos: false,
    wantsPassword: false,
    specialDetails: "",
  });
  const [selection, setSelection] = useState<AISelectionResult | null>(null);
  const [concepts, setConcepts] = useState<ConceptOption[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<number>(0);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [passwordText, setPasswordText] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [typingAssistant, setTypingAssistant] = useState("");
  const [showAssistant, setShowAssistant] = useState(false);

  const assistantMessages: Record<string, string> = {
    welcome: "Hi! I'm your creative partner. I'll help you craft something unforgettable.",
    "use-case": "What kind of message is this? Pick the one that feels right.",
    recipient: "Who is this for? Tell me about them so I can choose the perfect experience.",
    message: "What do you want to say? Pour your heart out — I'll handle the rest.",
    photos: "Photos make everything more personal. Want to add some?",
    password: "A secret unlock makes it feel exclusive. Want one?",
    details: "Any special details? Nicknames, dates, inside jokes — the more I know, the better it gets.",
  };

  const totalSteps = 7;

  const goToStep = useCallback((nextStep: Step) => {
    setStep(nextStep);
    const stepOrder: Step[] = ["welcome", "use-case", "recipient", "message", "photos", "password", "details", "preview"];
    const idx = stepOrder.indexOf(nextStep);
    setProgress(Math.round((idx / (stepOrder.length - 1)) * 100));
    setShowAssistant(true);
    setTypingAssistant(typeMessages[nextStep] || "");
    const timer = setTimeout(() => setShowAssistant(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleUseCase = useCallback((uc: UseCase) => {
    setInput((prev) => ({ ...prev, useCase: uc }));
    goToStep("recipient");
  }, [goToStep]);

  const handleEmotionSelect = useCallback((emotion: Emotion) => {
    setInput((prev) => ({ ...prev, emotion }));
  }, []);

  const handlePhotosSubmit = useCallback((wants: boolean) => {
    setInput((prev) => ({ ...prev, wantsPhotos: wants }));
    if (wants) setShowPhotoUpload(true);
    goToStep("password");
  }, [goToStep]);

  const handlePasswordSubmit = useCallback((wants: boolean) => {
    setInput((prev) => ({ ...prev, wantsPassword: wants }));
    goToStep("details");
  }, [goToStep]);

  const handleGenerate = useCallback(() => {
    const result = selectTemplate(input);
    setSelection(result);
    setConcepts(generateConcepts(input));
    setStep("preview");
  }, [input]);

  const handleFinalize = useCallback(() => {
    if (!selection) return;
    const templateId = selection.primary.id;
    const data: Record<string, any> = {
      ...selection.editableData,
      photos: uploadedPhotos,
      password: input.wantsPassword ? passwordText : undefined,
      passwordQuestion: input.wantsPassword ? `Only ${input.recipientName || "you"} knows this...` : undefined,
      passwordAnswer: input.wantsPassword ? passwordText : undefined,
      photoAddOn: selection.photoAddOn,
      passwordAddOn: selection.passwordAddOn,
    };
    onComplete(templateId, data);
    router.push(`/create/${templateId}`);
  }, [selection, input, uploadedPhotos, passwordText, onComplete, router]);

  const handleSelectConcept = useCallback((index: number) => {
    setSelectedConcept(index);
    const concept = concepts[index];
    if (!concept) return;
    const sel: AISelectionResult = {
      primary: concept.template,
      score: 100 - index * 10,
      reason: concept.reason,
      photoAddOn: concept.photoAddOn,
      passwordAddOn: concept.passwordAddOn,
      editableData: {
        finalMessage: input.message || `A message for ${input.recipientName || "you"}`,
        creatorName: input.creatorName || "Someone",
        receiverName: input.recipientName || "You",
      },
    };
    setSelection(sel);
  }, [concepts, input]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#1a1325] to-[#120d1c] shadow-[0_0_80px_rgba(201,168,204,0.12)] backdrop-blur-2xl"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 rounded-t-[2rem] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blush via-violet to-neon"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="p-6 sm:p-10">
          {/* Typing assistant */}
          <AnimatePresence>
            {showAssistant && (
            <motion.div
              className="mb-6 flex items-start gap-3 rounded-2xl border border-violet/20 bg-violet/10 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blush to-violet text-sm">✨</span>
              <div>
                <p className="text-xs font-bold tracking-widest text-violet/60 uppercase">Creative Director</p>
                <p className="mt-1 text-sm leading-relaxed text-white/80">{typingAssistant}</p>
              </div>
            </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === "welcome" && (
              <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blush/20 to-violet/20 text-4xl">
                  ✨
                </div>
                <h2 className="display-title text-4xl font-bold">Create with AI</h2>
                <p className="mt-4 text-white/60 max-w-md mx-auto leading-relaxed">
                  Tell me what you want to create, and I'll craft a personalized interactive experience using the perfect template — with photos, passwords, and cinematic flair.
                </p>
                <button
                  onClick={() => goToStep("use-case")}
                  className="premium-button mt-8"
                >
                  Let's begin →
                </button>
              </motion.div>
            )}

            {step === "use-case" && (
              <motion.div key="use-case" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-xs font-bold tracking-[0.08em] text-white/40 uppercase">Step 1 of {totalSteps}</p>
                <h3 className="mt-2 text-2xl font-bold">What do you want to create?</h3>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {USE_CASES.map((uc) => (
                    <button
                      key={uc.value}
                      onClick={() => handleUseCase(uc.value)}
                      className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                        input.useCase === uc.value
                          ? "border-violet/40 bg-violet/20 shadow-[0_0_20px_rgba(201,168,204,0.1)]"
                          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="text-lg">{uc.emoji}</span>
                      <p className="mt-2 text-sm font-bold text-white">{uc.label}</p>
                      <p className="mt-0.5 text-[11px] text-white/50">{uc.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "recipient" && (
              <motion.div key="recipient" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-xs font-bold tracking-[0.08em] text-white/40 uppercase">Step 2 of {totalSteps}</p>
                <h3 className="mt-2 text-2xl font-bold">Who is this for?</h3>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-bold text-white/80">Their name</label>
                    <input
                      value={input.recipientName}
                      onChange={(e) => setInput((prev) => ({ ...prev, recipientName: e.target.value }))}
                      className="input mt-2"
                      placeholder="e.g. Sarah"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white/80">Your name</label>
                    <input
                      value={input.creatorName}
                      onChange={(e) => setInput((prev) => ({ ...prev, creatorName: e.target.value }))}
                      className="input mt-2"
                      placeholder="e.g. Alex"
                    />
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-bold text-white/80">What emotion should it feel like?</p>
                    <div className="flex flex-wrap gap-2">
                      {EMOTIONS.map((em) => (
                        <button
                          key={em.value}
                          onClick={() => handleEmotionSelect(em.value)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                            input.emotion === em.value
                              ? "border-blush/40 bg-blush/20 text-white"
                              : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20"
                          }`}
                        >
                          {em.emoji} {em.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => goToStep("message")} className="premium-button mt-4">
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {step === "message" && (
              <motion.div key="message" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-xs font-bold tracking-[0.08em] text-white/40 uppercase">Step 3 of {totalSteps}</p>
                <h3 className="mt-2 text-2xl font-bold">What do you want to say?</h3>
                <p className="mt-2 text-sm text-white/60">Pour your heart out. I'll shape it into something beautiful.</p>
                <div className="mt-6">
                  <textarea
                    value={input.message}
                    onChange={(e) => setInput((prev) => ({ ...prev, message: e.target.value }))}
                    className="input min-h-[180px] py-4"
                    placeholder={
                      input.useCase === "confession"
                        ? "I've been meaning to tell you this for a while..."
                        : input.useCase === "apology"
                        ? "I know I messed up and I'm so sorry..."
                        : input.useCase === "birthday"
                        ? "Happy birthday to the most incredible person..."
                        : "Write whatever your heart feels..."
                    }
                  />
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-white/30">{input.message.length} characters</span>
                    <button onClick={() => goToStep("photos")} className="premium-button">
                      Continue →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "photos" && (
              <motion.div key="photos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-xs font-bold tracking-[0.08em] text-white/40 uppercase">Step 4 of {totalSteps}</p>
                <h3 className="mt-2 text-2xl font-bold">Want to add photos?</h3>
                <p className="mt-2 text-sm text-white/60">Photos make the experience more personal and memorable.</p>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => { setInput((prev) => ({ ...prev, wantsPhotos: true })); goToStep("password"); }}
                    className="flex-1 rounded-xl border border-violet/30 bg-violet/15 p-6 text-center transition-all hover:bg-violet/25">
                    <span className="text-2xl">📸</span>
                    <p className="mt-2 text-sm font-bold text-white">Yes, add photos!</p>
                    <p className="mt-1 text-xs text-white/50">I'll place them naturally</p>
                  </button>
                  <button onClick={() => { setInput((prev) => ({ ...prev, wantsPhotos: false })); goToStep("password"); }}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center transition-all hover:bg-white/[0.08]">
                    <span className="text-2xl">💬</span>
                    <p className="mt-2 text-sm font-bold text-white">Just text</p>
                    <p className="mt-1 text-xs text-white/50">Let the words speak</p>
                  </button>
                </div>
                {showPhotoUpload && input.wantsPhotos && (
                  <div className="mt-4 rounded-xl border border-dashed border-white/20 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold text-white/40 mb-2">Upload photos (optional)</p>
                    <input type="file" multiple accept="image/*" className="text-xs text-white/50" onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const urls = files.map((f) => URL.createObjectURL(f));
                      setUploadedPhotos((prev) => [...prev, ...urls]);
                    }} />
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {uploadedPhotos.map((url, i) => (
                          <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden border border-white/10">
                            <img src={url} alt="" className="h-full w-full object-cover" />
                            <button onClick={() => setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                              className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/60 text-[10px] text-white flex items-center justify-center">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {step === "password" && (
              <motion.div key="password" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-xs font-bold tracking-[0.08em] text-white/40 uppercase">Step 5 of {totalSteps}</p>
                <h3 className="mt-2 text-2xl font-bold">Add a secret unlock?</h3>
                <p className="mt-2 text-sm text-white/60">A password makes it feel like a secret only they can open.</p>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => { setInput((prev) => ({ ...prev, wantsPassword: true })); goToStep("details"); }}
                    className="flex-1 rounded-xl border border-violet/30 bg-violet/15 p-6 text-center transition-all hover:bg-violet/25">
                    <span className="text-2xl">🔐</span>
                    <p className="mt-2 text-sm font-bold text-white">Yes, lock it!</p>
                  </button>
                  <button onClick={() => { setInput((prev) => ({ ...prev, wantsPassword: false })); goToStep("details"); }}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center transition-all hover:bg-white/[0.08]">
                    <span className="text-2xl">🔓</span>
                    <p className="mt-2 text-sm font-bold text-white">No password</p>
                  </button>
                </div>
                {input.wantsPassword && (
                  <div className="mt-4 space-y-3">
                    <input value={passwordText} onChange={(e) => setPasswordText(e.target.value)} className="input" placeholder="e.g. our anniversary date" />
                    <input value={passwordHint} onChange={(e) => setPasswordHint(e.target.value)} className="input" placeholder="A hint (optional) — e.g. The day we met" />
                  </div>
                )}
              </motion.div>
            )}

            {step === "details" && (
              <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-xs font-bold tracking-[0.08em] text-white/40 uppercase">Step 6 of {totalSteps}</p>
                <h3 className="mt-2 text-2xl font-bold">Any special details?</h3>
                <p className="mt-2 text-sm text-white/60">The more I know, the more personal I can make it.</p>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-bold text-white/80">Nickname (optional)</label>
                    <input value={input.nickname || ""} onChange={(e) => setInput((prev) => ({ ...prev, nickname: e.target.value }))} className="input mt-1" placeholder="e.g. Sunny, boo, bestie..." />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white/80">An inside joke or special memory?</label>
                    <textarea value={input.insideJoke || ""} onChange={(e) => setInput((prev) => ({ ...prev, insideJoke: e.target.value }))} className="input mt-1 min-h-24" placeholder="e.g. That time we got lost in Paris and ended up at the best bakery" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white/80">Anything else I should know?</label>
                    <textarea value={input.specialDetails} onChange={(e) => setInput((prev) => ({ ...prev, specialDetails: e.target.value }))} className="input mt-1 min-h-24" placeholder="The more context the better..." />
                  </div>
                </div>
                <button onClick={handleGenerate} className="premium-button mt-6">
                  Generate my experience →
                </button>
              </motion.div>
            )}

            {step === "preview" && selection && (
              <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-xs font-bold tracking-[0.08em] text-white/40 uppercase">✨ AI Concept Ready</p>
                
                {/* Selected template badge */}
                <div className="mt-4 rounded-2xl border border-violet/20 bg-gradient-to-br from-violet/10 to-blush/10 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blush to-violet text-lg font-bold text-white">
                      {selection.primary.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-lg font-bold text-white">{selection.primary.name}</p>
                      <p className="text-xs text-white/50">{selection.primary.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-violet/15 px-3 py-1 text-[10px] font-bold text-violet">{selection.primary.tone}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white/60">{selection.primary.theme}</span>
                    {selection.photoAddOn && <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold text-emerald-300">+ Photo Gallery</span>}
                    {selection.passwordAddOn && <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-bold text-amber-300">+ Password Gate</span>}
                    {selection.primary.supportsPhotos && input.wantsPhotos && <span className="rounded-full bg-sky-500/15 px-3 py-1 text-[10px] font-bold text-sky-300">Photos Supported</span>}
                    {selection.primary.supportsPassword && input.wantsPassword && <span className="rounded-full bg-sky-500/15 px-3 py-1 text-[10px] font-bold text-sky-300">Password Supported</span>}
                  </div>
                </div>

                {/* Why AI chose this */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[10px] font-bold tracking-[0.08em] text-white/40 uppercase">Why I chose this</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{selection.reason}</p>
                </div>

                {/* Concept alternatives */}
                {concepts.length > 1 && (
                  <div className="mt-6">
                    <p className="text-[10px] font-bold tracking-[0.08em] text-white/40 uppercase">Alternative Concepts</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {concepts.map((concept, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectConcept(i)}
                          className={`rounded-xl border p-3 text-left transition-all ${
                            selectedConcept === i
                              ? "border-violet/40 bg-violet/15"
                              : "border-white/10 bg-white/[0.04] hover:border-white/20"
                          }`}
                        >
                          <p className="text-xs font-bold text-white">{concept.label}</p>
                          <p className="mt-1 text-[10px] text-white/50 line-clamp-2">{concept.tagline}</p>
                          <p className="mt-1.5 text-[10px] font-bold text-violet/70">{concept.template.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content summary */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[10px] font-bold tracking-[0.08em] text-white/40 uppercase">Content Summary</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">To</span>
                      <span className="font-bold text-white">{input.recipientName || "You"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">From</span>
                      <span className="font-bold text-white">{input.creatorName || "Someone"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Emotion</span>
                      <span className="font-bold text-white">{input.emotion}</span>
                    </div>
                    {input.wantsPhotos && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Photos</span>
                        <span className="font-bold text-white">{uploadedPhotos.length > 0 ? `${uploadedPhotos.length} uploaded` : "User wants photos"}</span>
                      </div>
                    )}
                    {input.wantsPassword && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Password</span>
                        <span className="font-bold text-white">{passwordText ? "Set ✓" : "Will generate"}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-xs text-white/50">Message preview:</p>
                    <p className="mt-1 text-sm italic text-white/80 line-clamp-3">{selection.editableData.finalMessage}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button onClick={() => goToStep("details")} className="ghost-button">
                    Edit details
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => { setStep("concepts"); }} className="ghost-button">
                      Regenerate
                    </button>
                    <button onClick={handleFinalize} className="premium-button">
                      Create experience →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "concepts" && (
              <motion.div key="concepts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-xs font-bold tracking-[0.08em] text-white/40 uppercase">Choose a direction</p>
                <h3 className="mt-2 text-2xl font-bold">Pick a concept</h3>
                <div className="mt-6 space-y-3">
                  {concepts.map((concept, i) => (
                    <button
                      key={i}
                      onClick={() => { handleSelectConcept(i); setStep("preview"); }}
                      className={`w-full rounded-2xl border p-5 text-left transition-all ${
                        selectedConcept === i
                          ? "border-violet/40 bg-violet/15 shadow-[0_0_20px_rgba(201,168,204,0.1)]"
                          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                          i === 0 ? "bg-gradient-to-br from-blush to-violet" : i === 1 ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-cyan-400 to-purple-600"
                        }`}>
                          {concept.label === "Emotional" ? "💗" : concept.label === "Playful" ? "😄" : "🎬"}
                        </span>
                        <div className="flex-1">
                          <p className="font-bold text-white">{concept.label}</p>
                          <p className="text-xs text-white/50">{concept.tagline}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-bold text-violet/70">{concept.template.name}</span>
                        {concept.photoAddOn && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">+Photos</span>}
                        {concept.passwordAddOn && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-300">+Lock</span>}
                      </div>
                      <p className="mt-2 text-xs text-white/50">{concept.reason}</p>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep("preview")} className="ghost-button mt-4">Back to preview</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

const typeMessages: Record<string, string> = {
  welcome: "Let's create something unforgettable. I'll guide you step by step.",
  "use-case": "What kind of moment are you crafting? Pick the one that feels right.",
  recipient: "Who is this for? Tell me about them so I can find the perfect match.",
  message: "Write from the heart. I'll take care of making it magical.",
  photos: "A picture is worth a thousand words... want to add some?",
  password: "A secret lock makes it feel like a private world. Your call.",
  details: "The little things make it special. Share whatever feels right.",
};