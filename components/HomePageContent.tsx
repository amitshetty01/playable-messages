"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Script from "next/script";
import { QuickFlow } from "@/components/QuickFlow";
import { GuidedFlow } from "@/components/GuidedFlow";
import { BrowseFlow } from "@/components/BrowseFlow";
import { TrendingTemplates } from "@/components/TrendingTemplates";
import { TemplatePreviewOverlay } from "@/components/TemplatePreviewOverlay";
import { getTemplate, templates } from "@/lib/data";

const TestimonialCarousel = dynamic(
  () => import("@/components/TestimonialCarousel").then((m) => m.TestimonialCarousel),
  { ssr: false }
);

const REACTIONS = [
  { emoji: "😭", text: "She cried at the last reveal", author: "— Riya" },
  { emoji: "😂", text: "He chased the button for 40 seconds", author: "— Aarav" },
  { emoji: "❤️", text: "My girlfriend replayed it 5 times", author: "— Karan" },
  { emoji: "🥹", text: "I wasn't ready for that ending", author: "— Neha" },
  { emoji: "😍", text: "Best birthday surprise ever", author: "— Priya" },
  { emoji: "🤯", text: "He thought it was spam at first", author: "— Ananya" },
];

const OCCASIONS = [
  { label: "Anniversary", icon: "💍", slug: "love" },
  { label: "Birthday", icon: "🎂", slug: "birthday" },
  { label: "Proposal", icon: "💎", slug: "love" },
  { label: "Sorry", icon: "💔", slug: "sorry" },
  { label: "Love", icon: "💖", slug: "love" },
  { label: "Friendship", icon: "🤝", slug: "memory" },
  { label: "Roast", icon: "🏆", slug: "roast" },
  { label: "Long Distance", icon: "🌍", slug: "love" },
];

const ACTIVITIES = [
  { emoji: "❤️", text: "Someone just created Love Contract", delay: 0 },
  { emoji: "😂", text: "A Moving Button was shared", delay: 2000 },
  { emoji: "🎂", text: "Birthday Reveal completed", delay: 4000 },
  { emoji: "💔", text: "Kitty Apology sent to patch things up", delay: 6000 },
  { emoji: "🧩", text: "Escape Me was solved in 28 seconds", delay: 8000 },
  { emoji: "💜", text: "Heart Vault unlocked by someone special", delay: 10000 },
];

const HOW_IT_WORKS = [
  { step: "1", icon: "✍️", title: "Write your message", desc: "Type what you want to say — love, sorry, funny, or just because." },
  { step: "2", icon: "🎨", title: "Choose a template", desc: "Pick from 50+ interactive experiences that match your mood." },
  { step: "3", icon: "🎵", title: "Customize it", desc: "Add names, photos, music, and text to make it truly yours." },
  { step: "4", icon: "🔗", title: "Share your link", desc: "Send it anywhere — WhatsApp, Instagram, SMS, or email." },
  { step: "5", icon: "🎬", title: "Watch them experience it", desc: "They open the link and play through your message live." },
];

