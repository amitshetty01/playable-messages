"use client";

import { useState } from "react";

export function EmbedCode({ experienceId, experienceUrl }: { experienceId: string; experienceUrl: string }) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="${experienceUrl.replace("/experience/", "/embed/")}" width="100%" height="600" frameborder="0" allow="microphone; camera"></iframe>`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Embed this experience</p>
        <h3 className="mt-2 text-xl font-bold text-white">Share via iframe</h3>
        <p className="mt-2 text-sm text-white/60">Paste this code into your website or blog to embed the interactive experience.</p>

        <div className="mt-4 rounded-xl bg-black/30 p-4">
          <pre className="overflow-x-auto text-xs text-white/80">
            <code>{embedCode}</code>
          </pre>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={copyCode}
            className="premium-button"
          >
            {copied ? "Copied!" : "Copy embed code"}
          </button>
        </div>
      </div>

      <div className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Preview</p>
        <h3 className="mt-2 text-xl font-bold text-white">How it will look</h3>
        <p className="mt-2 text-sm text-white/60">Below is a preview of how the embedded experience will appear on your site.</p>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-white/40">Embed preview</span>
          </div>
          <div className="aspect-[16/9] w-full bg-black/20">
            <iframe
              src={experienceUrl.replace("/experience/", "/embed/")}
              className="h-full w-full"
              title="Embedded experience preview"
              allow="microphone; camera"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
