"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StoryData, STORY_WORLDS, STORY_TONES, WORLD_VISUALS, DEFAULT_STORY } from "./types"

interface Props { onComplete: (data: StoryData) => void; onBack: () => void }

interface Question {
  id: number; title: string; subtitle: string; emoji: string;
  key: keyof StoryData; type: "text" | "photo" | "select-card" | "textarea";
  options?: string[]; placeholder?: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Before I begin writing your destiny\u2026 tell me, who is our hero?",
    subtitle: "Your name",
    emoji: "\uD83E\uDDB8", key: "userName", type: "text", placeholder: "Enter your name...",
  },
  {
    id: 2,
    title: "Who changed their world forever?",
    subtitle: "Your partner's name",
    emoji: "\uD83C\uDF1F", key: "partnerName", type: "text", placeholder: "Enter their name...",
  },
  {
    id: 3,
    title: "Show me the faces of the heroes.",
    subtitle: "Photos bring your story to life \u2014 optional but recommended",
    emoji: "\uD83D\uDCF7", key: "userPhoto", type: "photo",
  },
  {
    id: 4,
    title: "What kind of universe should your story live in?",
    subtitle: "Choose the world of your story",
    emoji: "\uD83C\uDF0D", key: "storyWorld", type: "select-card", options: [...STORY_WORLDS],
  },
  {
    id: 5,
    title: "What should the story feel like?",
    subtitle: "Choose the tone",
    emoji: "\uD83C\uDFAD", key: "tone", type: "select-card", options: [...STORY_TONES],
  },
  {
    id: 6,
    title: "Tell me the memory that time should never erase.",
    subtitle: "Your favorite memory together",
    emoji: "\uD83D\uDCDB", key: "favoriteMemory", type: "textarea",
    placeholder: "Describe a moment you'll always treasure...",
  },
  {
    id: 7,
    title: "What little things make your partner unforgettable?",
    subtitle: "Habits, personality, cute things, inside jokes...",
    emoji: "\uD83D\uDC95", key: "habits", type: "textarea",
    placeholder: "The way they laugh, their quirks, the things only you notice...",
  },
  {
    id: 8,
    title: "What promise should live forever in this story?",
    subtitle: "Your promise or final message to them",
    emoji: "\uD83E\uDEAA", key: "promise", type: "textarea",
    placeholder: "What do you want to promise them forever?",
  },
]

