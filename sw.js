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
    data:{id:d.id||'1',kind:d.kind||''}
  }));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const {id='1',kind=''}=e.notification.data||{};
  const url=new URL('./',self.registration.scope);
  url.searchParams.set('nt',id);
  e.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of list){
      if('focus' in c&&c.url.startsWith(self.registration.scope)){await c.focus();c.postMessage({type:'nt',id,kind});return}
    }
    if(self.clients.openWindow)await self.clients.openWindow(url.href);
  })());
});
