export function compressImage(dataUrl: string, maxW = 800, maxH = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxW && height <= maxH) {
        resolve(dataUrl);
        return;
      }
      if (width > maxW) { height *= maxW / width; width = maxW; }
      if (height > maxH) { width *= maxH / height; height = maxH; }

      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const ctx = c.getContext("2d");
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