export default function OnboardingFlow({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<StoryData>({ ...DEFAULT_STORY })
  const [direction, setDirection] = useState(1)
  const [revealed, setRevealed] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoTarget, setPhotoTarget] = useState<"userPhoto" | "partnerPhoto" | null>(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  const current = QUESTIONS[step]
  const worldPreview = current.key === "storyWorld"
  const selectedWorld = current.key === "storyWorld" ? (data.storyWorld as string) : null
  const worldVis = selectedWorld ? WORLD_VISUALS[selectedWorld] ?? WORLD_VISUALS["Classic Romance"] : null

  useEffect(() => {
    setRevealed(false)
    const t1 = setTimeout(() => setRevealed(true), 400)
    const t2 = setTimeout(() => { inputRef.current?.focus() }, 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step])

  const update = useCallback((key: keyof StoryData, value: string | null) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const next = useCallback(() => {
    if (step < QUESTIONS.length - 1) {
      setDirection(1)
      setStep((s) => s + 1)
    } else {
      onComplete(data)
    }
  }, [step, data, onComplete])

  const prev = useCallback(() => {
    if (step > 0) { setDirection(-1); setStep((s) => s - 1) }
  }, [step])

  const canProceed = () => {
    const val = data[current.key]
    if (current.type === "photo") return true
    if (current.type === "select-card") return val !== "" && val !== undefined && val !== null
    return typeof val === "string" && val.trim().length > 0
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && photoTarget) {
      const reader = new FileReader()
      reader.onload = (ev) => { update(photoTarget, ev.target?.result as string); setShowPhotoModal(false) }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05020a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_20%,rgba(255,107,138,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(120,80,255,0.05)_0%,transparent_50%)]" />
      </div>

      <button onClick={onBack} className="absolute left-4 top-4 z-20 rounded-full border border-white/10 p-2.5 text-white/30 transition-colors hover:border-white/30 hover:text-white/60">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
      </button>

      <div className="absolute left-0 top-0 z-10 h-0.5 w-full bg-white/5">
        <motion.div className="h-full" style={{ background: "linear-gradient(90deg, #be185d, #7c3aed)" }} initial={{ width: "0%" }} animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
      </div>

      <div className="absolute right-4 top-4 text-xs tracking-widest text-white/15">
        {String(step + 1).padStart(2, "0")}/{String(QUESTIONS.length).padStart(2, "0")}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex w-full max-w-md flex-col items-center px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: worldVis ? `radial-gradient(circle, ${worldVis.palette[0]}30, transparent)` : "radial-gradient(circle, rgba(255,107,138,0.15), transparent)",
              boxShadow: worldVis ? `0 0 40px ${worldVis.palette[0]}20` : "0 0 40px rgba(255,107,138,0.1)",
            }}
          >
            <span className="text-3xl">{current.emoji}</span>
          </motion.div>

          <AnimatePresence>
            {revealed && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-2 text-[10px] tracking-[0.2em] text-rose-400/30">
                {current.id === 1 ? "The scribe is listening..." :
                 current.id === 2 ? "The universe takes notes..." :
                 current.id === 3 ? "The gallery awaits..." :
                 current.id === 4 ? "A world takes shape..." :
                 current.id === 5 ? "The mood sets in..." :
                 current.id === 6 ? "A moment frozen in time..." :
                 current.id === 7 ? "The details emerge..." :
                 "The promise is sealed..."}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-display text-center text-2xl font-bold text-white sm:text-3xl">
            {current.title}
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-2 text-center text-sm text-white/35">
            {current.subtitle}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }} className="mt-8 w-full">
            {current.type === "text" && (
              <input ref={inputRef as React.Ref<HTMLInputElement>} type="text"
                value={String(data[current.key] || "")}
                onChange={(e) => update(current.key, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canProceed() && next()}
                placeholder={current.placeholder}
                className="w-full border-0 border-b bg-transparent px-2 py-3 text-center text-xl text-white outline-none transition-all placeholder:text-white/15 focus:border-rose-400/50"
                style={{ borderBottomColor: data[current.key] ? "rgba(255,107,138,0.3)" : "rgba(255,255,255,0.08)" }}
                autoFocus
              />
            )}

            {current.type === "textarea" && (
              <textarea ref={inputRef as React.Ref<HTMLTextAreaElement>}
                value={String(data[current.key] || "")}
                onChange={(e) => update(current.key, e.target.value)}
                placeholder={current.placeholder}
                rows={4}
                className="w-full resize-none border-0 border-b bg-transparent px-2 py-3 text-center text-lg text-white outline-none transition-all placeholder:text-white/15 focus:border-rose-400/50"
                style={{ borderBottomColor: data[current.key] ? "rgba(255,107,138,0.3)" : "rgba(255,255,255,0.08)" }}
                autoFocus
              />
            )}

            {current.type === "select-card" && (
              <div className="flex max-h-56 flex-wrap justify-center gap-2 overflow-y-auto px-2">
                {(current.options || []).map((opt) => {
                  const isSelected = data[current.key] === opt
                  const vis = worldPreview && selectedWorld ? WORLD_VISUALS[selectedWorld] : null
                  return (
                    <motion.button
                      key={opt}
                      onClick={() => { update(current.key, opt); setTimeout(next, 350) }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`group relative overflow-hidden rounded-xl border px-4 py-3 text-center text-sm font-medium transition-all ${
                        isSelected
                          ? "border-rose-400/50 text-white shadow-lg"
                          : "border-white/8 bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white/75"
                      }`}
                      style={isSelected ? {
                        background: vis ? `linear-gradient(135deg, ${vis.palette[0]}30, ${vis.palette[1]}20)` : "linear-gradient(135deg, rgba(190,24,93,0.25), rgba(124,58,237,0.2))",
                        boxShadow: vis ? `0 0 30px ${vis.palette[0]}20` : undefined,
                      } : undefined}
                    >
                      {opt}
                    </motion.button>
                  )
                })}
              </div>
            )}

            {current.type === "photo" && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  {(["userPhoto", "partnerPhoto"] as const).map((target) => {
                    const label = target === "userPhoto" ? (data.userName || "You") : (data.partnerName || "Partner")
                    const preview = data[target]
                    return (
                      <motion.button
                        key={target}
                        onClick={() => { setPhotoTarget(target); setShowPhotoModal(true) }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="group relative flex h-28 w-28 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all"
                        style={{ borderColor: preview ? "rgba(255,107,138,0.3)" : "rgba(255,255,255,0.08)" }}
                      >
                        {preview ? (
                          <img src={preview} alt={label} className="h-full w-full object-cover" />
                        ) : (
                          <>
                            <div className="mb-1 h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-xl opacity-40">\uD83D\uDC64</div>
                            <span className="text-[10px] text-white/30">{label}</span>
                          </>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
                          <span className="text-xs text-white">{preview ? "Change" : "Add photo"}</span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
                <p className="text-xs text-white/20">Photos are optional \u2014 beautiful silhouettes will be used instead</p>
              </div>
            )}
          </motion.div>

          <div className="mt-10 flex items-center gap-3">
            {step > 0 && (
              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={prev}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/40 transition-colors hover:border-white/25 hover:text-white/70">
                \u2190 Back
              </motion.button>
            )}
            {current.type !== "select-card" && (
              <motion.button
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                onClick={next} disabled={!canProceed()}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                  canProceed() ? "text-white shadow-lg" : "border border-white/10 text-white/25"
                }`}
                style={canProceed() ? { background: "linear-gradient(135deg, #be185d, #7c3aed)", boxShadow: "0 0 30px rgba(190,24,93,0.25)" } : undefined}
              >
                {step < QUESTIONS.length - 1 ? "Next \u2192" : "\u2728 Create My Story"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowPhotoModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-2xl border border-white/10 bg-[#0a0612] p-6 w-72" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-center text-base font-display text-white">Upload Photo</h3>
            <input ref={fileInputRef as React.Ref<HTMLInputElement>} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full rounded-xl px-4 py-3 text-sm text-white transition-all" style={{ background: "linear-gradient(135deg, #be185d, #7c3aed)" }}>
              Choose from device
            </button>
            <button onClick={() => { update(photoTarget!, null); setShowPhotoModal(false) }} className="mt-2 w-full py-2 text-sm text-white/30 hover:text-white/60 transition-colors">
              Skip \u2014 use silhouette
            </button>
          </motion.div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05020a] to-transparent" />
    </div>
  )
}
