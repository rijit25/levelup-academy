const CACHE_NAME = 'levelup-v2';
const ASSETS = [
  './index.html',
  './css/main.css',
  './js/app.js',
  './js/engine/gamification.js',
  './js/engine/funny-system.js',
  './js/engine/session-manager.js',
  './js/modules/math-arena.js',
  './js/modules/language-academy.js',
  './js/modules/grammar-academy.js',
  './js/modules/science.js',
  './js/modules/coloring.js',
  './js/views/auth-view.js',
  './data/vocab-fr.js',
  './data/vocab-en.js',
  './data/grammar-fr.js',
  './data/grammar-en.js',
  './data/science-fr.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
