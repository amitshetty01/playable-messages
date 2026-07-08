"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const PLACEHOLDERS = [
  "e.g., I want to confess to my best friend that I love her...",
  "e.g., I need to apologize to my partner for forgetting our anniversary...",
  "e.g., I want to create a birthday surprise for my mom...",
  "e.g., I want to tell my long-distance girlfriend how much she means to me...",
  "e.g., I want to propose in a fun, interactive way...",
];

const VIBES = [
  { emoji: "❤️", label: "Confession", prompt: "I want to confess my feelings to someone I love" },
  { emoji: "🎂", label: "Birthday", prompt: "I want to create a birthday surprise" },
  { emoji: "🙏", label: "Apology", prompt: "I need to apologize and make things right" },
  { emoji: "💍", label: "Anniversary", prompt: "I want to celebrate our anniversary" },
  { emoji: "🤝", label: "Friendship", prompt: "I want to tell my friend how much they mean to me" },
  { emoji: "😄", label: "Funny", prompt: "I want to make them laugh with a fun interactive message" },
];

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

type Props = {
  onGenerate: (prompt: string) => void;
  loading?: boolean;
};

export function AIHeroSection({ onGenerate, loading }: Props) {
  const [prompt, setPrompt] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Rotating placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Voice recognition
  const handleVoice = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      const transcript = Array.from({ length: results.length }, (_, i) => results[i][0].transcript).join("");
      setPrompt((prev) => prev + transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording]);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim() || loading) return;
    onGenerate(prompt.trim());
  }, [prompt, loading, onGenerate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleVibeClick = useCallback((vibePrompt: string) => {
    setPrompt(vibePrompt);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSurprise = useCallback(() => {
    onGenerate("surprise_me");
  }, [onGenerate]);

  return (
    <section className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 pt-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-violet/15 via-blush/10 to-transparent blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl text-center"
      >
        {/* Headline */}
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          What do you want them to{" "}
          <span className="bg-gradient-to-r from-blush via-violet to-neon bg-clip-text text-transparent">
            feel
          </span>{" "}
          today?
        </h1>
        <p className="mt-4 text-base text-white/50 sm:text-lg">
          Describe your idea, and AI will craft a beautiful interactive experience in seconds.
        </p>

        {/* Input area */}
        <div className="mx-auto mt-8 w-full max-w-xl">
          <div className="group relative rounded-3xl border border-white/20 bg-white/[0.04] backdrop-blur-xl transition-all duration-300 focus-within:border-violet/50 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_40px_rgba(139,92,246,0.15)]">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              rows={2}
              maxLength={500}
              className="input min-h-[60px] w-full resize-none border-0 bg-transparent py-5 pl-6 pr-14 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-0"
              style={{ boxShadow: "none" }}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
              {/* Voice button */}
              <button
                type="button"
                onClick={handleVoice}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  isRecording
                    ? "bg-rose-500/30 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    : "text-white/40 hover:bg-white/10 hover:text-white/70"
                }`}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? (
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-rose-500" />
                  </span>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Create + Surprise Me */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!prompt.trim() || loading}
              whileTap={{ scale: 0.97 }}
              className="premium-button flex items-center gap-2 px-8 py-3 text-sm disabled:opacity-40"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" className="opacity-30" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" strokeDashoffset="-10" className="opacity-90" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  ✨ Create
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={handleSurprise}
              disabled={loading}
              className="ghost-button flex items-center gap-2 px-6 py-3 text-sm"
            >
              🎲 Surprise Me
            </button>
          </div>
        </div>

        {/* Escape Hatch: Vibe Shortcuts */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-white/40">Or let me choose a Vibe:</span>
          {VIBES.map((vibe) => (
            <button
              key={vibe.label}
              type="button"
              onClick={() => handleVibeClick(vibe.prompt)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80 active:scale-95"
            >
              {vibe.emoji} {vibe.label}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
