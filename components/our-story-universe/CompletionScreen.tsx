"use client"

import { motion } from "framer-motion"
import { StoryData, WORLD_VISUALS } from "./types"

interface Props {
  data: StoryData
  onRestart: () => void
  onEdit: () => void
}

const LOCKED_BOOKS = [
  { title: "Our Manga Version", emoji: "📖", desc: "See your story as manga panels" },
  { title: "Our Comedy Version", emoji: "😂", desc: "The hilarious retelling" },
  { title: "Our Royal Story", emoji: "👑", desc: "A tale of kings and queens" },
  { title: "Our Future", emoji: "🔮", desc: "What lies ahead" },
  { title: "What If We Never Met?", emoji: "🌊", desc: "The alternate timeline" },
  { title: "Our Time Travel", emoji: "⏳", desc: "Every era, rewritten" },
]

export default function CompletionScreen({ data, onRestart, onEdit }: Props) {
  const world = WORLD_VISUALS[data.storyWorld] ?? WORLD_VISUALS["Classic Romance"]

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 bg-[#05020a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 40% 30%, ${world.palette[0]}08 0%, transparent 50%)`,
        }} />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 70% 80%, ${world.palette[1]}06 0%, transparent 50%)`,
        }} />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            background: world.palette[i % world.palette.length],
            opacity: 0.1 + Math.random() * 0.3,
            animation: `su-drift ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
          }} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Book closing */}
        <motion.div
          initial={{ scale: 0.8, rotateX: 20 }}
          animate={{ scale: 1, rotateX: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="relative mx-auto h-32 w-24 sm:h-40 sm:w-32">
            <div className="h-full w-full rounded-r-sm border" style={{
              borderColor: `${world.palette[0]}30`,
              background: `linear-gradient(135deg, ${world.palette[0]}30, ${world.palette[1]}20)`,
              boxShadow: `0 0 40px ${world.palette[0]}15`,
            }}>
              <div className="flex h-full flex-col items-center justify-center p-3 text-center">
                <span className="text-2xl mb-1">📖</span>
                <p className="text-[9px] font-bold text-white/80">{data.userName}</p>
                <p className="text-[8px] text-rose-300/40">&</p>
                <p className="text-[9px] font-bold text-white/80">{data.partnerName}</p>
              </div>
            </div>
            <div className="absolute -left-[3px] top-0 h-full w-[6px] rounded-l-sm" style={{
              background: `linear-gradient(180deg, ${world.palette[0]}40, ${world.palette[1]}30)`,
            }} />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-display text-center text-2xl font-bold text-white"
        >
          This story is only
          <br />
          <span className="bg-gradient-to-r from-rose-300 to-purple-300 bg-clip-text text-transparent">
            one universe.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-2 text-sm text-white/35"
        >
          What other stories await?
        </motion.p>

        {/* Locked books grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-8 grid grid-cols-3 gap-3 sm:gap-4"
        >
          {LOCKED_BOOKS.map((book, i) => (
            <motion.div
              key={book.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.12, duration: 0.4 }}
              className="group relative cursor-not-allowed rounded-2xl border border-white/5 bg-white/[0.015] p-3 text-center transition-all hover:border-white/12 sm:p-4"
            >
              <div className="text-2xl opacity-25 sm:text-3xl">{book.emoji}</div>
              <p className="mt-1 text-[9px] font-medium text-white/25 sm:text-[10px]">{book.title}</p>
              <p className="mt-0.5 text-[7px] text-white/12 sm:text-[8px]">{book.desc}</p>
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]">
                <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] text-white/50">
                  🔒
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <div className="flex gap-3">
            <button onClick={onEdit}
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/50 transition-colors hover:border-white/25 hover:text-white/80">
              Edit Story
            </button>
            <button onClick={onRestart}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${world.palette[0]}, ${world.palette[1]})`,
                boxShadow: `0 0 30px ${world.palette[0]}20`,
              }}
            >
              Create New ✨
            </button>
          </div>

          <p className="mt-4 text-[10px] tracking-[0.15em] text-white/12 text-center">
            {data.userName} ✦ {data.partnerName} ✦ {data.storyWorld}
          </p>

          {data.promise && (
            <p className="max-w-xs text-center text-[11px] leading-relaxed text-white/15">
              "{data.promise}"
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
