const CACHE_VERSION = 'v46';
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
  './data.js',
  './pwa-install.js',
  './assets/common/fonts.css',
  './assets/common/gsap.min.js',
  './assets/common/html2canvas-1.4.1.min.js',
  './assets/common/fonts/cafe24ssurroundair-400.woff2',
  './assets/common/fonts/hahmlet-400.woff2',
  './assets/common/fonts/hahmlet-700.woff2',
  './assets/common/fonts/playfair-700.woff2',
  './assets/common/fonts/playfair-700i.woff2',
  './assets/common/fonts/playfair-900.woff2',
  './assets/common/fonts/plexmono-500.woff2',
  './assets/common/fonts/plexmono-600.woff2',
  './assets/common/fonts/unifraktur-400.woff2',
  './themes/elisabeth-2026-6th-lucheni/assets/settlement-export-background.png',
  './themes/elisabeth-2026-6th-lucheni/assets/calendar-photo.jpg',
  './themes/elisabeth-2026-6th-lucheni/assets/lead-photo.jpg',
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
