"use client";

import { useState } from "react";

type SharePlatform = "link" | "whatsapp" | "instagram" | "facebook" | "twitter" | "telegram" | "snapchat" | "sms";

const NativeShareIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const ShareIcons: Record<SharePlatform, { label: string; icon: React.ReactNode }> = {
  link: {
    label: "Copy Link",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
  },
  whatsapp: { label: "WhatsApp", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173 1.413-.074-.124-.272-.198-.57-.347zM12 2C6.48 2 2 6.48 2 12c0 2.06.628 3.978 1.702 5.564L2 22l4.553-1.662A9.952 9.952 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg> },
  facebook: { label: "Facebook", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  twitter: { label: "X", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  telegram: { label: "Telegram", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
  snapchat: { label: "Snapchat", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.48 15.26c-.2.1-.43.18-.68.24-.25.06-.47.22-.64.46-.18.24-.42.52-.72.64-.3.12-.61.15-.93.15-.32 0-.63-.03-.93-.15-.3-.12-.54-.4-.72-.64-.17-.24-.39-.4-.64-.46-.25-.06-.48-.14-.68-.24-.2-.1-.36-.28-.15-.34.2-.06.56-.08.81-.13.53-.1.6-.35.6-.7 0-.16-.02-.34-.04-.52-.32.04-.66.06-1.02.06-1.9 0-3.42-.8-3.42-1.8 0-.38.25-.7.6-.9.22-.12.48-.2.74-.26-.06-.12-.1-.25-.1-.38 0-.28.14-.52.36-.68.18-.13.4-.2.62-.22.12-.02.24-.02.36-.02.3 0 .56.18.7.46.1.18.14.38.14.58 0 .18-.04.36-.1.52.16-.02.34-.04.52-.04h.04c.18 0 .36.02.52.04-.06-.16-.1-.34-.1-.52 0-.2.04-.4.14-.58.14-.28.4-.46.7-.46.12 0 .24 0 .36.02.22.02.44.1.62.22.22.16.36.4.36.68 0 .13-.04.26-.1.38.26.06.52.14.74.26.35.2.6.52.6.9 0 1-1.52 1.8-3.42 1.8-.36 0-.7-.02-1.02-.06-.02.18-.04.36-.04.52 0 .35.07.6.6.7.25.05.61.07.81.13.21.06.05.24-.15.34z"/></svg> },
  sms: { label: "SMS", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  instagram: { label: "Instagram", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
};

const shareUrls: Record<SharePlatform, (url: string, title: string) => string> = {
  link: (url) => url,
  whatsapp: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title}: ${url}`)}`,
  instagram: (url) => url,
  facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (url, title) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  telegram: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  snapchat: (url, title) => `https://www.snapchat.com/scroll/add/spotlight?shareUrl=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  sms: (url, title) => `sms:?body=${encodeURIComponent(`${title}: ${url}`)}`,
};

type ShareButtonsProps = {
  url: string;
  title: string;
  platforms?: SharePlatform[];
  className?: string;
};

export function ShareButtons({ url, title, platforms = ["whatsapp", "facebook", "twitter", "telegram", "link"], className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url, text: title });
      return;
    }
    await copyLink();
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {platforms.map((platform) => {
        const info = ShareIcons[platform];
        if (platform === "link") {
          return (
            <button
              key={platform}
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/75 transition hover:bg-white/15 hover:text-white"
              aria-label="Copy link"
            >
              {copied ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : info.icon}
              {copied ? "Copied!" : info.label}
            </button>
          );
        }

        const href = shareUrls[platform](url, title);
        const isExternal = platform !== "sms";

        return (
          <a
            key={platform}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/75 transition hover:bg-white/15 hover:text-white"
            aria-label={`Share on ${info.label}`}
          >
            {info.icon}
            {info.label}
          </a>
        );
      })}
      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/75 transition hover:bg-white/15 hover:text-white"
        aria-label="Share this message"
      >
        {NativeShareIcon}
        Share
      </button>
    </div>
  );
}
