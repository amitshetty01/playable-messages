export function enhanceImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const w = img.width;
      const h = img.height;
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) { resolve(dataUrl); return; }

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      const brightnessBoost = 1.08;
      const contrast = 1.15;
      const warmthR = 1.04;
      const warmthG = 1.0;
      const warmthB = 0.96;
      const saturation = 1.1;

      let rTotal = 0, gTotal = 0, bTotal = 0;
      const pixelCount = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        rTotal += data[i];
        gTotal += data[i + 1];
        bTotal += data[i + 2];
      }
      const avgR = rTotal / pixelCount;
      const avgG = gTotal / pixelCount;
      const avgB = bTotal / pixelCount;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        r *= brightnessBoost;
        g *= brightnessBoost;
        b *= brightnessBoost;

        r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
        g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
        b = ((b / 255 - 0.5) * contrast + 0.5) * 255;

        r *= warmthR;
        g *= warmthG;
        b *= warmthB;

        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        const dR = r - avgR * brightnessBoost;
        const dG = g - avgG * brightnessBoost;
        const dB = b - avgB * brightnessBoost;
        const dist = Math.sqrt((i / 4) % w - w / 2) ** 2 + (Math.floor(i / 4 / w) - h / 2) ** 2;
        const maxDist = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);
        const vignette = 1 - (dist / maxDist) * 0.12;
        r = (avgR * brightnessBoost + dR) * vignette;
        g = (avgG * brightnessBoost + dG) * vignette;
        b = (avgB * brightnessBoost + dB) * vignette;

        data[i] = Math.max(0, Math.min(255, Math.round(r)));
        data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
        data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
