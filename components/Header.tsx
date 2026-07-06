"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/lib/theme/context";

type NavLink = { href: string; label?: string; labelKey?: string };
const links: NavLink[] = [
  { href: "/templates", labelKey: "nav.templates" },
  { href: "/my-experiences", labelKey: "nav.messages" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t, supportedLanguages } = useTranslation();
  const { theme, toggleTheme } = useTheme();

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLang = supportedLanguages.find((l) => l.code === lang);

  return (
    <>
      <header
        className={`sticky top-0 z-40 mx-auto mt-1 flex w-[min(calc(100%-16px),80rem)] items-center justify-between rounded-full border border-white/10 bg-ink/70 px-3 shadow-lg backdrop-blur-xl transition-all duration-300 sm:mt-2 sm:px-4 ${
          scrolled ? "py-1.5 sm:py-2" : "py-2 sm:py-2.5"
        }`}
      >
        <Link className="flex shrink-0 items-center gap-2" href="/" aria-label="Craft Your Message home">
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-500 to-purple-600 text-[9px] font-extrabold tracking-tight text-white sm:h-8 sm:w-8 sm:text-[10px] shadow-lg shadow-fuchsia-500/20">CY</span>
          <span className="text-sm font-extrabold tracking-[-0.02em] text-white sm:text-[0.9rem]">
            {t("site.name")}
          </span>
        </Link>

        <nav className="hidden items-center sm:flex" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-2.5 py-1 text-[0.78rem] font-bold text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
            >
              {l.label ?? t(l.labelKey!)}
            </Link>
          ))}

          {/* Language toggle */}
          <div className="relative ml-1.5" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="rounded-full px-2.5 py-1 text-[0.78rem] font-bold text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
              aria-label={t("nav.language")}
            >
              {currentLang?.nativeName || "EN"}
            </button>
            {langOpen && (
              <div data-theme="dark" className="absolute right-0 top-full mt-2 max-h-64 w-44 overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1527] p-2 shadow-2xl backdrop-blur-xl z-50">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors ${
                      lang === l.code ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <span className={l.dir === "rtl" ? "block text-right" : ""}>{l.nativeName}</span>
                    <span className="block text-[10px] font-normal text-white/30">{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-1 rounded-full px-2.5 py-1 text-[0.78rem] font-bold text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <Link
            href="/create"
            className="ml-1.5 rounded-full bg-white-static px-3.5 py-1 text-[0.78rem] font-bold text-ink transition-colors hover:opacity-90"
          >
            {t("nav.create")}
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
          <div data-theme="dark" className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 rounded-t-2xl border-t border-white/10 bg-[#1a1527] px-5 pb-10 pt-6 shadow-2xl">
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
              {l.label ?? t(l.labelKey!)}
              </Link>
            ))}
            {/* Mobile lang selector */}
            <div className="mt-2 border-t border-white/5 pt-3">
              <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-white/30">{t("nav.language")}</p>
              <div className="flex flex-wrap gap-1.5 px-4">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                      lang === l.code ? "bg-white/15 text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    {l.nativeName}
                  </button>
                ))}
              </div>
            </div>
            {/* Mobile theme toggle */}
            <div className="mt-2 px-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white/70 transition-colors hover:bg-white/10"
              >
                {theme === "dark" ? "☀️" : "🌙"} {theme === "dark" ? t("nav.theme.light") : t("nav.theme.dark")} mode
              </button>
            </div>
            <Link
              href="/create"
              onClick={() => setMenuOpen(false)}
              className="mt-3 rounded-full bg-white py-3 text-center text-sm font-bold text-ink transition-colors hover:bg-white/90"
            >
              {t("nav.create")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
