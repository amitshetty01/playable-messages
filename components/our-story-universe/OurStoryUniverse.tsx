"use client"

import { useState, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { AppStep, StoryData } from "./types"
import StoryBook from "./StoryBook"
import CompletionScreen from "./CompletionScreen"
import EditorModal from "./EditorModal"

const SAMPLE_DATA: StoryData = {
  userName: "Aria",
  partnerName: "Liam",
  userPhoto: null,
  partnerPhoto: null,
  storyWorld: "Classic Romance",
  tone: "Romantic",
  favoriteMemory: "The night we danced in the rain, laughing like the world belonged to us. Streetlights flickered, music from a distant cafe, and your eyes — they held entire galaxies that night.",
  habits: "The way you hum while making coffee, the sticky notes you leave on the mirror, how you talk to plants like they're old friends. You fall asleep during movies but wake up at the end to ask what happened. You laugh at things only you understand, and I want to understand them all.",
  promise: "In every timeline, every universe, every lifetime — I will find you. And I will choose you. Over and over, endlessly.",
  finalMessage: "",
  musicOn: true,
  animationIntensity: "high",
}

export default function OurStoryUniverse() {
  const [step, setStep] = useState<AppStep>("storybook")
  const [data, setData] = useState<StoryData>(SAMPLE_DATA)
  const [showEditor, setShowEditor] = useState(false)

  const handleStoryComplete = useCallback(() => { setStep("completion") }, [])

  const handleRestart = useCallback(() => {
    setData({ ...SAMPLE_DATA })
    setStep("storybook")
  }, [])

  const handleEdit = useCallback(() => { setShowEditor(true) }, [])

  const handleSaveEdit = useCallback((updated: StoryData) => {
    setData(updated)
    setShowEditor(false)
  }, [])

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {step === "storybook" && <StoryBook key="storybook" data={data} onComplete={handleStoryComplete} onEdit={handleEdit} />}
        {step === "completion" && <CompletionScreen key="completion" data={data} onRestart={handleRestart} onEdit={handleEdit} />}
      </AnimatePresence>
      {showEditor && <EditorModal data={data} onSave={handleSaveEdit} onClose={() => setShowEditor(false)} />}
    </div>
  )
}
