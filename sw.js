// Bei jeder Änderung an index.html, Manifest oder Icons VERSION erhöhen, damit Geräte die neue Fassung laden.
const VERSION='zaehler-v1';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(VERSION).then(c=>c.put(r,copy))}
    return res;
  }).catch(()=>r.mode==='navigate'?caches.match('index.html'):Response.error())));
});
