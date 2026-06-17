"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/categories", label: "Categories" },
  { href: "/templates", label: "Templates" },
  { href: "/my-experiences", label: "My messages" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 mx-auto mt-1 flex w-[min(calc(100%-16px),80rem)] items-center justify-between gap-4 rounded-full border border-white/10 bg-ink/70 px-4 shadow-glow backdrop-blur-2xl transition-all duration-300 sm:mt-2 sm:px-5 ${
        scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-3.5"
      }`}
    >
      <Link className="flex shrink-0 items-center gap-2.5" href="/" aria-label="Craft Your Message home">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blush to-violet text-[10px] font-extrabold tracking-tight text-white shadow-soft sm:h-9 sm:w-9 sm:text-xs">CY</span>
        <span className={`font-extrabold tracking-[-0.02em] text-white transition-all duration-300 ${
          scrolled ? "text-sm" : "text-base"
        }`}>
          Craft Your Message
        </span>
      </Link>

      <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full px-3 py-1.5 text-[0.8rem] font-bold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/create"
          className="ml-1 rounded-full bg-white px-4 py-1.5 text-[0.8rem] font-bold text-ink transition-colors hover:bg-white/90"
        >
          Start creating
        </Link>
      </nav>

      <div className="flex items-center gap-2 sm:hidden">
        <Link
          href="/create"
          className="rounded-full bg-white px-3.5 py-1.5 text-[0.78rem] font-bold text-ink transition-colors hover:bg-white/90"
        >
          Start creating
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm sm:hidden" onClick={() => setMenuOpen(false)} />
          <nav className="fixed bottom-0 left-0 right-0 z-40 flex flex-col gap-1 rounded-t-2xl border-t border-white/10 bg-ink/95 px-4 pb-8 pt-5 backdrop-blur-2xl sm:hidden" aria-label="Mobile navigation">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Navigation</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-white/5 text-white/60"
                aria-label="Close menu"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/create"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-white py-3 text-center text-sm font-bold text-ink transition-colors hover:bg-white/90"
            >
              Start creating
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}
