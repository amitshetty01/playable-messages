"use client";

import { useCallback, useEffect, useState } from "react";

export function useFavorites(storageKey: string = "favorites") {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
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
