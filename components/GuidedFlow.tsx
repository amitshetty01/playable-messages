"use client";

import { useState, useCallback } from "react";
import { pickTemplate } from "@/lib/pickTemplate";
import { ExperiencePreview } from "@/components/ExperiencePreview";
import { Spinner } from "@/components/Spinner";
import type { ExperienceRecord } from "@/lib/types";

type Step = "message" | "receiver" | "sender" | "confirm";

export function GuidedFlow() {
  const [step, setStep] = useState<Step>("message");
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const [sender, setSender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [experience, setExperience] = useState<ExperienceRecord | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: pickTemplate(message),
          finalMessage: message,
          creatorName: sender.trim() || "Someone",
          receiverName: receiver.trim() || "You",
          customMessages: { landingText: message.slice(0, 120), buttonText: "Open", steps: ["Here's something for you..."], ctaMessage: "Made with 💖" },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.id) { setError(json.error || "Could not generate."); return; }
      setExperience(json.experience);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }, [message, receiver, sender]);

  if (experience) {
    return <ExperiencePreview experience={experience} onClose={() => { setExperience(null); setStep("message"); setMessage(""); setReceiver(""); setSender(""); }} />;
  }

  const Bubble = ({ text, from }: { text: string; from: "bot" | "user" }) => (
    <div className={`flex ${from === "bot" ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-6 ${from === "bot" ? "rounded-bl-md bg-white/10 text-white/80" : "rounded-br-md bg-gradient-to-r from-[#ff6b9d] to-[#c44dff] text-white"}`}>
        {text}
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex max-w-lg flex-col">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        {step === "message" && (
          <>
            <Bubble text="👋 Hi! What do you want to say to them?" from="bot" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I've been meaning to tell you..."
              rows={3}
              aria-label="Your message"
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30"
              maxLength={520}
            />
            <button type="button" onClick={() => { if (message.trim()) setStep("receiver"); }} className="premium-button self-end disabled:opacity-40" disabled={!message.trim()}>Next →</button>
          </>
        )}

        {step === "receiver" && (
          <>
            <Bubble text="Love it! And who's this for? (name or nickname)" from="bot" />
            <input
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Their name"
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30"
              maxLength={80}
            />
            <div className="flex justify-between">
              <button type="button" className="ghost-button text-sm" onClick={() => setStep("message")}>← Back</button>
              <button type="button" className="premium-button text-sm" onClick={() => setStep("sender")}>Next →</button>
            </div>
          </>
        )}

        {step === "sender" && (
          <>
            <Bubble text="Perfect! And what's your name?" from="bot" />
            <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Your name"
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30"
              maxLength={80}
            />
            <div className="flex justify-between">
              <button type="button" className="ghost-button text-sm" onClick={() => setStep("receiver")}>← Back</button>
              <button type="button" className="premium-button text-sm" onClick={() => setStep("confirm")}>Next →</button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <Bubble text="Here's what I've got:" from="bot" />
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.06] p-4 text-sm">
              <p><span className="font-bold text-white/60">To:</span> {receiver || "You"}</p>
              <p><span className="font-bold text-white/60">From:</span> {sender || "Someone"}</p>
              <p><span className="font-bold text-white/60">Message:</span> {message}</p>
            </div>
            <Bubble text="Ready? Let's make it interactive." from="bot" />
            <div className="flex justify-between">
              <button type="button" className="ghost-button text-sm" onClick={() => setStep("sender")}>← Back</button>
              <button type="button" className="premium-button disabled:opacity-40" disabled={loading} onClick={generate}>
                {loading ? <span className="inline-flex items-center gap-2"><Spinner className="h-4 w-4" /> Generating...</span> : "Yes, generate →"}
              </button>
            </div>
            {error && <p className="rounded-2xl border border-rose-200/30 bg-rose-300/10 p-4 text-sm font-bold text-rose-100" role="alert">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
