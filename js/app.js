const map=L.map('map').setView([-8.6,116.5],9)

const light=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
const dark=L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png')

let layers={}

function zoomPoly(l){
map.fitBounds(l.getBounds(),{padding:[30,30]})
}

function load(name,url,color){
fetch(url).then(r=>r.json()).then(j=>{
layers[name]=L.geoJSON(j,{
style:{color,weight:2},
onEachFeature:(f,l)=>{
l.bindPopup(JSON.stringify(f.properties))
l.on('click',()=>zoomPoly(l))
}
})
})
}

load('kec','data/batas_kecamatan_lombok_timur.json','red')
load('lp2b','data/lp2b_lombok_timur.json','green')
load('rtrw','data/rtrw_lombok_timur.json','blue')

kec.onchange=e=>e.target.checked?layers.kec.addTo(map):map.removeLayer(layers.kec)
lp2b.onchange=e=>e.target.checked?layers.lp2b.addTo(map):map.removeLayer(layers.lp2b)
rtrw.onchange=e=>e.target.checked?layers.rtrw.addTo(map):map.removeLayer(layers.rtrw)

menuBtn.onclick=()=>sidebar.classList.toggle('active')
map.on('click',()=>sidebar.classList.remove('active'))

theme.onclick=()=>{
if(map.hasLayer(light)){map.removeLayer(light);dark.addTo(map)}
else{map.removeLayer(dark);light.addTo(map)}
}

function goCoord(){
let [lon,lat]=coord.value.split(',')
map.flyTo([lat,lon],16)
L.marker([lat,lon]).addTo(map)
}

let gpsMarker,gpsCircle
function getGPS(){
navigator.geolocation.getCurrentPosition(p=>{
let lat=p.coords.latitude,lon=p.coords.longitude,acc=p.coords.accuracy
gpsMarker&&map.removeLayer(gpsMarker)
gpsCircle&&map.removeLayer(gpsCircle)
gpsMarker=L.marker([lat,lon]).addTo(map)
gpsCircle=L.circle([lat,lon],{radius:acc}).addTo(map)
gpsInfo.innerHTML=`Lat:${lat}<br>Lon:${lon}`
map.flyTo([lat,lon],16)
})
}

function exportPNG(){
leafletImage(map,(e,c)=>{
let a=document.createElement('a')
a.href=c.toDataURL()
a.download='peta.png'
a.click()
})
}

function exportPDF(){
leafletImage(map,(e,c)=>{
const {jsPDF}=window.jspdf
let pdf=new jsPDF('landscape','px',[c.width,c.height])
pdf.addImage(c.toDataURL(),'PNG',0,0,c.width,c.height)
pdf.save('peta.pdf')
})
}

if('serviceWorker'in navigator){
navigator.serviceWorker.register('service-worker.js')
}
