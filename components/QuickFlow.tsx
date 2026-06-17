"use client";

import { useState, useCallback } from "react";
import { pickTemplate } from "@/lib/pickTemplate";
import { ExperiencePreview } from "@/components/ExperiencePreview";
import { Spinner } from "@/components/Spinner";
import type { ExperienceRecord } from "@/lib/types";

const QUICK_TEMPLATES = [
  { emoji: "💖", label: "Love", template: "love-chase", hint: "I love the way you make me feel every single day." },
  { emoji: "💔", label: "Sorry", template: "the-last-deleted-message", hint: "I'm sorry for what I said. I didn't mean it." },
  { emoji: "😂", label: "Funny", template: "roast-to-respect", hint: "You're the most ridiculous person I know and I love it." },
  { emoji: "🤫", label: "Secret", template: "secret-letter", hint: "I've been keeping something from you for a while now..." },
  { emoji: "🎂", label: "Birthday", template: "birthday-surprise-journey", hint: "Happy birthday to the person who makes life brighter just by being in it." },
  { emoji: "🏆", label: "Roast", template: "dont-smile-challenge", hint: "I bet you can't read this without smiling. Ready to lose?" },
  { emoji: "💭", label: "Memory", template: "memory-journey", hint: "Remember that time we stayed up all night talking?" },
  { emoji: "🔥", label: "Mystery", template: "glitch-truth", hint: "There's something I've never told you before." },
];

export function QuickFlow() {
  const [text, setText] = useState("");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [experience, setExperience] = useState<ExperienceRecord | null>(null);

  const pick = useCallback((t: typeof QUICK_TEMPLATES[number]) => {
    setText(t.hint);
    setTemplateId(t.template);
  }, []);

  const generate = useCallback(async () => {
    const msg = text.trim();
    if (!msg) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: templateId || pickTemplate(msg),
          finalMessage: msg,
          showCreatorName: true,
          customMessages: { landingText: msg.slice(0, 120), buttonText: "Open", steps: ["Here's something for you..."], ctaMessage: "Made with 💖" },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.id) { setError(json.error || "Could not generate."); return; }
      setExperience(json.experience);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }, [text, templateId]);

  if (experience) {
    return <ExperiencePreview experience={experience} onClose={() => { setExperience(null); setText(""); setTemplateId(null); }} />;
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="display-title text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
        Turn your words into an <span className="bg-gradient-to-r from-blush to-neon bg-clip-text text-transparent">interactive experience</span>
      </h1>
      <p className="mt-4 max-w-lg text-lg text-white/60">
        Type your message, pick a style, and generate a link. The person you send it to plays through a beautifully designed interactive moment.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="I've been meaning to tell you..."
        rows={4}
        aria-label="Your message"
        className="w-full max-w-xl rounded-2xl border border-white/15 bg-white/8 px-5 py-4 text-center text-lg text-white placeholder-white/30 backdrop-blur-sm outline-none transition-all focus:border-white/30 focus:bg-white/12"
        maxLength={520}
      />

      <div className="mt-4 flex max-w-xl flex-wrap justify-center gap-2">
        {QUICK_TEMPLATES.map((t) => (
          <button
            key={t.template}
            type="button"
            onClick={() => pick(t)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              templateId === t.template
                ? "border-white/40 bg-white/15 text-white"
                : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:bg-white/[0.08] hover:text-white/70"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={loading || !text.trim()}
        onClick={generate}
        className="premium-button mt-6 min-w-[200px] disabled:opacity-40"
      >
        {loading ? <span className="inline-flex items-center gap-2"><Spinner className="h-4 w-4" /> Generating...</span> : "Create your link →"}
      </button>
      {error && <p className="mt-4 rounded-2xl border border-rose-200/30 bg-rose-300/10 px-5 py-3 text-sm font-bold text-rose-100" role="alert">{error}</p>}
    </div>
  );
}
