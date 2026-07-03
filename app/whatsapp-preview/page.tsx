"use client";

import { useState } from "react";
import Link from "next/link";

export default function WhatsAppPreviewPage() {
  const [message, setMessage] = useState("Happy Birthday! 🎂");
  const [sender, setSender] = useState("Your Name");
  const [bgColor, setBgColor] = useState("#15101f");
  const [accentColor, setAccentColor] = useState("#f472b6");

  const previewStyle = {
    backgroundColor: bgColor,
    width: 320,
    height: 420,
    borderRadius: 24,
    padding: 24,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <div className="space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Mini preview</p>
        <h1 className="display-title mt-3 text-4xl font-bold sm:text-6xl">WhatsApp & Story preview</h1>
        <p className="mt-4 max-w-3xl text-white/70">Design a beautiful preview card optimized for WhatsApp status, Instagram stories, and social media sharing.</p>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Customize</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/50 mb-1">Message text</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input w-full" rows={3} />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 mb-1">Sender name</label>
              <input value={sender} onChange={(e) => setSender(e.target.value)} className="input w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/50 mb-1">Background</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full rounded-xl cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 mb-1">Accent</label>
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-10 w-full rounded-xl cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div style={previewStyle} className="shadow-2xl">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: accentColor }}>
                  <span className="text-lg font-bold text-white">{sender[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{sender}</p>
                  <p className="text-[10px] text-white/40">Just now</p>
                </div>
              </div>
              <div className="rounded-2xl p-4" style={{ backgroundColor: `${accentColor}20` }}>
                <p className="text-base leading-relaxed text-white/90">{message}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-white/30 mb-2">craftyourmessage.com</p>
              <div className="flex justify-center gap-4">
                <span className="text-lg">💬</span>
                <span className="text-lg">❤️</span>
                <span className="text-lg">↗️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="flex flex-wrap justify-center gap-3">
        <Link className="premium-button" href="/create">Create interactive message</Link>
        <Link className="ghost-button" href="/explore">Explore</Link>
      </section>
    </div>
  );
}
