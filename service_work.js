const CACHE_NAME = 'static-cache-v2';
const FILES_TO_CACHE = [
  'index.html',

];

// Устанавливаем service worker и кэшируем все содержимое
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE_NAME).then(c => c.addAll(FILES_TO_CACHE))));

// Извлекаем содержимое из кэша, если оно доступно, для 
// автономной поддержки и кэшируем новые ресурсы, если они доступны.
self.addEventListener('fetch', e => e.respondWith(
  caches.match(e.request).then((r) => {
    return r || fetch(e.request).then((res) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(e.request, res.clone());
        return res;
      })
    })
  })
));

// Чистим кэш
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
      if(CACHE_NAME.indexOf(key) === -1) {
        return caches.delete(key);
      }
    }));
  })
));