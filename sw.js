const CACHE_VERSION = 'v49';
const CACHE_PREFIX = 'bollsar-';
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const LEGACY_CACHE_PREFIXES = ['hongcal-', 'aebaeryeok-'];

const APP_SHELL = [
  './',
  './index.html',
  './settlement.html',
  './settlement-app.js',
  './settlement-export.html',
  './settlement-export.js',
  './seat-lines.js',
  './manifest.json',
  './productions/elisabeth-2026-6th/data/schedule.js',
  './productions/elisabeth-2026-6th/data/seat-map.js',
  './data.js',
  './theme-registry.js',
  './schedule-app.js',
  './themes/elisabeth-2026-6th-lucheni/schedule/view.js',
  './pwa-install.js',
  './themes/elisabeth-2026-6th-lucheni/fonts/fonts.css',
  './assets/common/gsap.min.js',
  './assets/common/html2canvas-1.4.1.min.js',
  './themes/elisabeth-2026-6th-lucheni/fonts/cafe24ssurroundair-400.woff2',
  './themes/elisabeth-2026-6th-lucheni/fonts/hahmlet-400.woff2',
  './themes/elisabeth-2026-6th-lucheni/fonts/hahmlet-700.woff2',
  './themes/elisabeth-2026-6th-lucheni/fonts/playfair-700.woff2',
  './themes/elisabeth-2026-6th-lucheni/fonts/playfair-700i.woff2',
  './themes/elisabeth-2026-6th-lucheni/fonts/playfair-900.woff2',
  './themes/elisabeth-2026-6th-lucheni/fonts/plexmono-500.woff2',
  './themes/elisabeth-2026-6th-lucheni/fonts/plexmono-600.woff2',
  './themes/elisabeth-2026-6th-lucheni/fonts/unifraktur-400.woff2',
  './themes/elisabeth-2026-6th-lucheni/assets/settlement/settlement-export-background.png',
  './themes/elisabeth-2026-6th-lucheni/assets/schedule/calendar-photo.jpg',
  './themes/elisabeth-2026-6th-lucheni/assets/schedule/lead-photo.jpg',
  './assets/common/icon-192.png',
  './assets/common/icon-512.png',
  './assets/common/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => (
            (key.startsWith(CACHE_PREFIX) || LEGACY_CACHE_PREFIXES.some(prefix => key.startsWith(prefix)))
            && key !== CACHE_NAME
          ))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirstPage (request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;

    const url = new URL(request.url);
    const fallback = url.pathname.endsWith('/settlement.html')
      ? './settlement.html'
      : './index.html';
    return caches.match(fallback);
  }
}

async function cacheFirst (request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}
