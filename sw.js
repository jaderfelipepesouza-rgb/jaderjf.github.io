const CACHE='merito-2-7-0';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&(key.startsWith('tokens-v')||key.startsWith('merito-'))).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    // Keep the shell from a single installed version until all old windows close.
    const cached=await cache.match(request,{ignoreSearch:true});
    if(cached)return cached;
    try{return await fetch(request)}catch(error){if(request.mode==='navigate')return cache.match('./index.html');return Response.error()}
  }));
});
