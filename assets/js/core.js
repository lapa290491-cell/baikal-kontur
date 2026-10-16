/* Общие утилиты */
window.BK={R:document.body.dataset.root||"",
 esc:s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])),
 rng(seed){let s=0;for(const c of String(seed))s=(s*31+c.charCodeAt(0))>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}},
 /* условный тестовый ряд (детерминированный), НЕ измерения */
 testSeries(seed,n,base=50,amp=15){const r=BK.rng(seed);return Array.from({length:n},(_,i)=>+(base+amp*Math.sin(i/1.9+r()*2)+(r()-.5)*amp*.6).toFixed(1))},
 reduced:matchMedia("(prefers-reduced-motion: reduce)").matches};
BK.toast=t=>{let el=document.getElementById("toast");if(!el){el=document.createElement("div");el.id="toast";el.setAttribute("role","status");document.body.append(el)}el.textContent=t;el.classList.add("show");clearTimeout(BK._t);BK._t=setTimeout(()=>el.classList.remove("show"),2400)};
document.querySelectorAll("[data-cfg]").forEach(e=>e.textContent=SITE_CONFIG[e.dataset.cfg]);
