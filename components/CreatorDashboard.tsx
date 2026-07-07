"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type JourneyEvent = {
  eventType: string;
  createdAt: string;
  metadata: Record<string, unknown>;
  durationMs: number | null;
};

const EVENT_ICONS: Record<string, string> = {
  experience_opened: "👀",
  experience_completed: "🎯",
  step_started: "📌",
  step_completed: "✅",
  game_interaction: "🕹️",
  selected_mood_choice: "💭",
  final_cta_clicked: "🔗",
  template_used: "📋",
};

const EVENT_LABELS: Record<string, string> = {
  experience_opened: "Opened the message",
  experience_completed: "Completed the experience",
  step_started: "Started a step",
  step_completed: "Completed a step",
  game_interaction: "Interacted",
  selected_mood_choice: "Made a choice",
  final_cta_clicked: "Clicked the CTA",
  template_used: "Template loaded",
};

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDuration(ms: number | null): string | null {
  if (ms === null || ms === undefined) return null;
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 1) return null;
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

function computeTotalDuration(events: JourneyEvent[]): string | null {
  const durations = events
    .map((e) => e.durationMs)
    .filter((d): d is number => d !== null);
  if (durations.length === 0) return null;
  const total = durations.reduce((a, b) => a + b, 0);
  return formatDuration(total) ?? null;
}

export function CreatorDashboard({ experienceId }: { experienceId: string }) {
  const [events, setEvents] = useState<JourneyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/experiences/${experienceId}/journey`)
      .then((r) => r.json())
      .then((data) => {
        if (data.events) setEvents(data.events as JourneyEvent[]);
        else setError(data.error ?? "Failed to load journey.");
      })
      .catch(() => setError("Failed to load journey."))
      .finally(() => setLoading(false));
  }, [experienceId]);

  if (loading) {
    return (
      <div className="flex min-h-[40dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-[2rem] p-8 text-center">
        <p className="text-rose-300">{error}</p>
      </div>
    );
  }

  const totalDuration = computeTotalDuration(events);

  return (
    <div className="space-y-6">
      <div className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Journey</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">
          Message journey
        </h1>
        <p className="mt-3 text-white/60">
          {events.length} event{events.length !== 1 ? "s" : ""} tracked
          {totalDuration ? <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">Total time: {totalDuration}</span> : null}
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-[23px] top-0 h-full w-px bg-gradient-to-b from-blush/40 via-violet/40 to-transparent" />

        <div className="space-y-3">
          {events.length === 0 && (
            <div className="glass rounded-[2rem] p-8 text-center">
              <p className="text-white/50">No events tracked yet. Share the link and wait for the recipient to open it.</p>
            </div>
          )}

          {events.map((event, i) => (
            <motion.div
              key={`${event.createdAt}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-14"
            >
              <div className="absolute left-[14px] top-4 z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-ink ring-2 ring-violet/50">
                <span className="text-[10px]">{EVENT_ICONS[event.eventType] ?? "📌"}</span>
              </div>

              <div className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">
                      {EVENT_LABELS[event.eventType] ?? event.eventType.replace(/_/g, " ")}
                    </p>
                    <p className="mt-0.5 text-xs text-white/40">
                      {formatRelativeTime(event.createdAt)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {event.durationMs !== null && event.durationMs !== undefined && (
                      <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-white/70">
                        Spent {formatDuration(event.durationMs)}
                      </span>
                    )}
                  </div>
                </div>

                {(event.metadata && Object.keys(event.metadata).length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(event.metadata).map(([key, val]) => (
                      <span key={key} className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/50">
                        {key}: {String(val)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
