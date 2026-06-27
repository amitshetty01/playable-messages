const BOT_PATTERN = /bot|crawl|spider|scrape|google|bing|yahoo|duckduckgo|baidu|yandex|facebookexternalhit|twitterbot/i;

function isCrawler(): boolean {
  if (typeof navigator === "undefined") return true;
  return BOT_PATTERN.test(navigator.userAgent);
}

const BLOCKED_HOSTS = [
  "realizationnewestfangs.com",
  "kettledroopingcontinuation.com",
  "protrafficinspector.com",
];

function installMainPageGuard() {
  const origOpen = window.open.bind(window);
  window.open = (url, ...rest) => {
    const s = url?.toString() ?? "";
    if (BLOCKED_HOSTS.some((h) => s.includes(h))) return null;
    return origOpen(url, ...rest);
  };
}

if (typeof window !== "undefined") installMainPageGuard();

let queue: Promise<void> = Promise.resolve();

export function enqueueBannerAd(key: string, src: string, height: number, width: number, container: HTMLElement) {
  if (isCrawler()) return Promise.resolve();
  const result = queue.then(() => new Promise<void>((resolve) => {
    const conf = document.createElement("script");
    conf.innerHTML = `atOptions = ${JSON.stringify({ key, format: "iframe", height, width, params: {} })};`;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => setTimeout(resolve, 200);
    script.onerror = () => resolve();
    container.appendChild(conf);
    container.appendChild(script);
  }));
  queue = result.catch(() => {});
  return result;
}
