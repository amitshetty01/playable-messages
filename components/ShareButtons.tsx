"use client";

import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState<"link" | "whatsapp" | "instagram" | null>(null);

  async function copy(type: "link" | "instagram") {
    await navigator.clipboard.writeText(url);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1800);
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url, text: "Open this interactive message experience." });
      return;
    }
    await copy("link");
  }

  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(`${title}: ${url}`)}`;

  return (
    <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
      <button className="ghost-button" type="button" onClick={() => copy("link")} aria-label="Copy link to clipboard">{copied === "link" ? "Copied ✓" : "Copy Link"}</button>
      <a className="ghost-button" href={whatsAppUrl} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp">
        <svg className="mr-1.5 inline-block h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.48 2 2 6.48 2 12c0 2.06.628 3.978 1.702 5.564L2 22l4.553-1.662A9.952 9.952 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
        WhatsApp
      </a>
      <button className="ghost-button" type="button" onClick={() => copy("instagram")} aria-label="Copy link for Instagram">
        <svg className="mr-1.5 inline-block h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        {copied === "instagram" ? "Link copied!" : "Instagram"}
      </button>
      <button className="ghost-button" type="button" onClick={nativeShare} aria-label="Share using native share dialog">Native Share</button>
    </div>
  );
}
