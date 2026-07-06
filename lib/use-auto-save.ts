"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAutoSave<T>(
  key: string,
  data: T,
  enabled: boolean = true,
  debounceMs: number = 1000
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [syncedVersion, setSyncedVersion] = useState(0);

  const save = useCallback(() => {
    if (!enabled) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
      setSyncedVersion((v) => v + 1);
    } catch {}
  }, [key, data, enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [save, debounceMs, enabled]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key) setSyncedVersion((v) => v + 1);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  const loadSaved = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored) as T;
    } catch {}
    return null;
  }, [key]);

  const clearSaved = useCallback(() => {
    try { localStorage.removeItem(key); } catch {}
  }, [key]);

  return { save, loadSaved, clearSaved, syncedVersion };
}
