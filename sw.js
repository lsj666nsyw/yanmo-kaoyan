/* 研墨 · 考研英语 — 离线缓存
   单文件版本身可离线打开；这里让在线版在首次加载后也能断网重开。
   更新部署时请把 CACHE 的版本号改掉（例如日期 +1），否则浏览器会继续用旧缓存。 */
const CACHE = "yanmo-kaoyan-v1-20261027-2";
const CORE = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/style.css",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/apple-touch-icon.png",
  "./js/app.js",
  "./data/all-data.js",
  "./data/vocab-detail-data.js",
  "./vendor/mespeak/mespeak-core.js",
  "./vendor/mespeak/mespeak.js",
  "./vendor/mespeak/voice-en-us.js"
];

const OFFLINE_TEXT = "资源暂时不可用，请联网后重试。";

function offlineResponse() {
  return new Response(OFFLINE_TEXT, {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

function fetchWithTimeout(req, ms) {
  if (typeof AbortController === "undefined") {
    return fetch(req, { cache: "no-store" });
  }
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, ms);
  return fetch(req, { cache: "no-store", signal: controller.signal }).then(
    function (res) {
      clearTimeout(timer);
      return res;
    },
    function (err) {
      clearTimeout(timer);
      throw err;
    }
  );
}

function cachePut(req, res) {
  if (!res || !res.ok) return Promise.resolve();
  const copy = res.clone();
  return caches.open(CACHE)
    .then(function (cache) { return cache.put(req, copy); })
    .catch(function () { /* 缓存失败不影响当前请求 */ });
}

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

  // 页面导航：优先取最新 HTML，但最多等 3 秒；超时或断网回落到缓存。
  if (req.mode === "navigate") {
    event.respondWith(
      fetchWithTimeout(req, 3000).then(function (res) {
        if (res && res.ok && (url.pathname === "/" || url.pathname.endsWith("/index.html"))) {
          return cachePut("./index.html", res).then(function () { return res; });
        }
        return res;
      }).catch(function () {
        return caches.match("./index.html")
          .then(function (hit) { return hit || caches.match("./"); })
          .then(function (hit) { return hit || caches.match("./offline.html"); })
          .then(function (hit) { return hit || offlineResponse(); });
      })
    );
    return;
  }

  // 应用外壳：先给缓存，后台再取新版本。网络抖动时不会卡住启动。
  if (/\/(?:js\/app\.js|assets\/style\.css|manifest\.webmanifest|assets\/(?:icon-|apple-touch-icon))/.test(url.pathname)) {
    const cached = caches.match(req);
    const network = fetchWithTimeout(req, 5000).then(function (res) {
      if (res && res.ok) return cachePut(req, res).then(function () { return res; });
      return res;
    }).catch(function () { return null; });
    event.waitUntil(network.then(function () { /* keep SW alive for cache update */ }));
    event.respondWith(
      cached.then(function (hit) {
        if (hit) return hit;
        return network.then(function (res) { return res || offlineResponse(); });
      })
    );
    return;
  }

  // 数据与离线语音：先给缓存，首次访问再走网络。
  event.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetchWithTimeout(req, 10000).then(function (res) {
        return cachePut(req, res).then(function () { return res; });
      }).catch(function () { return offlineResponse(); });
    })
  );
});
