"use client";

import { useState } from "react";
import type { Reminder } from "@/lib/use-reminders";

type ReminderFormProps = {
  onAdd: (reminder: Omit<Reminder, "id" | "createdAt">) => void;
  onClose: () => void;
};

export function ReminderForm({ onAdd, onClose }: ReminderFormProps) {
  const [type, setType] = useState<"birthday" | "anniversary" | "custom">("birthday");
  const [personName, setPersonName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [label, setLabel] = useState("");
  const [notifyDaysBefore, setNotifyDaysBefore] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !month || !day) return;
    const dateStr = `${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    onAdd({
      type,
      label: label || `${type === "birthday" ? "Birthday" : type === "anniversary" ? "Anniversary" : "Event"} — ${personName}`,
      date: dateStr,
      personName,
      notifyDaysBefore,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-5 sm:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Add reminder</h2>
        <button type="button" onClick={onClose} className="text-white/40 hover:text-white/70 text-sm font-bold">Close</button>
      </div>

      <div className="flex gap-2">
        {(["birthday", "anniversary", "custom"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              type === t ? "bg-white/20 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {t === "birthday" ? "🎂 Birthday" : t === "anniversary" ? "💍 Anniversary" : "✨ Custom"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-white/50 mb-1">Person&apos;s name</label>
          <input value={personName} onChange={(e) => setPersonName(e.target.value)} className="input" placeholder="Enter name" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-white/50 mb-1">Label (optional)</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} className="input" placeholder="e.g. Mom's birthday" />
        </div>
        <div>
          <label className="block text-xs font-bold text-white/50 mb-1">Month</label>
          <input value={month} onChange={(e) => setMonth(e.target.value.replace(/\D/g, "").slice(0, 2))} className="input" placeholder="MM" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-white/50 mb-1">Day</label>
          <input value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, "").slice(0, 2))} className="input" placeholder="DD" required />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-white/50 mb-1">Notify me</label>
        <select value={notifyDaysBefore} onChange={(e) => setNotifyDaysBefore(Number(e.target.value))} className="input">
          <option value={1}>1 day before</option>
          <option value={3}>3 days before</option>
          <option value={7}>7 days before</option>
          <option value={14}>14 days before</option>
        </select>
      </div>

      <button type="submit" className="premium-button w-full">Add reminder</button>
    </form>
  );
}
