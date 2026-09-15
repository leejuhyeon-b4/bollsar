const CACHE_VERSION = 'v24';
const CACHE_PREFIX = 'hongcal-';
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const LEGACY_CACHE_PREFIXES = ['aebaeryeok-'];

const APP_SHELL = [
  './',
  './index.html',
  './settlement.html',
  './settlement-export.html',
  './manifest.json',
  './data.js',
  './pwa-install.js',
  './ref/fonts.css',
  './ref/gsap.min.js',
  './ref/html2canvas-1.4.1.min.js',
  './ref/fonts/cafe24ssurroundair-400.woff2',
  './ref/fonts/hahmlet-400.woff2',
  './ref/fonts/hahmlet-700.woff2',
  './ref/fonts/playfair-700.woff2',
  './ref/fonts/playfair-700i.woff2',
  './ref/fonts/playfair-900.woff2',
  './ref/fonts/plexmono-500.woff2',
  './ref/fonts/plexmono-600.woff2',
  './ref/fonts/unifraktur-400.woff2',
  './ref/settlement-export-bg.png',
  './ref/c-hole-mask.png',
  './ref/KakaoTalk_20260909_174603341.jpg',
  './ref/KakaoTalk_20260909_174603341_01.jpg',
  './ref/icon.jpg',
  './ref/icon-192.png',
  './ref/icon-512.png',
  './ref/apple-touch-icon.png'
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
