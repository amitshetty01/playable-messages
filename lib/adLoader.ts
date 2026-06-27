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
    const f = document.createElement("iframe");
    f.setAttribute("title", "Advertisement");
    f.style.cssText = `border:0;overflow:hidden;display:block;width:${width}px;max-width:100%;height:${height}px`;
    const html = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;overflow:hidden}</style></head><body>
<script>
var _at=${JSON.stringify({ key, format: "iframe", height, width, params: {} })};
window.atOptions=_at;
<\/script>
<script src="${src}" async><\/script>
</body></html>`;
    f.srcdoc = html;
    container.appendChild(f);
    resolve();
  }));
  queue = result.catch(() => {});
  return result;
}
