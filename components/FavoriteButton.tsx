"use client";

import { useFavorites } from "@/lib/use-favorites";

type FavoriteButtonProps = {
  id: string;
  className?: string;
};

export function FavoriteButton({ id, className = "" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(id)}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
        active
          ? "border-pink-400/40 bg-pink-400/20 text-pink-300"
          : "border-white/15 bg-white/10 text-white/50 hover:bg-white/15 hover:text-white/70"
      } ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {active ? "Saved" : "Save"}
    </button>
  );
}
