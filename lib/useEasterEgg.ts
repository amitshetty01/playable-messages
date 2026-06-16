"use client";

import { useState, useCallback, useRef, useEffect } from "react";

type EggSequence = { keys: string[]; onTrigger: () => void; label: string };

const EGGS: Record<string, EggSequence> = {
  "the-final-button": {
    keys: ["b", "u", "t", "t", "o", "n"],
    onTrigger: () => {},
    label: "You found the secret button sequence!"
  },
  "the-last-deleted-message": {
    keys: ["d", "e", "l", "e", "t", "e"],
    onTrigger: () => {},
    label: "Deleted but not forgotten!"
  },
  "glitch-truth": {
    keys: ["g", "l", "i", "t", "c", "h"],
    onTrigger: () => {},
    label: "The glitch is part of the design."
  },
  "dont-smile-challenge": {
    keys: ["s", "m", "i", "l", "e"],
    onTrigger: () => {},
    label: "I caught you smiling!"
  },
  "the-risk-button": {
    keys: ["r", "i", "s", "k"],
    onTrigger: () => {},
    label: "You risked typing a secret code!"
  },
  "choose-my-punishment": {
    keys: ["s", "o", "r", "r", "y"],
    onTrigger: () => {},
    label: "Apology accepted!"
  },
  "mood-repair-machine": {
    keys: ["m", "o", "o", "d"],
    onTrigger: () => {},
    label: "Your mood is now: impressed."
  },
  "the-secret-room": {
    keys: ["o", "p", "e", "n"],
    onTrigger: () => {},
    label: "You found a hidden passage!"
  },
  "memory-maze": {
    keys: ["m", "a", "z", "e"],
    onTrigger: () => {},
    label: "You escaped the maze!"
  },
  "roast-to-respect": {
    keys: ["r", "o", "a", "s", "t"],
    onTrigger: () => {},
    label: "Master roaster detected!"
  }
};

export function useEasterEgg(templateId: string, onTrigger?: () => void) {
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const seqRef = useRef<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const egg = EGGS[templateId];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!egg || unlocked) return;

    seqRef.current.push(e.key.toLowerCase());
    if (seqRef.current.length > egg.keys.length) {
      seqRef.current = seqRef.current.slice(-egg.keys.length);
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { seqRef.current = []; }, 2000);

    if (seqRef.current.length === egg.keys.length && seqRef.current.join("") === egg.keys.join("")) {
      setUnlocked(true);
      setMessage(egg.label);
      seqRef.current = [];
      onTrigger?.();
    }
  }, [egg, unlocked, onTrigger]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    setUnlocked(false);
    setMessage(null);
  }, []);

  return { unlocked, message, reset };
}
