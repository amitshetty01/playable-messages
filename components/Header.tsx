"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/templates", label: "Templates" },
  { href: "/my-experiences", label: "My messages" },
  { href: "/chat", label: "Private Chat" },
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
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 mx-auto mt-1 flex w-[min(calc(100%-16px),80rem)] items-center justify-between rounded-full border border-white/10 bg-ink/70 px-3 shadow-lg backdrop-blur-xl transition-all duration-300 sm:mt-2 sm:px-4 ${
          scrolled ? "py-1.5 sm:py-2" : "py-2 sm:py-2.5"
        }`}
      >
        <Link className="flex shrink-0 items-center gap-2" href="/" aria-label="Craft Your Message home">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-blush to-violet text-[9px] font-extrabold tracking-tight text-white sm:h-8 sm:w-8 sm:text-[10px]">CY</span>
          <span className="text-sm font-extrabold tracking-[-0.02em] text-white sm:text-[0.9rem]">
            Craft Your Message
          </span>
        </Link>

        <nav className="hidden items-center sm:flex" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-2.5 py-1 text-[0.78rem] font-bold text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/create"
            className="ml-1.5 rounded-full bg-white px-3.5 py-1 text-[0.78rem] font-bold text-ink transition-colors hover:bg-white/90"
          >
            Start creating
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          onContextMenu={(e) => e.preventDefault()}
          className="sm:hidden grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white/70 transition-colors select-none hover:bg-white/20 hover:text-white"
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
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 rounded-t-2xl border-t border-white/10 bg-[#1a1527] px-5 pb-10 pt-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/40">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                onContextMenu={(e) => e.preventDefault()}
                className="grid h-6 w-6 place-items-center rounded-full border border-white/15 bg-white/5 text-white/50 select-none"
              >
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              className="mt-3 rounded-full bg-white py-3 text-center text-sm font-bold text-ink transition-colors hover:bg-white/90"
            >
              Start creating
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
