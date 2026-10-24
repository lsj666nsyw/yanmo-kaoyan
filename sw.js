/* 研墨 · 考研英语 — 离线缓存
   单文件版本身可离线打开；这里让在线版在首次加载后也能断网重开。
   更新部署时请把 CACHE 的版本号改掉（例如日期 +1），否则浏览器会继续用旧缓存。 */
const CACHE = "yanmo-kaoyan-v1-20261024";
const CORE = [
  "./",
  "./index.html",
  "./assets/style.css",
  "./js/app.js",
  "./data/all-data.js",
  "./data/vocab-detail-data.js",
  "./vendor/mespeak/mespeak-core.js",
  "./vendor/mespeak/mespeak.js",
  "./vendor/mespeak/voice-en-us.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(CORE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (key) {
          return key === CACHE ? null : caches.delete(key);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // 有道 / 百度的在线发音不缓存；跨源请求直接交给浏览器。
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith("/sw.js")) return;

  // 页面导航：优先拿新版本；断网时回到缓存的首页。
  // 导航响应不写入缓存，避免 ?query 之类的一次性地址越攒越多。
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(function () {
        return caches.match("./index.html").then(function (hit) {
          return hit || caches.match("./");
        });
      })
    );
    return;
  }

  // 静态资源：先给缓存（秒开），后台再取新版本；首次访问则直接走网络。
  event.respondWith(
    caches.match(req).then(function (hit) {
      const network = fetch(req).then(function (res) {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(function (cache) { return cache.put(req, copy); }).catch(function () {});
        }
        return res;
      });
      return hit || network;
    })
  );
});
