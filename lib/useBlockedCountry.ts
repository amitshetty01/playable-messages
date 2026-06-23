"use client";

import { useEffect, useState } from "react";
import { BLOCKED_COUNTRIES } from "./adConfig";

let cached: boolean | null = null;
let pending: Promise<boolean> | null = null;

async function checkBlocked(): Promise<boolean> {
  try {
    const res = await fetch("/api/country");
    const data = await res.json();
    return BLOCKED_COUNTRIES.includes(data.country);
  } catch {
    return false;
  }
}

export function useBlockedCountry() {
  const [blocked, setBlocked] = useState<boolean | null>(cached);

  useEffect(() => {
    if (cached !== null) return;
    if (!pending) pending = checkBlocked().then((b) => (cached = b));
    pending.then(setBlocked);
  }, []);

  return blocked;
}
