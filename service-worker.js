const CACHE="storymap-v1"
const FILES=[
"./",
"./index.html",
"./manifest.json",
"./js/app.js",
"./data/batas_kecamatan_lombok_timur.json",
"./data/lp2b_lombok_timur.json",
"./data/rtrw_lombok_timur.json"
]

self.addEventListener("install",e=>{
e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))
})

self.addEventListener("fetch",e=>{
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
})
