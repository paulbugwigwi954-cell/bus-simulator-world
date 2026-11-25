// Service worker: huruhusu mchezo ufunguke bila intaneti baada ya kufunguliwa mara ya kwanza.
// Ukibadilisha faili za mchezo, ongeza namba ya VERSION ili simu zichukue mpya.
const VERSION = 'safari-v4';
const SHELL = ['./', './index.html', './manifest.webmanifest', './config.js', './supabase.js', './career.js', './data.js', './world.js', './vehicles.js', './cockpit.js', './drive.js', './stations.js', './terrain.js', './phys.js', './traffic.js', './tickets.js', './settings.js', './music.js', './map.js', './pwa.js',
  './models/marcopolo_ideale.glb', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];
const CDN = ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js', 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(SHELL.concat(CDN).map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || !/^https?:$/.test(u.protocol) || u.hostname.endsWith('supabase.co')) return;   // Supabase (alama, pesa, rekodi) daima mtandaoni
  if (u.origin === location.origin) {                                                                      // faili za mchezo: mtandao kwanza (sekunde 4), kisha akiba; offline inafunguka papo hapo
    e.respondWith((async () => {
      const net = fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(VERSION).then(c => c.put(r, cp)) } return res }); net.catch(() => {});
      try { return await Promise.race([net, new Promise((_, j) => setTimeout(() => j(0), 4000))]) }
      catch (err) { const m = (await caches.match(r, { ignoreSearch: true })) || (r.mode === 'navigate' && (await caches.match('./index.html'))); return m || net.catch(() => Response.error()) }
    })());
  } else {                                                                                                 // CDN (three.js n.k.): akiba kwanza
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(VERSION).then(c => c.put(r, cp)) } return res })));
  }
});
