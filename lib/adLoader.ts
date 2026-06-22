let queue: Promise<void> = Promise.resolve();

export function enqueueBannerAd(key: string, src: string, height: number, width: number, container: HTMLElement) {
  const result = queue.then(() => new Promise<void>((resolve) => {
    (window as any).atOptions = { key, format: "iframe", height, width, params: {} };
    const invoke = document.createElement("script");
    invoke.src = src;
    invoke.async = true;
    invoke.onload = () => resolve();
    invoke.onerror = () => resolve();
    container.appendChild(invoke);
  }));
  queue = result.catch(() => {});
  return result;
}
