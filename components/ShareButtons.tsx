"use client";

import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url, text: "Open this interactive message experience." });
      return;
    }
    await copy();
  }

  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(`${title}: ${url}`)}`;

  return (
    <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
      <button className="ghost-button" type="button" onClick={copy}>{copied ? "Copied" : "Copy Link"}</button>
      <a className="ghost-button" href={whatsAppUrl} target="_blank" rel="noreferrer">WhatsApp Share</a>
      <button className="ghost-button" type="button" onClick={nativeShare}>Native Share</button>
    </div>
  );
}
