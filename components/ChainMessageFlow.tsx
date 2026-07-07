"use client";

import { useEffect, useState } from "react";
import type { ChainContribution, ExperienceRecord } from "@/lib/types";

type Props = {
  experience: ExperienceRecord;
  onComplete: () => void;
};

export function ChainMessageFlow({ experience, onComplete }: Props) {
  const [contributions, setContributions] = useState<ChainContribution[]>([]);
  const [contributorName, setContributorName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [celebrating, setCelebrating] = useState(false);

  const chainTarget = experience.chainTarget ?? 2;

  useEffect(() => {
    void loadContributions();
  }, [experience.id]);

  async function loadContributions() {
    try {
      const res = await fetch(`/api/experiences/${experience.id}/chain`);
      const json = await res.json() as { contributions?: ChainContribution[] };
      if (json.contributions) setContributions(json.contributions);
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (experience.chainCompleted) {
      setCelebrating(true);
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [experience.chainCompleted, onComplete]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/experiences/${experience.id}/chain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contributorName: contributorName || "Someone", message: message.trim(), contributionType: "text" }),
      });
      const json = await res.json() as { ok?: boolean; isComplete?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "Failed to add contribution.");
        return;
      }
      setMessage("");
      await loadContributions();
      if (json.isComplete) {
        setCelebrating(true);
        setTimeout(onComplete, 2500);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  if (celebrating) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center px-4">
        <div className="glass rounded-[2rem] p-8 sm:p-12 max-w-md">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-white">Chain Complete!</h2>
          <p className="mt-3 text-white/60">
            All {contributions.length} contributions are in. Revealing the message...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="glass rounded-[2rem] p-6 sm:p-8 text-center">
        <p className="text-4xl mb-3">⛓️</p>
        <h2 className="text-xl font-bold text-white">This is a group message!</h2>
        <p className="mt-2 text-white/60">
          {contributions.length}/{chainTarget} people have contributed so far.
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blush to-violet transition-all duration-500"
            style={{ width: `${Math.min((contributions.length / chainTarget) * 100, 100)}%` }}
          />
        </div>
      </div>

      {contributions.length > 0 && (
        <div className="mt-8 space-y-4">
          {contributions.map((c) => (
            <div key={c.id} className="glass rounded-2xl p-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blush to-violet text-sm font-bold text-white">
                {c.contributorName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">{c.contributorName}</p>
                <p className="mt-1 text-sm text-white/70 break-words">{c.message}</p>
                <p className="mt-1 text-[10px] text-white/30">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {contributions.length < chainTarget && (
        <form onSubmit={handleSubmit} className="mt-8 glass rounded-[2rem] p-6 sm:p-8 space-y-4">
          <p className="text-sm font-bold text-white/70">Add your contribution</p>
          {error && <p className="text-sm font-bold text-rose-300">{error}</p>}
          <input
            value={contributorName}
            onChange={(e) => setContributorName(e.target.value)}
            className="input"
            placeholder="Your name (optional)"
            maxLength={80}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input min-h-24 py-3"
            placeholder="Add your piece of the message..."
            maxLength={1000}
          />
          <button type="submit" disabled={sending || !message.trim()} className="premium-button w-full">
            {sending ? "Sending..." : `Contribute (${contributions.length + 1}/${chainTarget})`}
          </button>
        </form>
      )}
    </div>
  );
}
