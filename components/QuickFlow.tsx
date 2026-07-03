"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import { pickTemplate } from "@/lib/pickTemplate";
import { ExperiencePreview } from "@/components/ExperiencePreview";
import { Spinner } from "@/components/Spinner";
import type { ExperienceRecord } from "@/lib/types";

export function QuickFlow() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [experience, setExperience] = useState<ExperienceRecord | null>(null);
  const { t } = useTranslation();

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
          templateId: pickTemplate(msg),
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
  }, [text]);

  if (experience) {
    return <ExperiencePreview experience={experience} onClose={() => { setExperience(null); setText(""); }} />;
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="display-title text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
        Send a message they can{" "}
        <span className="text-gradient">actually experience</span>
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What do you want them to discover?"
        rows={3}
        aria-label="Your message"
        className="mt-8 w-full max-w-xl rounded-2xl border border-white/15 bg-white/8 px-5 py-4 text-center text-lg text-white placeholder-white/30 backdrop-blur-sm outline-none transition-all focus:border-white/30 focus:bg-white/12"
        maxLength={520}
      />

      <button
        type="button"
        disabled={loading || !text.trim()}
        onClick={generate}
        className="premium-button mt-5 min-w-[200px] disabled:opacity-40"
      >
        {loading ? <span className="inline-flex items-center gap-2"><Spinner className="h-4 w-4" /> Generating...</span> : "Create my experience"}
      </button>
      {error && <p className="mt-4 rounded-2xl border border-rose-200/30 bg-rose-300/10 px-5 py-3 text-sm font-bold text-rose-100" role="alert">{error}</p>}
    </div>
  );
}
