// قم بتغيير هذا الرقم في كل مرة تقوم بتحديث الموقع ليظهر الإشعار للمستخدمين
const CACHE_NAME = 'unem-iscae-V52';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './moyenne/',
  './moyenne/index.html',
  './resultats/',
  './resultats/index.html'
];

// الصفحات التي تستخدم استراتيجية Network-First (دائماً من الشبكة أولاً)
// هذا يضمن أن المستخدمين المثبِّتين يرون التحديثات فوراً مثل باقي المستخدمين
const NETWORK_FIRST_URLS = [
  '/',
  '/index.html',
  '/moyenne',
  '/moyenne/',
  '/moyenne/index.html',
  '/resultats',
  '/resultats/',
  '/resultats/index.html'
];

// حدث التثبيت: نقوم بتخزين الملفات، لكن *لا نجبر* المتصفح على التحديث فوراً
// حتى يتسنى للمستخدم رؤية إشعار "يتوفر تحديث جديد" والضغط عليه.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// حدث التفعيل: مسح أي نسخ قديمة من الكاش من هواتف المستخدمين
// + self.clients.claim() ضروري لـ iOS ليأخذ Service Worker الجديد السيطرة فوراً
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('حذف كاش قديم:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // يُجبر المتصفح (خصوصاً iOS Safari) على استخدام SW الجديد فوراً
      // بدون هذا السطر، يظل iOS يستخدم SW القديم حتى إغلاق جميع تبويبات الموقع
      return self.clients.claim();
    })
  );
});

// جلب الملفات:
// - صفحة /moyenne: Network-First (دائماً من الشبكة أولاً لضمان أحدث نسخة)
// - باقي الصفحات: Cache-First (من الكاش للسرعة)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isNetworkFirst = NETWORK_FIRST_URLS.some(
    path => url.pathname === path || url.pathname.startsWith(path)
  );

  if (isNetworkFirst) {
    // Network-First: اجلب من الشبكة أولاً، وإذا فشل استخدم الكاش كاحتياطي
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // إذا نجح الطلب، احفظ النسخة الجديدة في الكاش وأرجعها
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // إذا فشلت الشبكة (مثلاً بدون إنترنت)، ارجع للكاش
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-First: من الكاش للسرعة، ومن الشبكة إذا لم يوجد
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});

// الاستماع لرسالة زر "تحديث الآن" من واجهة الموقع
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
