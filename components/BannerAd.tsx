"use client";

import { useEffect, useRef } from "react";
import { enqueueBannerAd } from "@/lib/adLoader";
import { useBlockedCountry } from "@/lib/useBlockedCountry";

const AD_KEY = "0b5011ee65a3dd233687d2fd48d23fb5";
const AD_SRC = "https://www.highperformanceformat.com/0b5011ee65a3dd233687d2fd48d23fb5/invoke.js";

export function BannerAd() {
  const blocked = useBlockedCountry();
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (blocked === null || blocked) return;
    if (loaded.current || !containerRef.current) return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
    loaded.current = true;
    enqueueBannerAd(AD_KEY, AD_SRC, 250, 300, containerRef.current);
  }, [blocked]);

  return (
    <div ref={containerRef} className="flex justify-center" />
  );
}
