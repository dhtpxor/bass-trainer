/* 오프라인 동작: 앱 파일은 미리 저장하고, 열 때마다 뒤에서 새 버전으로 갈아 둔다 */
const VERSION = 'bass-trainer-v9';
const SHELL = ['./', 'index.html', 'styles.css', 'theory.js', 'content.js', 'guitar.js', 'app.js', 'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'icon-180.png', 'icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== 'bass-fonts').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const key = req.mode === 'navigate' ? 'index.html' : req;
      const hit = await c.match(key, {ignoreSearch: true});
      const net = fetch(req).then(r => { if (r.ok) c.put(key, r.clone()); return r; }).catch(() => null);
      return hit || (await net) || new Response('오프라인입니다', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
    }));
    return;
  }
  if (url.hostname === 'cdn.jsdelivr.net' || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open('bass-fonts').then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      try { const r = await fetch(req); if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; } catch (err) { return new Response('', {status: 504}); }
    }));
  }
});
