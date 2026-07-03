"use client";

import { useState } from "react";
import Link from "next/link";
import { useReminders, type Reminder } from "@/lib/use-reminders";
import { ReminderForm } from "@/components/ReminderForm";

export default function RemindersPage() {
  const { reminders, upcoming, addReminder, removeReminder, clearReminders } = useReminders();
  const [showForm, setShowForm] = useState(false);

  const reminderEmoji: Record<Reminder["type"], string> = {
    birthday: "🎂",
    anniversary: "💍",
    custom: "✨",
  };

  return (
    <div className="space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Reminders</p>
        <h1 className="display-title mt-3 text-4xl font-bold sm:text-6xl">Occasion reminders</h1>
        <p className="mt-4 max-w-3xl text-white/70">Never forget a birthday or anniversary again. Add important dates and we&apos;ll remind you before they arrive.</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={() => setShowForm(!showForm)} className="premium-button">
            {showForm ? "Close form" : "Add reminder"}
          </button>
        </div>
      </section>

      {showForm && (
        <ReminderForm
          onAdd={addReminder}
          onClose={() => setShowForm(false)}
        />
      )}

      {upcoming.length > 0 && (
        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-xl font-bold text-white">Upcoming in 7 days</h2>
          <div className="mt-4 space-y-3">
            {upcoming.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-[1.4rem] border border-yellow-400/30 bg-yellow-400/10 p-4">
                <div>
                  <p className="font-bold text-white">{reminderEmoji[r.type]} {r.label}</p>
                  <p className="text-sm text-white/60">{r.date} (notify {r.notifyDaysBefore} days before)</p>
                </div>
                <Link className="text-sm font-bold text-yellow-300 hover:text-yellow-200 transition" href={`/create?reminder=${r.id}`}>Create message →</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {reminders.length === 0 ? (
        <div className="glass rounded-[2rem] p-8 text-center">
          <p className="text-white/50">No reminders yet. Add a birthday or anniversary to get started.</p>
        </div>
      ) : (
        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">All reminders ({reminders.length})</h2>
            <button type="button" onClick={clearReminders} className="text-sm font-bold text-rose-400/60 hover:text-rose-400 transition">Clear all</button>
          </div>
          <div className="space-y-3">
            {reminders.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-[1.4rem] border border-white/15 bg-white/10 p-4">
                <div>
                  <p className="font-bold text-white">{reminderEmoji[r.type]} {r.label}</p>
                  <p className="text-sm text-white/50">Date: {r.date} · Notify {r.notifyDaysBefore}d before</p>
                </div>
                <div className="flex gap-2">
                  <Link className="text-sm font-bold text-white/50 hover:text-white/80 transition" href={`/create?reminder=${r.id}`}>Create →</Link>
                  <button type="button" onClick={() => removeReminder(r.id)} className="text-sm font-bold text-rose-400/50 hover:text-rose-400 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-wrap justify-center gap-3">
        <Link className="ghost-button" href="/create">Create a message</Link>
        <Link className="ghost-button" href="/explore">Explore</Link>
      </section>
    </div>
  );
}
