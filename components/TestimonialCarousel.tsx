"use client";

import { useState, useEffect } from "react";

const testimonials = [
  { emoji: "💖", mood: "Love", template: "Moving Button", message: "Used the Moving Button to confess to my crush. Watching them chase the button around the screen before reading my words made it so fun and nerve-wracking. They said it was the most creative confession they've ever gotten.", user: "Alex" },
  { emoji: "🎂", mood: "Birthday", template: "Blow Out the Candles", message: "Sent a birthday wish with the candle template. My friend had to blow out each candle one by one before the message appeared in icing on the cake. She was grinning the whole time — said it felt like a real celebration.", user: "Priya" },
  { emoji: "💔", mood: "Sorry", template: "Kitty Apology", message: "I messed up bad and didn't know how to apologize. Sent a Kitty Apology and the little cat actions softened them up instantly. By the time the letter appeared, they were already smiling. Works every time.", user: "Jordan" },
  { emoji: "💓", mood: "Memory", template: "Heart Vault", message: "Made a Heart Vault for my best friend with photos from over the years. The password gate made it feel like a secret club — she had to prove she knew me before unlocking everything. She cried happy tears.", user: "Sam" },
  { emoji: "😂", mood: "Funny", template: "Come Closer Prank", message: "Pranked my brother with Come Closer. Told him to go sit in a dark room for something important. The 3-2-1 countdown and sudden brightness blast got him so bad. He's already planning revenge.", user: "Casey" },
  { emoji: "💖", mood: "Love", template: "Catch My Heart", message: "The Catch My Heart template is genius. Two buttons — one says 'You love me' and the other runs away forever. They had to actually catch the truth. Perfect for a playful love confession.", user: "Riley" },
  { emoji: "🔐", mood: "Mystery", template: "Escape Me", message: "Used Escape Me to send a puzzle message to my girlfriend. She had to tap the arrow pieces in the right order to clear the walls and unlock what I wrote. Felt like a mini escape room date.", user: "Morgan" },
  { emoji: "🎂", mood: "Birthday", template: "Birthday Journey", message: "Made a Birthday Journey for my mom. Balloons rising in the dark, a candle-lit cake appearing — the whole atmosphere was magical. She said no one has ever put this much thought into a birthday message.", user: "Taylor" },
  { emoji: "😂", mood: "Funny", template: "Moving Button", message: "Sent a roast through the Moving Button template. My friend spent a full minute chasing that stupid button around the screen. When they finally caught it, the punchline hit so much harder.", user: "Jamie" },
  { emoji: "💓", mood: "Memory", template: "Heart Vault", message: "Made a Heart Vault for our anniversary. Uploaded photos from every year we've been together with little notes hidden behind the password wall. He said unlocking each memory felt like falling in love all over again.", user: "Avery" },
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [typed, setTyped] = useState("");
  const [progress, setProgress] = useState(0);
  const [showMeta, setShowMeta] = useState(false);

  const t = testimonials[current];

  useEffect(() => {
    setTyped("");
    setShowMeta(false);
    setProgress(0);
    let i = 0;
    const msg = t.message;
    const speed = 20;
    const iv = setInterval(() => {
      i++;
      setTyped(msg.slice(0, i));
      if (i >= msg.length) {
        clearInterval(iv);
        setShowMeta(true);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [current, t.message]);

  useEffect(() => {
    const start = Date.now();
    const dur = 6000;
    const iv = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setProgress(p);
      if (p >= 1) clearInterval(iv);
    }, 50);
    return () => clearInterval(iv);
  }, [current]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % testimonials.length);
        setVisible(true);
      }, 450);
    }, 6500);
    return () => clearTimeout(timer);
  }, [current]);

  const moodAccent = t.mood === "Love" ? "from-pink-500 to-rose-600" :
    t.mood === "Birthday" ? "from-violet-500 to-purple-700" :
    t.mood === "Sorry" ? "from-indigo-500 to-slate-800" :
    t.mood === "Memory" ? "from-teal-400 to-cyan-600" :
    t.mood === "Funny" ? "from-amber-400 to-orange-500" :
    t.mood === "Mystery" ? "from-fuchsia-500 to-purple-800" :
    "from-pink-500 to-rose-600";

  const moodBorder = t.mood === "Love" ? "border-pink-500/20" :
    t.mood === "Birthday" ? "border-violet-500/20" :
    t.mood === "Sorry" ? "border-indigo-500/20" :
    t.mood === "Memory" ? "border-teal-400/20" :
    t.mood === "Funny" ? "border-amber-400/20" :
    t.mood === "Mystery" ? "border-fuchsia-500/20" :
    "border-pink-500/20";

  return (
    <div className="relative mt-8">
      <div className={`relative overflow-hidden rounded-[1.8rem] border ${moodBorder} bg-gradient-to-b from-white/[0.03] to-white/[0.01] px-5 py-7 shadow-xl transition-all duration-500 sm:px-7 sm:py-8 ${
        visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-sm"
      }`}>

        <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        <div className={`absolute -inset-20 rounded-full bg-gradient-to-br ${moodAccent} opacity-[0.04] blur-3xl`} />
        <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${moodAccent} opacity-[0.03] blur-2xl animate-pulse`} style={{ animationDuration: "5s" }} />

        <div className="absolute left-0 right-0 top-0 h-[2px] bg-white/[0.03]">
          <div className={`h-full rounded-r-full bg-gradient-to-r ${moodAccent} transition-all duration-150 ease-linear shadow-lg`}
            style={{ width: `${progress * 100}%`, boxShadow: "0 0 8px rgba(255,255,255,0.15)" }} />
        </div>

        <div className="relative mb-5 flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-1 ring-1 ring-rose-500/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
            </span>
            <span className="text-[9px] font-bold tracking-wider text-rose-300 uppercase">Live</span>
          </div>
          <span className="text-[10px] font-medium text-white/20 tracking-wide">Someone just created a message</span>
          <span className="ml-auto text-[9px] font-mono text-white/15">2.3k watching</span>
        </div>

        <div className="relative">
          <div className="absolute -left-3 -top-2 text-5xl leading-none font-serif text-white/25 select-none">&ldquo;</div>
          <div className="relative min-h-[5rem] pl-6">
            <p className="text-[15px] leading-[1.7] text-white/80 tracking-wide sm:text-base">
              {typed}
              {typed.length < t.message.length && (
                <span className={`inline-block h-[1.1em] w-[2.5px] animate-pulse rounded-full bg-gradient-to-b ${moodAccent} ml-0.5 align-middle shadow-sm`} />
              )}
            </p>
          </div>
          {showMeta && (
            <div className="absolute -bottom-5 -right-1 text-5xl leading-none font-serif text-white/25 select-none">&rdquo;</div>
          )}
        </div>

        <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4 transition-all duration-500 ${
          showMeta ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${moodAccent} p-[2px] shadow-lg`}>
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a0f] text-xs font-bold text-white/90">
                {t.user[0]}
              </div>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-white/60">
                Anonymous
                <span className="rounded bg-white/[0.04] px-1.5 py-[1px] text-[8px] font-medium tracking-wide text-white/20 uppercase">hidden</span>
              </p>
              <p className="flex items-center gap-1 text-[9px] text-white/20">
                just now
                <span className="inline-flex gap-[1px]">
                  <span className="h-1 w-1 animate-bounce rounded-full bg-white/25" style={{ animationDelay: "0ms" }} />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-white/25" style={{ animationDelay: "150ms" }} />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-white/25" style={{ animationDelay: "300ms" }} />
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border ${moodBorder} bg-white/[0.03] px-3 py-1 text-[10px] font-semibold text-white/50`}>
              {t.emoji} <span className="text-white/70">{t.template}</span>
            </span>
            <span className={`rounded-full border ${moodBorder} bg-white/[0.03] px-3 py-1 text-[10px] text-white/30`}>
              {t.mood}
            </span>
          </div>
        </div>

        {showMeta && (
          <div className="pointer-events-none absolute -right-1 -bottom-1 select-none opacity-15">
            <span className="inline-block animate-float text-3xl">{t.emoji}</span>
          </div>
        )}

        <div className="relative mt-5 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button key={i} type="button"
              onClick={() => { setCurrent(i); setVisible(true); }}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? `w-6 h-2 bg-gradient-to-r ${moodAccent} shadow-sm`
                  : "w-2 h-2 bg-white/8 hover:bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
