// const CACHE_NAME = 'unem-iscae-v27.4'; // غيّر الرقم عند كل تحديث

const urlsToCache = [
  // './index.html',   // لا تخزِّن index.html في الكاش
  './manifest.json',
  './logo.png',
  './icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // تثبيت العامل الجديد فوراً
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    }).then(() => clients.claim()) // السيطرة على الصفحات المفتوحة دون إعادة تحميل
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // استراتيجية Network First لـ index.html
  if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // لملف sw.js نفسه: دائماً من الشبكة (موجود بالفعل)
  if (event.request.url.includes('sw.js')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // باقي الملفات: Cache First
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
