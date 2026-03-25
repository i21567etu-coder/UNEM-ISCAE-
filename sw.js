// ملف Service Worker بسيط لجعل الموقع تطبيقاً تقدمياً (PWA)
const CACHE_NAME = 'unem-pwa-v4';

self.addEventListener('install', (event) => {
    console.log('[Service Worker] تم التثبيت بنجاح');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] تم التفعيل');
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // ترك الاتصال بالإنترنت يعمل بشكل طبيعي (لجلب الملفات من جيتهاب وقاعدة البيانات)
    event.respondWith(fetch(event.request).catch(() => {
        return new Response('عذراً، أنت غير متصل بالإنترنت.');
    }));
});
