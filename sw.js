const CACHE_NAME = 'unem-iscae-v28'; // غير الرقم عند كل تحديث

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/icon-192.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // مهم للتحديث الفوري

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // مهم جداً
  );
});

self.addEventListener('fetch', event => {

  // لا تكاشي index.html حتى يصل التحديث
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
