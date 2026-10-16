/* Компонент геокарты (Leaflet + тайлы OpenStreetMap). Атрибуты контейнера [data-map]:
   data-layers="a,b" — ограничить слои; data-filters="1" — полная панель фильтров; data-zoom; data-wheel; data-fit */
const START=[53.0,108.0],START_Z=6;
function detailLink(o){const R=BK.R;if(o.slug)return R+"projects/"+o.slug+"/";return R+({monitoring:"monitoring/",water:"monitoring/water/",forestland:"monitoring/forests/",forest:"forestation/map/",industry:"business/",oopt:"monitoring/biodiversity/",observation:"monitoring/biodiversity/"}[o.layer]||"map/")}
function popupHtml(o,L){const c=L[o.layer].color,e=BK.esc;
 const extra=o.layer==="forest"?`<table><tr><td>Регион</td><td>${e(o.region)}</td></tr><tr><td>Площадь</td><td>${e(o.area)}</td></tr><tr><td>Породы</td><td>${e(o.species)}</td></tr><tr><td>Год</td><td>${e(o.year)}</td></tr><tr><td>Организация</td><td>${e(o.org)}</td></tr><tr><td>Уход</td><td>${e(o.care)}</td></tr><tr><td>Результаты проверки</td><td>${e(o.check)}</td></tr></table>`:"";
 return `<div class="pop"><span class="badge" style="background:${c}22;color:${c}">${L[o.layer].label}</span><h4>${e(o.name)}</h4><p><b>Территория:</b> ${e(o.place)}, ${e(o.region)}</p>${o.desc?`<p>${e(o.desc)}</p>`:""}${extra}<p><b>Статус данных:</b> ${e(o.status)}</p><div class="coords">${o.lat.toFixed(3)}° с.ш., ${o.lng.toFixed(3)}° в.д.</div><p style="margin:8px 0"><span class="badge demo">Демонстрационные данные</span></p><a class="btn btn-primary btn-sm" href="${detailLink(o)}">Подробнее</a></div>`}
async function initMap(el){
 const [objs,L,regions]=await Promise.all([DataAPI.objects(),DataAPI.layers(),DataAPI.regions()]);
 const only=(el.dataset.layers||"").split(",").filter(Boolean),full=el.dataset.filters==="1";
 const mapEl=el.querySelector(".map");
 const map=window.L.map(mapEl,{scrollWheelZoom:el.dataset.wheel==="1"}).setView(START,el.dataset.zoom?+el.dataset.zoom:START_Z);
 window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',maxZoom:18}).addTo(map);
 window.L.control.scale({imperial:false}).addTo(map);
 const Home=window.L.Control.extend({onAdd(){const b=window.L.DomUtil.create("button","map-home");b.type="button";b.title="Вернуться к стартовому виду";b.setAttribute("aria-label",b.title);b.textContent="⌂";b.onclick=e=>{e.stopPropagation();reset(false)};return b}});
 new Home({position:"topleft"}).addTo(map);
 const keys=Object.keys(L).filter(k=>!only.length||only.includes(k));
 const state={on:new Set(keys),q:"",region:"",status:""};
 const markers=objs.filter(o=>keys.includes(o.layer)).map(o=>{const icon=window.L.divIcon({className:"",html:`<div class="mk" style="background:${L[o.layer].color}"></div>`,iconSize:[18,18],iconAnchor:[9,9]});
   const m=window.L.marker([o.lat,o.lng],{icon,title:o.name,keyboard:true}).bindPopup(popupHtml(o,L),{maxWidth:300});m.o=o;return m});
 const group=window.L.featureGroup().addTo(map);
 const side=el.querySelector(".map-side"),cnt=el.querySelector("[data-count]");
 function apply(){group.clearLayers();let n=0;markers.forEach(m=>{const o=m.o;if(state.on.has(o.layer)&&(!state.region||o.region===state.region)&&(!state.status||o.status===state.status)&&(!state.q||(o.name+" "+o.place).toLowerCase().includes(state.q))){group.addLayer(m);n++}});if(cnt)cnt.textContent=n;}
 function reset(clear=true){if(clear&&side){state.on=new Set(keys);state.q=state.region=state.status="";side.querySelectorAll("input[type=checkbox]").forEach(i=>i.checked=true);side.querySelectorAll("select,input[type=search]").forEach(i=>i.value="");apply();}map.closePopup();el.dataset.fit&&group.getLayers().length?map.fitBounds(group.getBounds(),{padding:[30,30]}):map.setView(START,el.dataset.zoom?+el.dataset.zoom:START_Z)}
 if(side){const box=document.createElement("div");box.className="map-filters";
  if(full){const statuses=[...new Set(objs.map(o=>o.status))];
   box.innerHTML=`<input type="search" placeholder="Поиск по названию" aria-label="Поиск по названию"><select data-k="region" aria-label="Регион"><option value="">Все регионы</option>${regions.map(r=>`<option>${r}</option>`).join("")}</select><select data-k="status" aria-label="Статус"><option value="">Все статусы</option>${statuses.map(r=>`<option>${r}</option>`).join("")}</select>`;
   box.querySelector("input").oninput=e=>{state.q=e.target.value.trim().toLowerCase();apply()};box.querySelectorAll("select").forEach(s=>s.onchange=()=>{state[s.dataset.k]=s.value;apply()});}
  box.insertAdjacentHTML("beforeend",`<h4>Слои (категории)</h4>`);
  keys.forEach(k=>{const n=objs.filter(o=>o.layer===k).length;const lab=document.createElement("label");lab.className="layer-toggle";lab.innerHTML=`<input type="checkbox" checked><span class="dot" style="background:${L[k].color}"></span>${L[k].label}<span class="cnt">${n}</span>`;lab.querySelector("input").onchange=e=>{e.target.checked?state.on.add(k):state.on.delete(k);apply()};box.append(lab)});
  box.insertAdjacentHTML("beforeend",`<div class="map-actions"><button type="button" class="btn btn-outline btn-sm" data-reset>Сбросить фильтры</button></div><p class="demo-note" style="margin-top:12px">Демонстрационные данные. Объекты условны и не являются реальными пунктами наблюдений.</p>`);
  box.querySelector("[data-reset]").onclick=()=>reset(true);side.append(box);
  const tg=side.querySelector(".map-side-toggle");if(tg)tg.onclick=()=>{side.classList.toggle("open");tg.setAttribute("aria-expanded",side.classList.contains("open"))};}
 apply();if(el.dataset.fit)map.fitBounds(group.getBounds(),{padding:[30,30]});
 setTimeout(()=>map.invalidateSize(),200);el._map=map;return map;
}
window.initMap=initMap;
