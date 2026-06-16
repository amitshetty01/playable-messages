"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export function DownloadCard({ shareUrl, title, subtitle, finalMessage }: { shareUrl: string; title: string; subtitle: string; finalMessage?: string }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(shareUrl, { width: 280, margin: 1, color: { dark: "#ffffff", light: "#18122b" } })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [shareUrl]);

  const download = useCallback(() => {
    if (!qrDataUrl) return;
    setGenerating(true);

    const size = 600;
    const pad = 40;
    const innerW = size - pad * 2;
    const qrSize = 200;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    const cardHeight = finalMessage ? size + 120 : size;
    canvas.height = cardHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setGenerating(false); return; }

    const grad = ctx.createLinearGradient(0, 0, size, cardHeight);
    grad.addColorStop(0, "#07050e");
    grad.addColorStop(0.48, "#18122b");
    grad.addColorStop(1, "#32165f");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, cardHeight, 48);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.roundRect(12, 12, size - 24, cardHeight - 24, 40);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px 'Inter', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, size / 2, pad + 40);

    if (finalMessage) {
      ctx.font = "bold 20px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      const maxW = innerW - 40;
      const words = finalMessage.split(" ");
      let lines: string[] = [];
      let current = "";
      for (const w of words) {
        const test = current + (current ? " " : "") + w;
        if (ctx.measureText(test).width > maxW) { lines.push(current); current = w; }
        else current = test;
      }
      if (current) lines.push(current);
      lines = lines.slice(0, 4);
      let ly = pad + 90;
      for (const l of lines) {
        ctx.fillText(l, size / 2, ly);
        ly += 30;
      }
    }

    ctx.font = "18px 'Inter', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(subtitle, size / 2, (finalMessage ? pad + 200 : pad + 86));

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const qrY = finalMessage ? pad + 210 : (size - qrSize) / 2;
      ctx.drawImage(img, (size - qrSize) / 2, qrY, qrSize, qrSize);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px 'Inter', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("craftyourmessage.com", size / 2, cardHeight - pad - 12);

      const link = document.createElement("a");
      link.download = "craft-your-message-card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      setGenerating(false);
    };
    img.src = qrDataUrl;
  }, [qrDataUrl, title, subtitle, finalMessage]);

  if (!shareUrl) return null;

  return (
    <div className="mt-4">
      <button className="ghost-button" type="button" disabled={!qrDataUrl || generating} onClick={download}>
        {generating ? "Preparing card..." : "Download share card"}
      </button>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
