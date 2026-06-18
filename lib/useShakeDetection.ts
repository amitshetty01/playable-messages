"use client";

import { useEffect, useRef, useCallback } from "react";

export function useShakeDetection(onShake: () => void, threshold = 15, cooldown = 800) {
  const lastShake = useRef(0);
  const listenerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.DeviceMotionEvent) return;

    const handler = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const total = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
      const now = Date.now();
      if (total > threshold && now - lastShake.current > cooldown) {
        lastShake.current = now;
        onShake();
      }
    };

    listenerRef.current = handler as unknown as (e: DeviceMotionEvent) => void;
    window.addEventListener("devicemotion", handler as unknown as (e: Event) => void);

    return () => {
      window.removeEventListener("devicemotion", handler as unknown as (e: Event) => void);
    };
  }, [onShake, threshold, cooldown]);
}
