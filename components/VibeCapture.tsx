"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";

const VIBE_EMOJIS = [
  { emoji: "🥰", label: "Loved" },
  { emoji: "😭", label: "Touched" },
  { emoji: "😂", label: "Hilarious" },
  { emoji: "😡", label: "Fired up" },
];

type VibeCaptureProps = {
  experienceId: string;
};

export function VibeCapture({ experienceId }: VibeCaptureProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = async (emoji: string) => {
    setSelected(emoji);
    setSending(true);
    try {
      await fetch(`/api/experiences/${experienceId}/vibe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibeEmoji: emoji, audioUrl: audioUrl || undefined }),
      });
    } catch {}
    setSending(false);
    setSent(true);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      chunks.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      recorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      setRecording(true);
      timerRef.current = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
        setRecording(false);
      }, 5000);
    } catch {
      // Microphone not available
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    setRecording(false);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[2rem] p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
          className="text-6xl mb-4"
        >
          ✨
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-white"
        >
          Your vibe was sent!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-white/50 mt-2"
        >
          {selected && <span className="text-2xl mr-2">{selected}</span>}
        </motion.p>
        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4"
          >
            <audio src={audioUrl} controls className="w-full max-w-[200px] mx-auto" />
          </motion.div>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-sm text-white/40"
        >
          <a
            href={`/create`}
            target="_blank"
            rel="noreferrer"
            className="text-blush underline underline-offset-4 hover:text-white transition-colors"
          >
            Make your own message
          </a>
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.3 }}
      className="glass rounded-[2rem] p-6 space-y-5"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-lg font-bold text-white"
      >
        How did this make you feel?
      </motion.p>

      <div className="flex justify-center gap-3">
        {VIBE_EMOJIS.map((item, i) => (
          <motion.button
            key={item.emoji}
            type="button"
            onClick={() => handleSelect(item.emoji)}
            disabled={sending}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, type: "spring", bounce: 0.4 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border px-5 py-4 text-3xl transition-all duration-200 ${
              selected === item.emoji
                ? "border-white/40 bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                : "border-white/10 bg-white/[0.04] opacity-80 hover:opacity-100 hover:border-white/25"
            }`}
            aria-label={item.label}
          >
            <motion.span
              animate={selected === item.emoji ? { rotate: [0, -10, 10, -5, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {item.emoji}
            </motion.span>
            <span className="text-[10px] font-bold text-white/40">{item.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-white/30 mb-2">Or record a 5-second audio note</p>
        <motion.button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            recording
              ? "bg-red-500/20 text-red-300 animate-pulse"
              : "border border-white/15 bg-white/10 text-white/70 hover:bg-white/15"
          }`}
        >
          <span className="text-lg">{recording ? "⏹" : "🎤"}</span>
          {recording ? "Recording... tap to stop" : audioUrl ? "Re-record" : "Record audio"}
        </motion.button>
        {audioUrl && !recording && (
          <div className="mt-3 flex justify-center">
            <audio src={audioUrl} controls className="w-full max-w-[200px]" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
