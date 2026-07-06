"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { synth } from "@/lib/synthesizer";

type AudioContextValue = {
  isMuted: boolean;
  toggleMute: () => void;
  isUnlocked: boolean;
  play: (name: string) => void;
};

const AudioCtx = createContext<AudioContextValue>({
  isMuted: false,
  toggleMute: () => {},
  isUnlocked: false,
  play: () => {},
});

export function useAudio() {
  return useContext(AudioCtx);
}

function throttle<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let last = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; return fn(...args); }
  }) as T;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const unlockedRef = useRef(false);

  // Unlock on first user interaction
  useEffect(() => {
    function unlock() {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      setIsUnlocked(true);
      // Prime the AudioContext
      synth?.playHover();
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    }
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const play = useCallback((name: string) => {
    if (isMuted || !isUnlocked || !synth) return;
    switch (name) {
      case "hover": synth.playHover(); break;
      case "click": synth.playClick(); break;
      case "success": synth.playSuccess(); break;
      case "whoosh": synth.playWhoosh(); break;
      case "confetti": synth.playConfetti(); break;
      case "type": synth.playType(); break;
    }
  }, [isMuted, isUnlocked]);

  // Directive 2: Global event delegation for hover & click
  const throttledHover = useRef(throttle((e: MouseEvent) => {
    if (isMuted || !isUnlocked) return;
    const target = e.target as Element;
    if (target.closest(".premium-button, .ghost-button, .lift, a")) {
      play("hover");
    }
  }, 50)).current;

  const handleClick = useCallback((e: MouseEvent) => {
    if (isMuted || !isUnlocked) return;
    const target = e.target as Element;
    if (target.closest(".premium-button, .ghost-button, .tap")) {
      play("click");
    }
  }, [isMuted, isUnlocked, play]);

  useEffect(() => {
    document.addEventListener("mouseover", throttledHover);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("mouseover", throttledHover);
      document.removeEventListener("click", handleClick);
    };
  }, [throttledHover, handleClick]);

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute, isUnlocked, play }}>
      {children}
    </AudioCtx.Provider>
  );
}