const fullTemplates = templates.filter((t) => t.status === "full");
export function HomePageContent() {
  const [showGuided, setShowGuided] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);
  const [preview, setPreview] = useState<{ id: string; rect: DOMRect } | null>(null);

  const handlePreview = useCallback((id: string, rect?: DOMRect) => {
    const fallback = { top: 120, left: 0, width: 340, height: 280, x: 0, y: 120, bottom: 400, right: 340 };
    const r: DOMRect = rect || (fallback as DOMRect);
    setPreview({ id, rect: r });
  }, []);

  const closePreview = useCallback(() => {
    setPreview(null);
  }, []);

  const previewTemplate = preview ? getTemplate(preview.id) : null;

  return (
    <>
    <div className={`pb-24 ${preview ? "pointer-events-none select-none" : ""}`}>

      {/* ─── Hero ─── */}
      <section className="section-fade pt-8 sm:pt-16">
        <QuickFlow />
      </section>

      {/* ─── Trending templates ─── */}
      <section className="mt-24">
        <TrendingTemplates onDemo={handlePreview} />
      </section>

      {/* ─── How it works ─── */}
      <section className="mx-auto mt-28 max-w-5xl px-4">
        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">How it works</h2>
          <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
          <p className="mt-4 text-lg text-white/60">Five simple steps to create an unforgettable message.</p>
        </div>
        <div className="relative mt-14">
          {/* Connecting line (desktop) */}
          <div className="absolute left-1/2 top-12 hidden h-[calc(100%-6rem)] w-px -translate-x-1/2 bg-gradient-to-b from-blush/20 via-violet/20 to-neon/20 lg:block" />
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-4">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10 transition-all duration-500 hover:ring-blush/30 hover:bg-white/[0.08]">
                  <span className="text-3xl transition-transform duration-300 hover:scale-110">{item.icon}</span>
                  {/* Step number */}
                  <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blush to-violet text-[10px] font-extrabold text-white shadow-lg">
                    {item.step}
                  </div>
                </div>
                {/* Arrow (between steps) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-8 text-white/15">
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor"><path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8z"/></svg>
                  </div>
                )}
                <h3 className="mt-4 text-base font-extrabold text-white">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/50 max-w-[200px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Choose by occasion ─── */}
      <section className="mx-auto mt-28 max-w-5xl px-4">
        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Choose by occasion</h2>
          <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
          <p className="mt-4 text-lg text-white/60">Pick the moment and find the perfect experience.</p>
        </div>
        <div className="mt-10 grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {OCCASIONS.map((o) => (
            <Link
              key={o.label}
              href={`/mood/${o.slug}`}
              className="glass group flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-xl transition-transform duration-300 group-hover:scale-125">{o.icon}</span>
              <span className="text-[10px] font-extrabold text-white/70 transition-colors group-hover:text-white text-center leading-tight">{o.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Trending Today tabs ─── */}
      <section className="mx-auto mt-28 max-w-6xl px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Discover</h2>
            <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
          </div>
          </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fullTemplates.slice(0, 4).map((t) => (
            <div
              key={t.id}
              data-card
              onClick={(e) => { const card = e.currentTarget.closest("[data-card]"); const rect = card?.getBoundingClientRect(); if (rect) handlePreview(t.id, rect); }}
              className="glass group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lg ring-1 ring-white/10">
                  {t.id === "the-final-button" ? "🎯" :
                   t.id === "love-chase" ? "💖" :
                   t.id === "love-contract" ? "📜" :
                   t.id === "birthday-surprise-journey" ? "🎂" :
                   t.id === "come-closer" ? "👻" :
                   t.id === "our-memories" ? "📖" :
                   t.id === "escape-me" ? "🧩" :
                   t.id === "kitty-apology" ? "🐱" :
                   t.id === "memory-maze" ? "💜" :
                   t.id === "sorry-maze" ? "💛" :
                   t.id === "birthday-journey" ? "🎈" : "✨"}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-white truncate">{t.title}</h4>
                  <p className="text-[10px] text-white/40">{t.length}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); const card = e.currentTarget.closest("[data-card]"); const rect = card?.getBoundingClientRect(); if (rect) handlePreview(t.id, rect); }}
                  className="flex-1 rounded-lg border border-white/15 bg-white/[0.06] py-1.5 text-[10px] font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                >
                  Demo
                </button>
                <Link
                  href={t.id === "our-memories" ? "/our-memories?edit=true" : `/create/${t.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 rounded-lg bg-gradient-to-r from-blush/80 to-violet/80 py-1.5 text-center text-[10px] font-extrabold text-white shadow transition-all hover:scale-[1.02] active:scale-95"
                >
                  Create
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Recent activity ─── */}
      <section className="mx-auto mt-28 max-w-3xl px-4">
        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Live activity</h2>
          <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
        </div>
        <div className="mt-10 space-y-3">
          {ACTIVITIES.map((a, i) => (
            <div
              key={i}
              className="animate-fade-in glass flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-lg">{a.emoji}</span>
              <p className="text-sm text-white/70">{a.text}</p>
              <span className="ml-auto text-[10px] text-white/25">just now</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Social proof ─── */}
      <section className="mx-auto mt-28 max-w-5xl px-4">
        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Real reactions</h2>
          <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REACTIONS.map((r, i) => (
            <div
              key={i}
              className="glass group rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <p className="flex items-start gap-2 text-base leading-relaxed text-white/85">
                <span className="mt-0.5 text-xl">{r.emoji}</span>
                <span>{r.text}</span>
              </p>
              <p className="mt-3 text-xs font-bold text-white/35">{r.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Testimonials + Stats ─── */}
      <div className="mx-auto mt-28 max-w-3xl px-4">
        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.18em] text-white/50 uppercase">What people create</h2>
          <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
        </div>
        <TestimonialCarousel />
        <div className="mt-6">
          <h3 className="text-center text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Trusted by thousands</h3>
          <div className="mt-5 grid grid-cols-4 gap-3">
            {[
              { value: "50K", suffix: "+", icon: "💬", label: "Messages" },
              { value: "42", suffix: "K+", icon: "👥", label: "Recipients" },
              { value: "20", suffix: "+", icon: "🎨", label: "Templates" },
              { value: "7", suffix: "", icon: "🎭", label: "Moods" },
            ].map((s) => (
              <div key={s.label} className="group rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent px-2 py-4 text-center transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-lg sm:px-3 sm:py-5">
                <span className="text-lg sm:text-xl block">{s.icon}</span>
                <p className="mt-1 text-lg font-extrabold tracking-tight text-white sm:text-2xl">
                  <span>{s.value}</span>{s.suffix}
                </p>
                <p className="mt-0.5 text-[9px] font-semibold text-white/30 uppercase tracking-wider sm:text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Ad ─── */}
      <div className="mt-16 flex justify-center">
        <div className="relative w-full max-w-[728px] overflow-hidden" style={{ height: 90 }}>
          <Script id="ad-rect-config" strategy="lazyOnload">{`atOptions={"key":"4325688d299d71bc93ad520c92ef88c0","format":"iframe","height":90,"width":728,"params":{}}`}</Script>
          <Script src="https://www.highperformanceformat.com/4325688d299d71bc93ad520c92ef88c0/invoke.js" strategy="lazyOnload" />
        </div>
      </div>

      {/* ─── SEO text ─── */}
      <section className="mx-auto mt-20 max-w-4xl px-4">
        <div className="glass rounded-[2rem] p-6 sm:p-10">
          <h2 className="display-title text-2xl font-bold text-white sm:text-3xl">What is Craft Your Message?</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            Craft Your Message is a creative online platform that turns your words into interactive, shareable experiences. Instead of sending a plain text message, you create a unique link that opens a mini-game, animation, or reveal sequence. Your recipient plays through the experience and discovers your message at the end. It is a fun and memorable way to say something meaningful.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Whether you want to send an apology after a fight, confess your feelings to a crush, wish a friend a happy birthday, or roast your best friend in good humor, Craft Your Message makes every word count. Each template is designed with a specific emotion in mind, so your message lands the way you intend it to.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "🎮", title: "Playful", desc: "Every message is a mini game or animation they play through." },
              { icon: "🔗", title: "Shareable", desc: "One link. Works on any phone, any chat app, anywhere." },
              { icon: "💝", title: "Emotional", desc: "The format makes your words hit harder and feel deeper." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center rounded-xl bg-white/[0.04] p-4 text-center ring-1 ring-white/10">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 text-sm font-extrabold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Escape hatches ─── */}
      <div className="mt-16 flex flex-col items-center gap-3 text-center">
        <button
          type="button"
          onClick={() => { setShowGuided(!showGuided); if (!showGuided) setShowBrowse(false); }}
          className="text-sm text-white/40 underline underline-offset-4 transition-colors hover:text-white/70"
        >
          {showGuided ? "− Close guided mode" : "Not sure what to say? Let us guide you"}
        </button>
        <button
          type="button"
          onClick={() => { setShowBrowse(!showBrowse); if (!showBrowse) setShowGuided(false); }}
          className="text-sm text-white/40 underline underline-offset-4 transition-colors hover:text-white/70"
        >
          {showBrowse ? "− Close" : "See what's coming soon →"}
        </button>
      </div>

      {/* ─── Guided flow ─── */}
      {showGuided && (
        <section className="section-fade mt-12">
          <GuidedFlow />
        </section>
      )}

      {/* ─── Browse flow ─── */}
      {showBrowse && (
        <section className="section-fade mt-12">
          <BrowseFlow />
        </section>
      )}

      {/* ─── Why use it ─── */}
      <section className="mx-auto mt-28 max-w-5xl px-4">
        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Why use it</h2>
          <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
          <p className="mt-4 text-lg text-white/60">Plain texts get lost. Interactive messages get remembered.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass rounded-[1.6rem] p-5">
            <span className="text-2xl">🎯</span>
            <h3 className="mt-3 text-lg font-extrabold text-white">More than text</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">A link carries emotion, pacing, and surprise that a plain message cannot.</p>
          </div>
          <div className="glass rounded-[1.6rem] p-5">
            <span className="text-2xl">🔗</span>
            <h3 className="mt-3 text-lg font-extrabold text-white">Share anywhere</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">Works in WhatsApp, Instagram, SMS, email — anywhere you can paste a link.</p>
          </div>
          <div className="glass rounded-[1.6rem] p-5">
            <span className="text-2xl">🎨</span>
            <h3 className="mt-3 text-lg font-extrabold text-white">50+ templates</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">Choose from love, apology, birthday, funny, memory, and mystery experiences.</p>
          </div>
          <div className="glass rounded-[1.6rem] p-5">
            <span className="text-2xl">🔒</span>
            <h3 className="mt-3 text-lg font-extrabold text-white">Private by default</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">Each link is unique and unguessable. You control who sees it.</p>
          </div>
        </div>
      </section>

      {/* ─── Homepage FAQs ─── */}
      <section className="mx-auto mt-28 max-w-3xl px-4">
        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Questions</h2>
          <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
          <p className="mt-4 text-lg text-white/60">Everything you need to know before creating your first message.</p>
        </div>
        <div className="mt-10 space-y-4">
          <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.06]">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80">
              <span>What can I create?</span>
              <span className="shrink-0 text-white/30 transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">Love confessions, birthday surprises, apology messages, anniversary notes, proposal questions, good morning texts, good night wishes, friendship appreciation, funny roasts, farewell messages, and more. Each one is interactive and shareable as a link.</p>
          </details>
          <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.06]">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80">
              <span>Does the recipient need to sign up?</span>
              <span className="shrink-0 text-white/30 transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">No. They just tap the link and the experience opens in their browser. No account, no app, no download.</p>
          </details>
          <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.06]">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80">
              <span>Can I send it on WhatsApp?</span>
              <span className="shrink-0 text-white/30 transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">Yes. Copy your unique link and paste it into any WhatsApp chat. The recipient taps it and the experience opens instantly.</p>
          </details>
          <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.06]">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80">
              <span>Is it really free?</span>
              <span className="shrink-0 text-white/30 transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">Yes. Every template, every generator, every AI tool is completely free. No hidden charges or subscriptions.</p>
          </details>
          <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.06]">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80">
              <span>Can I edit after sharing?</span>
              <span className="shrink-0 text-white/30 transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">Yes. Every created message includes an edit link. You can update the text, change the template, or customize it even after the recipient has seen it.</p>
          </details>
        </div>
        <div className="mt-8 text-center">
          <Link href="/faq" className="text-sm font-bold text-white/50 underline underline-offset-4 transition-colors hover:text-white/70">
            See all FAQs →
          </Link>
        </div>
      </section>

      {/* ─── Explore & Messages bottom links ─── */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/explore"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
          Explore
        </Link>
        <Link
          href="/messages"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
          Messages
        </Link>
      </div>

      {/* ─── Secret space ─── */}
      <div className="mt-8 text-center">
        <Link
          href="/chat"
          className="group inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.65rem] font-bold text-white/35 transition-all hover:bg-white/5 hover:text-white/60"
        >
          <span className="transition-transform duration-300 group-hover:scale-110">🔒</span>
          <span>Secret space</span>
        </Link>
      </div>

      {/* ─── Ad ─── */}
      <div className="mt-12 flex justify-center">
        <div className="relative w-full max-w-[728px] overflow-hidden" style={{ height: 90 }}>
          <Script id="ad-rect-config-2" strategy="lazyOnload">{`atOptions={"key":"4325688d299d71bc93ad520c92ef88c0","format":"iframe","height":90,"width":728,"params":{}}`}</Script>
          <Script src="https://www.highperformanceformat.com/4325688d299d71bc93ad520c92ef88c0/invoke.js" strategy="lazyOnload" />
        </div>
      </div>

    </div>

    {preview && previewTemplate && (
      <TemplatePreviewOverlay
        template={previewTemplate}
        cardRect={preview.rect}
        onClose={closePreview}
      />
    )}
    </>
  );
}
