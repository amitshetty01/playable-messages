"use client";

import { useMemo, useState, Children, isValidElement, cloneElement } from "react";

type SearchableChild = { props?: { "data-search"?: string } };

export function SearchableGrid({ children, placeholder = "Search..." }: { children: React.ReactNode; placeholder?: string }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return Children.toArray(children);
    return Children.toArray(children).filter((child) => {
      if (!isValidElement(child)) return true;
      const searchText = (child.props as Record<string, unknown>)["data-search"];
      if (typeof searchText === "string") return searchText.toLowerCase().includes(q);
      return true;
    });
  }, [children, query]);

  return (
    <div className="space-y-5">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input pl-10"
          placeholder={placeholder}
          aria-label="Search"
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
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center text-white/60">Nothing matches your search. Try a different term.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered}</div>
      )}
    </div>
  );
}
