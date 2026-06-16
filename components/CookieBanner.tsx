"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "cookie-consent-v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-ink/95 p-4 backdrop-blur-2xl sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-sm sm:rounded-2xl sm:border">
      <p className="text-sm leading-relaxed text-white/70">
        This site stores your draft messages locally and tracks basic analytics (opens, completions) to improve your experience.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={accept} className="rounded-full bg-white px-5 py-2 text-sm font-bold text-ink transition hover:bg-white/90">OK</button>
        <a href="/privacy" className="rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-white/60 transition hover:bg-white/10">Privacy</a>
      </div>
    </div>
  );
}
