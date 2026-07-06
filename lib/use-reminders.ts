"use client";

import { useCallback, useEffect, useState } from "react";

export type Reminder = {
  id: string;
  type: "birthday" | "anniversary" | "custom";
  label: string;
  date: string;
  personName: string;
  notifyDaysBefore: number;
  createdAt: string;
};

const STORAGE_KEY = "reminders";

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored) as Reminder[];
      } catch { /* ignore */ }
    }
    return [];
  });
  const [upcoming, setUpcoming] = useState<Reminder[]>([]);

  useEffect(() => {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingList = reminders.filter((r) => {
      const [month, day] = r.date.split("-").map(Number);
      const eventDate = new Date(now.getFullYear(), month - 1, day);
      if (eventDate < now) eventDate.setFullYear(eventDate.getFullYear() + 1);
      return eventDate >= now && eventDate <= in7Days;
    });

    setUpcoming(upcomingList);
  }, [reminders]);

  const persist = useCallback((items: Reminder[]) => {
    setReminders(items);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, []);

  const addReminder = useCallback((reminder: Omit<Reminder, "id" | "createdAt">) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID?.()?.slice(0, 8) || `${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    persist([...reminders, newReminder]);
    return newReminder;
  }, [reminders, persist]);

  const removeReminder = useCallback((id: string) => {
    persist(reminders.filter((r) => r.id !== id));
  }, [reminders, persist]);

  const clearReminders = useCallback(() => persist([]), [persist]);

  return { reminders, upcoming, addReminder, removeReminder, clearReminders, count: reminders.length };
}
