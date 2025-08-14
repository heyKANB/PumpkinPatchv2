// Service Worker for PWA caching
const CACHE_NAME = 'pumpkin-farm-3d-v3.0.0';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/sounds/hit.mp3',
  '/sounds/success.mp3',
  '/sounds/background.mp3',
  '/textures/grass.png',
  '/textures/wood.jpg',
  '/textures/sky.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});