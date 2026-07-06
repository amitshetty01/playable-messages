"use client";

import { useCallback, useEffect, useState } from "react";

export function useFavorites(storageKey: string = "favorites") {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) return JSON.parse(stored) as string[];
      } catch { /* ignore */ }
    }
    return [];
  });

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === storageKey) {
        try {
          if (e.newValue) setFavorites(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [storageKey]);

  const persist = useCallback((items: string[]) => {
    setFavorites(items);
    try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch {}
  }, [storageKey]);

  const toggleFavorite = useCallback((id: string) => {
    persist(
      favorites.includes(id)
        ? favorites.filter((f) => f !== id)
        : [...favorites, id]
    );
  }, [favorites, persist]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const clearFavorites = useCallback(() => persist([]), [persist]);

  return { favorites, toggleFavorite, isFavorite, clearFavorites, count: favorites.length };
}
