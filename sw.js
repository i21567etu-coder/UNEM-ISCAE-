// لتجربة التحديثات، غير هذا الرقم (مثال: unem-iscae-v27 أو unem-iscae-v27.1)
const CACHE_NAME = 'unem-iscae-v26';

const urlsToCache =[
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn('تجاوز ملف مفقود:', url);
            });
          })
        );
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
    })
  );
});

self.addEventListener('fetch', event => {
  // 🚀 أمر صارم: إذا كان الطلب لقراءة ملف sw.js دعه يمر للإنترنت فوراً ولا تتدخل
  if (event.request.url.includes('sw.js')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // باقي الملفات استخدم الكاش لتسريع الموقع
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
