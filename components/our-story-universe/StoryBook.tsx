"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StoryData, GeneratedChapter, WORLD_VISUALS } from "./types"
import { generateStory, generateChoiceText } from "./StoryEngine"

interface Props {
  data: StoryData
  onComplete: () => void
  onEdit: () => void
}

const EASTER_EGGS = [
  { id: "moon", message: "Under this same moon, I fell in love with you." },
  { id: "photo", message: "I remember this moment like it was yesterday." },
  { id: "heart", message: "In every universe, I'd find you again." },
  { id: "cover", message: "Cosmos Edition Unlocked" },
]

export default function StoryBook({ data, onComplete, onEdit }: Props) {
  const [chapters, setChapters] = useState<GeneratedChapter[] | null>(null)
  const [foundEggs, setFoundEggs] = useState<string[]>([])
  const [eggMsg, setEggMsg] = useState<string | null>(null)
  const [choiceIdx, setChoiceIdx] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const world = WORLD_VISUALS[data.storyWorld] ?? WORLD_VISUALS["Classic Romance"]

  useEffect(() => { setChapters(generateStory(data)) }, []) // eslint-disable-line

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? el.scrollTop / max : 0)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  const showEgg = useCallback((id: string) => {
    if (foundEggs.includes(id)) return
    setFoundEggs((p) => [...p, id])
    const def = EASTER_EGGS.find((d) => d.id === id)
    if (def) { setEggMsg(def.message); setTimeout(() => setEggMsg(null), 3000) }
  }, [foundEggs])

  if (!chapters) return <div className="h-dvh bg-[#0a0a0a]" />

  return (
    <div className="relative h-dvh overflow-hidden select-none" style={{ background: "#0a0a0a" }}>
      {/* Top bar — minimal */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 h-12">
        <button onClick={onEdit} className="text-white/20 hover:text-white/50 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <span className="text-[11px] text-white/15 font-mono tracking-widest">{Math.round(progress * 100)}%</span>
      </div>

      {/* Progress bar — thin line at top */}
      <div className="absolute top-12 left-0 right-0 z-30 h-[1px] bg-white/5">
        <div className="h-full transition-all duration-150"
          style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${world.palette[0]}, ${world.palette[2]})` }} />
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="h-full overflow-y-auto pt-16 pb-24 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style>{`.scrollable::-webkit-scrollbar { display: none; }`}</style>

        <div className="max-w-[680px] mx-auto px-6 sm:px-10">

          {/* ===== COVER ===== */}
          <section className="min-h-[80vh] flex flex-col items-center justify-center text-center py-16">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: world.palette[0], opacity: 0.3 }}>{data.storyWorld}</p>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3" style={{ color: "#fff" }}>
                {data.userName}
                <br />
                <span style={{ color: world.palette[0] }}>&</span>
                <br />
                {data.partnerName}
              </h1>
              <p className="font-serif text-base sm:text-lg italic mt-4" style={{ color: world.palette[0], opacity: 0.4 }}>
                A {data.tone.toLowerCase()} {data.storyWorld.toLowerCase()} story
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="h-[1px] w-12" style={{ background: `linear-gradient(90deg, transparent, ${world.palette[0]}40)` }} />
                <span className="text-lg" style={{ color: world.palette[2] }}>✦</span>
                <div className="h-[1px] w-12" style={{ background: `linear-gradient(90deg, ${world.palette[0]}40, transparent)` }} />
              </div>
              <button onClick={() => showEgg("cover")}
                className="mt-10 text-xs tracking-[0.2em] uppercase border border-white/10 rounded-full px-6 py-2.5 text-white/30 hover:text-white/60 hover:border-white/25 transition-all">
                Begin Reading
              </button>
            </motion.div>
          </section>

          {/* ===== CHAPTERS ===== */}
          {chapters.slice(1).map((chapter, i) => {
            const idx = i + 1
            const isDedication = idx === 1
            const chapterNum = idx

            return (
              <div key={idx} className="mb-16 sm:mb-24">
                {/* Chapter header */}
                <div className="mb-10 text-center">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: world.palette[0], opacity: 0.25 }}>
                    {chapter.chapter}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mt-2" style={{ color: "#fff" }}>
                    {chapter.title}
                  </h2>
                  <div className="mx-auto mt-4 h-[1px] w-16" style={{ background: `linear-gradient(90deg, transparent, ${world.palette[0]}30, transparent)` }} />
                </div>

                {isDedication ? (
                  <div className="text-center max-w-lg mx-auto py-10">
                    <div className="text-4xl mb-6">💌</div>
                    <p className="font-serif text-base sm:text-lg italic leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {chapter.text}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Scene / illustration area */}
                    <div className="mb-8 py-8 flex flex-col items-center justify-center rounded-sm"
                      style={{ background: `linear-gradient(135deg, ${world.palette[0]}08, ${world.palette[1]}05)` }}>
                      {chapterNum === 2 && (
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full border flex items-center justify-center text-2xl"
                            style={{ borderColor: `${world.palette[0]}20` }}>
                            {data.userPhoto ? <img src={data.userPhoto} className="h-full w-full rounded-full object-cover" /> : "👤"}
                          </div>
                          <span className="text-lg opacity-20" style={{ color: world.palette[0] }}>✦</span>
                          <div className="h-14 w-14 rounded-full border flex items-center justify-center text-2xl"
                            style={{ borderColor: `${world.palette[0]}20` }}>
                            {data.partnerPhoto ? <img src={data.partnerPhoto} className="h-full w-full rounded-full object-cover" /> : "👤"}
                          </div>
                        </div>
                      )}
                      {chapterNum === 3 && <span className="text-4xl opacity-60">✨</span>}
                      {chapterNum === 4 && <span className="text-4xl opacity-60">💖</span>}
                      {chapterNum === 5 && <span className="text-4xl opacity-60">💎</span>}
                      {chapterNum === 6 && <span className="text-4xl opacity-60">🤝</span>}
                      {chapterNum === 7 && <span className="text-4xl opacity-60">🌌</span>}
                      <p className="mt-3 text-xs italic font-serif text-center max-w-xs px-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {chapter.scene}
                      </p>
                      <button onClick={() => showEgg("moon")}
                        className="mt-3 text-sm opacity-20 hover:opacity-40 transition-opacity">🌙</button>
                    </div>

                    {/* Story text — novel style */}
                    <div className="font-serif text-[15px] sm:text-[17px] leading-[1.85] space-y-5"
                      style={{ color: "rgba(255,255,255,0.75)" }}>
                      {chapter.text.split("\n").map((paragraph, pi) => (
                        paragraph.trim() ? (
                          <p key={pi} className={idx === 2 && pi === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-white" : ""}>
                            {paragraph}
                          </p>
                        ) : null
                      ))}
                    </div>

                    {/* Choice for chapter 1 (idx=2) */}
                    {chapterNum === 2 && (
                      <div className="mt-10 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <p className="text-[10px] tracking-[0.2em] uppercase mb-4 font-mono" style={{ color: world.palette[0], opacity: 0.3 }}>
                          The path splits under the moonlight. What should they do?
                        </p>
                        <div className="space-y-2">
                          {["Hold hands and walk ahead", "Stop and talk under the stars", "Run laughing into the rain"].map((opt, ci) => (
                            <button key={ci} onClick={() => setChoiceIdx(ci)}
                              className="w-full text-left px-4 py-3 rounded text-sm font-serif transition-all"
                              style={{
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: choiceIdx === ci ? "#fff" : "rgba(255,255,255,0.4)",
                                background: choiceIdx === ci ? `${world.palette[0]}20` : "transparent",
                              }}>
                              {opt}
                            </button>
                          ))}
                        </div>
                        {choiceIdx !== null && (
                          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-sm italic leading-relaxed font-serif" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {generateChoiceText(data, choiceIdx)}
                          </motion.p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}

          {/* ===== THE END ===== */}
          <div className="text-center py-16 sm:py-20">
            <div className="mx-auto mb-6 h-[1px] w-16" style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` }} />
            <p className="font-serif text-base italic" style={{ color: "rgba(255,255,255,0.3)" }}>— The End —</p>
            <p className="font-serif text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>
              {data.userName} ✦ {data.partnerName} ✦ {data.storyWorld}
            </p>
            <div className="mx-auto mt-6 h-[1px] w-16" style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` }} />
            <button onClick={onComplete}
              className="mt-10 text-xs tracking-[0.2em] uppercase border border-white/10 rounded-full px-8 py-3 text-white/30 hover:text-white/60 hover:border-white/25 transition-all">
              Close the Book
            </button>
          </div>

        </div>
      </div>

      {/* Easter egg toast */}
      <AnimatePresence>
        {eggMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="fixed left-1/2 top-16 z-50 -translate-x-1/2 px-5 py-2.5 rounded text-sm font-serif italic backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.06)", color: world.palette[0], border: "1px solid rgba(255,255,255,0.06)" }}>
            ✦ {eggMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
