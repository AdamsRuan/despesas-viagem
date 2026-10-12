// Service Worker do app Despesas de Viagem: deixa o app abrir sem internet.
// Aumente a versão sempre que publicar uma atualização.
const CACHE='despesas-viagem-v1';
const ARQUIVOS=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-192-maskable.png','./icons/icon-512-maskable.png','./icons/apple-touch-icon.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ns=>Promise.all(ns.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(resp=>{const c=resp.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return resp}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(resp=>{const c=resp.clone();caches.open(CACHE).then(x=>x.put(r,c));return resp})));
});
