/* Service Worker — MES Cáp/Dây điện
   Cache "app shell" để mở được cả khi mất mạng (sau lần tải đầu tiên thành công). */

const CACHE_VERSION = "mes-cap-v3";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {}) // không chặn cài đặt nếu 1 vài asset lỗi (vd. offline lần đầu)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Chiến lược:
// - Tài liệu HTML chính (index.html): network-first, để luôn lấy bản mới nhất khi có mạng,
//   rơi về cache khi mất mạng.
// - Các tài nguyên khác (thư viện CDN, font, ảnh...): cache-first, để tải nhanh & dùng offline.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const isHTMLNavigation =
    req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (isHTMLNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (res.type === "basic" || res.type === "cors")) {
            const resClone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
