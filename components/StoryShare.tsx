"use client";

import { useRef, useEffect, useState, useCallback } from "react";

type StoryShareProps = {
  message: string;
  receiverName: string;
  creatorName: string;
  onClose?: () => void;
};

export function StoryShare({ message, receiverName, creatorName, onClose }: StoryShareProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#1a0a2e");
    gradient.addColorStop(0.5, "#2d1b3d");
    gradient.addColorStop(1, "#0d0d0d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = "rgba(255, 255, 255, 0.05)";
    ctx.shadowBlur = 100;
    ctx.fillStyle = "rgba(255, 182, 193, 0.08)";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 400, 350, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
    ctx.fillText("I made something for you", canvas.width / 2, 320);

    ctx.font = "120px system-ui, sans-serif";
    ctx.fillText("💌", canvas.width / 2, 520);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 72px system-ui, -apple-system, sans-serif";
    ctx.fillText(`For ${receiverName || "You"}`, canvas.width / 2, 700);

    const displayMessage = message.length > 120 ? message.slice(0, 117) + "..." : message;
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "40px system-ui, -apple-system, sans-serif";

    const maxWidth = 800;
    const lineHeight = 60;
    const words = displayMessage.split(" ");
    let y = 820;
    let line = "";
    for (const word of words) {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== "") {
        ctx.fillText(line.trim(), canvas.width / 2, y);
        line = word + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), canvas.width / 2, y);

    if (creatorName && creatorName !== "Someone") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
      ctx.fillText(`— ${creatorName}`, canvas.width / 2, y + 120);
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.font = "28px system-ui, -apple-system, sans-serif";
    ctx.fillText("Craft Your Message ✨", canvas.width / 2, canvas.height - 120);

    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.font = "24px system-ui, -apple-system, sans-serif";
    ctx.fillText("Tap to open your interactive message", canvas.width / 2, canvas.height - 60);

    canvas.toBlob((blob) => {
      if (blob) setImageBlob(blob);
    }, "image/png");
  }, [message, receiverName, creatorName]);

  const download = useCallback(() => {
    if (!imageBlob) return;
    const url = URL.createObjectURL(imageBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "craft-your-message.png";
    a.click();
    URL.revokeObjectURL(url);
  }, [imageBlob]);

  const shareToInstagram = useCallback(async () => {
    if (!imageBlob) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Craft Your Message",
          text: "I made something for you 💌",
          files: [new File([imageBlob], "craft-your-message.png", { type: "image/png" })],
        });
      } catch {
        download();
      }
    } else {
      download();
    }
  }, [imageBlob, download]);

  const copyToClipboard = useCallback(async () => {
    if (!imageBlob) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": imageBlob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      download();
    }
  }, [imageBlob, download]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass rounded-[2rem] p-6 max-w-sm w-full text-center">
        <p className="text-sm font-bold text-white/60 mb-4">Share to Story</p>
        <canvas ref={canvasRef} className="w-full max-w-[280px] mx-auto rounded-2xl shadow-2xl" style={{ aspectRatio: "1080/1920" }} />
        <div className="mt-5 flex flex-col gap-3">
          <button type="button" onClick={shareToInstagram} className="premium-button text-sm">
            📱 Share to Instagram / WhatsApp
          </button>
          <button type="button" onClick={copyToClipboard} className="ghost-button text-sm">
            {copied ? "✅ Copied!" : "📋 Copy image"}
          </button>
          <button type="button" onClick={download} className="ghost-button text-sm">
            💾 Download image
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
