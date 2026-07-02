"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { QuickFlow } from "@/components/QuickFlow";
import { GuidedFlow } from "@/components/GuidedFlow";
import { BrowseFlow } from "@/components/BrowseFlow";
import { AdsterraAd } from "@/components/AdsterraAd";

const TestimonialCarousel = dynamic(
  () => import("@/components/TestimonialCarousel").then((m) => m.TestimonialCarousel),
  { ssr: false }
);

export function HomePageContent() {
  const [showGuided, setShowGuided] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);

  return (
    <div className="pb-24">

      {/* ─── Primary: Quick flow ─── */}
      <section className="section-fade min-h-[80dvh] pt-12 sm:pt-20">
        <QuickFlow />
      </section>

      {/* ─── Long-tail SEO keywords ─── */}
      <div className="mx-auto mt-20 max-w-3xl text-center">
        <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Ways to use Craft Your Message</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/40">
          <span>interactive birthday message link</span>
          <span>send a fun apology message</span>
          <span>creative way to say sorry over text</span>
          <span>romantic confession maker</span>
          <span>funny roast generator</span>
          <span>friendship message with games</span>
          <span>surprise text reveal</span>
          <span>interactive love letter online</span>
        </div>
      </div>

      {/* ─── Social proof / Testimonial carousel ─── */}
      <div className="mx-auto mt-20 max-w-3xl">
        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.18em] text-white/50 uppercase">What people create</h2>
          <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
        </div>

        <TestimonialCarousel />

        {/* Stats row */}
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

      {/* ─── SEO content section ─── */}
      <section className="mx-auto mt-20 max-w-3xl space-y-10 px-4">
        <article>
          <h2 className="text-xl font-bold text-white sm:text-2xl">What is Craft Your Message?</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Craft Your Message is a creative online platform that turns your words into interactive, shareable experiences. Instead of sending a plain text message, you create a unique link that opens a mini-game, animation, or reveal sequence. Your recipient plays through the experience and discovers your message at the end. It is a fun and memorable way to say something meaningful.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Whether you want to send an apology after a fight, confess your feelings to a crush, wish a friend a happy birthday, or roast your best friend in good humor, Craft Your Message makes every word count. Each template is designed with a specific emotion in mind, so your message lands the way you intend it to.
          </p>
        </article>

        <article>
          <h2 className="text-xl font-bold text-white sm:text-2xl">How It Works</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Using Craft Your Message is simple. Type your message into the text box above, choose a mood that matches your feelings, and generate your link. The platform automatically picks the best template for your words. You can then share the link via WhatsApp, Instagram, or any other messaging app. When your recipient opens the link, they are guided through a beautifully designed interactive moment before your message is revealed.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            You can also browse the full collection of templates, preview how each one works, and customize the colors, tone, and theme to match your style. Every experience is fully responsive and works on any device, so your message looks great whether it is opened on a phone, tablet, or desktop.
          </p>
        </article>

        <article>
          <h2 className="text-xl font-bold text-white sm:text-2xl">Popular Ways to Use Interactive Messages</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            People use Craft Your Message for all kinds of occasions. Send an interactive birthday message link that your friends actually enjoy opening. Create a fun apology message after an argument to break the ice and show you care. Write a romantic confession maker that turns "I like you" into an unforgettable moment. Generate a funny roast generator to tease your best friend in the best way possible. Or build a friendship message with games to celebrate the people who matter most.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Our surprise text reveal templates are perfect for proposals, announcements, or any moment that deserves a dramatic reveal. The interactive love letter online templates let you pour your heart out in a way that feels authentic and personal. No matter what you want to say, there is a template that fits.
          </p>
        </article>

        <article>
          <h2 className="text-xl font-bold text-white sm:text-2xl">Why Choose Craft Your Message?</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Unlike a regular text message, an interactive experience creates anticipation and emotion. The mini-games and animations draw the recipient in and make the final message more impactful. Each template is carefully crafted by designers and developers who understand both storytelling and user experience. We offer over fifty templates across multiple moods and categories, with new ones added regularly.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Craft Your Message is free to use, requires no account or sign-up, and works entirely in your browser. Your privacy matters to us, and we do not share your messages. Start creating your interactive message today and see the difference it makes.
          </p>
        </article>
      </section>

      <div className="mt-10 flex justify-center">
        <AdsterraAd type="rectangle" />
      </div>

      {/* ─── Escape hatches ─── */}
      <div className="mt-10 flex flex-col items-center gap-3 text-center">
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

      {/* ─── Guided flow (expands inline) ─── */}
      {showGuided && (
        <section className="section-fade mt-12">
          <GuidedFlow />
        </section>
      )}

      {/* ─── Browse flow (expands inline) ─── */}
      {showBrowse && (
        <section className="section-fade mt-12">
          <BrowseFlow />
        </section>
      )}

      {/* ─── Secret space ─── */}
      <div className="mt-16 text-center">
        <Link
          href="/chat"
          className="group inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.65rem] font-bold text-white/35 transition-all hover:bg-white/5 hover:text-white/60"
        >
          <span className="transition-transform duration-300 group-hover:scale-110">🔒</span>
          <span>Secret space</span>
        </Link>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <AdsterraAd type="square" />
        <AdsterraAd type="square" />
        <AdsterraAd type="square" />
      </div>

    </div>
  );
}
