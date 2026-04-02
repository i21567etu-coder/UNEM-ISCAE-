// قم بتغيير هذا الرقم في كل مرة تقوم بتحديث الموقع ليظهر الإشعار للمستخدمين
// لتجربة النتائج، يمكنك تغييره إلى: unem-iscae-v25.2
const CACHE_NAME = 'unem-iscae-v25.2';

const urlsToCache =[
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png'
];

// حدث التثبيت: نقوم بتخزين الملفات بطريقة آمنة
// نستخدم Promise.all بدلاً من cache.addAll لمنع تعطل التحديث بالكامل إذا كان أحد الملفات مفقوداً
// ولا نجبر المتصفح على التحديث فوراً حتى يتسنى للمستخدم رؤية إشعار "يتوفر تحديث جديد".
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn('لم يتم العثور على الملف، سيتم تجاوزه لضمان استمرار التحديث:', url);
            });
          })
        );
      })
  );
});

// حدث التفعيل: مسح أي نسخ قديمة من الكاش من هواتف المستخدمين
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
    })
  );
});

// جلب الملفات: الاستراتيجية تعتمد على جلب الملف من الكاش أولاً إن وجد
self.addEventListener('fetch', event => {
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

// الاستماع لرسالة زر "تحديث الآن" من واجهة الموقع
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
