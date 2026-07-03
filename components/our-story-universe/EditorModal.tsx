"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { StoryData, STORY_WORLDS, STORY_TONES } from "./types"

interface Props {
  data: StoryData
  onSave: (data: StoryData) => void
  onClose: () => void
}

export default function EditorModal({ data, onSave, onClose }: Props) {
  const [local, setLocal] = useState<StoryData>({ ...data })

  const update = (key: keyof StoryData, value: string | null | boolean) => {
    setLocal((prev) => ({ ...prev, [key]: value }))
  }

  const sections: { title: string; fields: { label: string; key: keyof StoryData; type: string; options?: string[] }[] }[] = [
    {
      title: "Names & Photos",
      fields: [
        { label: "Your Name", key: "userName", type: "text" },
        { label: "Partner's Name", key: "partnerName", type: "text" },
      ],
    },
    {
      title: "Story World & Tone",
      fields: [
        { label: "World", key: "storyWorld", type: "select", options: STORY_WORLDS },
        { label: "Tone", key: "tone", type: "select", options: STORY_TONES },
      ],
    },
    {
      title: "Your Story",
      fields: [
        { label: "Favorite Memory", key: "favoriteMemory", type: "textarea" },
        { label: "Habits & Quirks", key: "habits", type: "textarea" },
        { label: "Your Promise", key: "promise", type: "textarea" },
      ],
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-[#05020a] p-6 sm:rounded-3xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">Edit Your Story</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/25">{section.title}</h3>
            <div className="space-y-3">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-[11px] text-white/30">{field.label}</label>
                  {field.type === "select" ? (
                    <div className="flex flex-wrap gap-1.5">
                      {(field.options ?? []).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => update(field.key, opt)}
                          className={`rounded-full border px-3 py-1 text-[11px] transition-all ${
                            local[field.key] === opt
                              ? "border-rose-400/40 bg-rose-500/15 text-white"
                              : "border-white/10 text-white/35 hover:border-white/25 hover:text-white/65"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={String(local[field.key] || "")}
                      onChange={(e) => update(field.key, e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/15 focus:border-rose-400/30"
                    />
                  ) : (
                    <input
                      type="text"
                      value={String(local[field.key] || "")}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/15 focus:border-rose-400/30"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => onSave(local)}
          className="w-full rounded-xl py-3 text-sm font-medium text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #be185d, #7c3aed)",
            boxShadow: "0 0 30px rgba(190,24,93,0.2)",
          }}
        >
          Save Changes ✨
        </button>
      </motion.div>
    </div>
  )
}
