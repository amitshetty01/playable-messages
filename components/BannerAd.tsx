"use client";

import { useEffect, useRef } from "react";
import { enqueueBannerAd } from "@/lib/adLoader";

const AD_KEY = "0b5011ee65a3dd233687d2fd48d23fb5";
const AD_SRC = "https://www.highperformanceformat.com/0b5011ee65a3dd233687d2fd48d23fb5/invoke.js";

export function BannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;
    enqueueBannerAd(AD_KEY, AD_SRC, 250, 300, containerRef.current);
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center" />
  );
}
