// فارماشیفت — سرویس‌ورکر اعلان (Web Push)
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));

self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():''}}
  const title=d.title||'فارماشیفت';
  e.waitUntil(self.registration.showNotification(title,{
    body:d.body||'',
    icon:'icon-192.png',
    badge:'badge-96.png',
    dir:'rtl',lang:'fa',
    tag:d.id?('ps-'+d.id):undefined,
    data:{kind:d.kind||'',url:'./?nt=1'}
  }));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const kind=(e.notification.data&&e.notification.data.kind)||'';
  e.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of list){
      if('focus' in c){await c.focus();c.postMessage({type:'nt',kind});return}
    }
    if(self.clients.openWindow)await self.clients.openWindow(new URL('./?nt=1',self.registration.scope).href);
  })());
});
