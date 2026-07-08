"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

const CARDS = [
  {
    id: "long-distance",
    emoji: "🌙",
    title: "The Long-Distance Love Letter",
    description: "A starry night experience with floating messages across the miles.",
    vibe: "Romantic",
    sceneCount: 4,
    prompt: "I want to create a long-distance love letter for my partner who lives far away. Make it romantic and cosmic.",
  },
  {
    id: "ultimate-apology",
    emoji: "💔",
    title: "The Ultimate Apology",
    description: "A heartfelt maze of forgiveness with a warm reunion at the end.",
    vibe: "Emotional",
    sceneCount: 3,
    prompt: "I need to apologize to my partner for a big mistake. I want it to be sincere, emotional, and show how much I care.",
  },
  {
    id: "birthday-hunt",
    emoji: "🎂",
    title: "A Birthday Surprise Hunt",
    description: "A playful treasure hunt leading to a final birthday reveal.",
    vibe: "Fun",
    sceneCount: 5,
    prompt: "I want to create a birthday surprise hunt for my best friend. Make it fun, playful, and full of clues.",
  },
  {
    id: "confession",
    emoji: "💕",
    title: "The Crush Confession",
    description: "A cute, flirty game that builds up to the perfect confession.",
    vibe: "Cute",
    sceneCount: 3,
    prompt: "I want to confess my feelings to my crush in a fun, low-pressure way. Make it cute and playful.",
  },
  {
    id: "friendship",
    emoji: "🤝",
    title: "The Friendship Appreciation",
    description: "A journey through your favorite memories together.",
    vibe: "Warm",
    sceneCount: 4,
    prompt: "I want to show my best friend how much they mean to me. Make it warm, nostalgic, and full of memories.",
  },
  {
    id: "anniversary",
    emoji: "💍",
    title: "The Anniversary Time Capsule",
    description: "A romantic walk through your journey together with a surprise ending.",
    vibe: "Romantic",
    sceneCount: 4,
    prompt: "I want to celebrate our anniversary with something romantic and memorable that shows our journey together.",
  },
];

const CARD_COLORS: Record<string, string> = {
  Romantic: "from-pink-500/20 to-rose-500/10 border-pink-500/30",
  Emotional: "from-blue-500/20 to-indigo-500/10 border-blue-500/30",
  Fun: "from-yellow-500/20 to-orange-500/10 border-yellow-500/30",
  Cute: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
  Warm: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
};

type Props = {
  onSelectPrompt: (prompt: string) => void;
};

export function InspirationCarousel({ onSelectPrompt }: Props) {
  const sectionRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    dragStart.current = { x: e.pageX - scrollRef.current.offsetLeft, scrollLeft: scrollRef.current.scrollLeft };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStart.current.x) * 1.5;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - walk;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  return (
    <section ref={sectionRef} className="relative z-10 overflow-hidden px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8 text-center">
          <p className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Inspiration</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Need a little inspiration?</h2>
          <p className="mt-2 text-sm text-white/50">Click any idea to auto-fill your story prompt</p>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex cursor-grab gap-4 overflow-x-auto pb-4 ${isDragging ? "cursor-grabbing" : ""}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CARDS.map((card, idx) => {
            const colorStyle = CARD_COLORS[card.vibe] || "from-white/10 to-white/5 border-white/20";
            return (
              <motion.button
                key={card.id}
                type="button"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => {
                  if (!isDragging) {
                    onSelectPrompt(card.prompt);
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`group flex w-[260px] shrink-0 flex-col rounded-2xl border bg-gradient-to-b p-5 text-left backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] ${colorStyle}`}
                style={{ userSelect: "none" }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl backdrop-blur-sm">
                    {card.emoji}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    card.vibe === "Romantic" ? "bg-pink-500/20 text-pink-300" :
                    card.vibe === "Emotional" ? "bg-blue-500/20 text-blue-300" :
                    card.vibe === "Fun" ? "bg-yellow-500/20 text-yellow-300" :
                    card.vibe === "Cute" ? "bg-purple-500/20 text-purple-300" :
                    card.vibe === "Warm" ? "bg-amber-500/20 text-amber-300" :
                    "bg-white/10 text-white/50"
                  }`}>
                    {card.vibe}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-white leading-tight">{card.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60">{card.description}</p>

                <div className="mt-3 flex items-center gap-3 text-[10px] text-white/40">
                  <span>{card.sceneCount} scenes</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/50 font-mono">community fav</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
