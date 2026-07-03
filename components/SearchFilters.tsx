"use client";

import { useMemo, useState } from "react";

export type FilterOption = {
  slug: string;
  label: string;
  emoji?: string;
};

type SearchFiltersProps = {
  placeholder?: string;
  filters: Record<string, FilterOption[]>;
  children: React.ReactNode;
  getSearchData?: (child: React.ReactNode) => string;
};

export function SearchFilters({ placeholder = "Search...", filters, children, getSearchData }: SearchFiltersProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, Set<string>>>({});

  const toggleFilter = (group: string, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      const set = new Set(next[group] || []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      if (set.size === 0) delete next[group];
      else next[group] = set;
      return next;
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setQuery("");
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || query.trim().length > 0;

  const childrenArray = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input pl-10"
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <svg className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        {query && (
          <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-white/50 hover:text-white" type="button" onClick={() => setQuery("")}>
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(([group, options]) => (
          <div key={group} className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.08em] text-white/30 uppercase">{group}</span>
            {options.map((option) => {
              const isActive = activeFilters[group]?.has(option.slug);
              return (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => toggleFilter(group, option.slug)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                  }`}
                >
                  {option.emoji && <span>{option.emoji}</span>}
                  {option.label}
                </button>
              );
            })}
          </div>
        ))}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-bold text-white/30 hover:text-white/60 transition"
          >
            Clear all
          </button>
        )}
      </div>

      {childrenArray.length === 0 ? (
        <p className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center text-white/60">Nothing found. Try different filters.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>
      )}
    </div>
  );
}
