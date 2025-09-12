const CACHE_NAME = 'serenamente-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
  // Agrega aquí tus recursos adicionales (audios, imágenes, etc)
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
    .then(response => response || fetch(e.request))
  );
});
