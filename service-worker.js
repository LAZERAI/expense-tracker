const CACHE_VERSION = 'expense-tracker-v3';
const CDN_CACHE = 'expense-tracker-cdn-v2';

// Install: Cache app shell
self.addEventListener('install', (e) => {
  console.log('[SW] Installing...');
  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      console.log('[SW] Caching app shell');
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/auth.js',
        '/icons.svg',
        '/manifest.webmanifest'
      ]);
    }).then(() => {
      console.log('[SW] Install complete');
      self.skipWaiting(); // Activate immediately
    }).catch(err => {
      console.error('[SW] Install failed:', err);
    })
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_VERSION && key !== CDN_CACHE)
        .map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// Fetch: Stale-while-revalidate for CDN, cache-first for app
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // CDN assets: stale-while-revalidate
  if (url.hostname.includes('cdn.jsdelivr.net') || url.hostname.includes('gstatic.com')) {
    e.respondWith(
      caches.open(CDN_CACHE).then(cache => 
        cache.match(e.request).then(cached => {
          const fetchPromise = fetch(e.request).then(response => {
            cache.put(e.request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // App assets: cache-first with network fallback
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).then(r => {
      if (r.ok && e.request.method === 'GET') {
        const copy = r.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
