const CACHE_NAME = "craftmsg-v1";
const STATIC_ASSETS = [
  "/",
  "/templates",
  "/create",
  "/globals.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (url.pathname.startsWith("/_next/static") || url.pathname.match(/\.(css|js|png|ico|svg|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response.clone());
          return response;
        });
      }))
    );
    return;
  }

  event.respondWith(
    fetch(request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, response.clone());
        return response;
      });
    }).catch(() => caches.match(request).then((cached) => cached || new Response("Offline", { status: 503 })))
  );
});
