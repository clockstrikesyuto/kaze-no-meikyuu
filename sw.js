const CACHE='kaze-no-meikyuu-v5';
const ASSETS=[
  './','./index.html','./loader.v5.js','./v5-data.js','./v5-patch.js',
  './v5-world.gz.part.00','./v5-world.gz.part.01',
  './v5-ui.gz.part.00','./v5-ui.gz.part.01',
  './v5-css.gz.part.00','./manifest.webmanifest'
];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return resp;
    }).catch(()=>caches.match(e.request))
  );
});