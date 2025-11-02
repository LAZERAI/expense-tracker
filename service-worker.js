self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('expense-tracker-v1').then(cache => cache.addAll([
    './',
    './index.html',
    './styles.css',
    './script.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
  ])));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open('expense-tracker-v1').then(cache => cache.put(e.request, copy));
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
