const CACHE='kaze-no-meikyuu-v4r1';
const ASSETS=['./','./index.html','./loader.v4.js','./game.v4.p0.0','./game.v4.p0.1','./game.v4.p0.2','./game.v4.p0.3','./game.v4.part.1','./game.v4.p2.0','./game.v4.p2.1','./game.v4.p2.2','./game.v4.p2.3','./game.v4.part.3','./style.v4.part.0','./manifest.webmanifest'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;}).catch(()=>caches.match(e.request)));});
