"use client";

import { useEffect, useState } from "react";
import { initSoundPref } from "@/lib/flowSounds";

export function SoundWelcome() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("craft-message-sound-welcome");
    if (seen === "seen") return;
    const soundPref = localStorage.getItem("craft-message-sound");
    if (soundPref === "off") return;
    initSoundPref();
    setShow(true);
    localStorage.setItem("craft-message-sound-welcome", "seen");
    const t = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-neon/30 bg-black/90 px-5 py-3 text-sm font-bold text-neon shadow-lg backdrop-blur-xl animate-[section-in_400ms_cubic-bezier(.22,1,.36,1)_both]">
      Sounds on. Tap the speaker icon to mute.
    </div>
  );
}
