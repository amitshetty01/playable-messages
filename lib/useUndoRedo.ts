"use client";

import { useState, useCallback, useRef } from "react";

type SetStateAction<T> = T | ((prev: T) => T);

export function useUndoRedo<T extends Record<string, unknown>>(initial: T, maxHistory = 50) {
  const [state, setState] = useState<T>(initial);
  const historyRef = useRef<T[]>([initial]);
  const pointerRef = useRef(0);

  const push = useCallback((next: SetStateAction<T>) => {
    const prev = historyRef.current[pointerRef.current];
    const resolved: T = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
    const history = historyRef.current.slice(0, pointerRef.current + 1);
    history.push(resolved);
    if (history.length > maxHistory) history.shift();
    historyRef.current = history;
    pointerRef.current = history.length - 1;
    setState(resolved);
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (pointerRef.current <= 0) return;
    pointerRef.current--;
    setState(historyRef.current[pointerRef.current]);
  }, []);

  const redo = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;
    pointerRef.current++;
    setState(historyRef.current[pointerRef.current]);
  }, []);

  const canUndo = pointerRef.current > 0;
  const canRedo = pointerRef.current < historyRef.current.length - 1;

  return { state, setState: push, undo, redo, canUndo, canRedo };
}
