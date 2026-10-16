/* Общие шапка и подвал + подстановка названий из assets/config.js */
(function(){
const C=window.SITE_CONFIG, R=document.body.dataset.root||"", cur=document.body.dataset.route||"";
const u=p=>R+p;
const logo=`<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="9" fill="#123246"/><path d="M10 7c5 3 3 8 6 11s2 7-2 9" stroke="#18A5A0" stroke-width="2.6" stroke-linecap="round"/><circle cx="22" cy="12" r="3" stroke="#fff" stroke-width="1.8"/><path d="M5 17h24M17 5v24" stroke="#fff" stroke-opacity=".18"/></svg>`;
const nav=[["platform/","Платформа"],["map/","Экологическая карта"],["monitoring/","Мониторинг",[["monitoring/water/","Вода"],["monitoring/air/","Воздух"],["monitoring/forests/","Леса"],["monitoring/biodiversity/","Биоразнообразие"]]],["forestation/","Лесовосстановление"],["projects/","Проекты"],["business/","Для бизнеса"],["about/","Оператор"]];
const act=h=>cur&&(h===cur||(cur.startsWith(h)&&h!==""))?' class="active"':'';
const navHtml=nav.map(([h,t,sub])=>sub?`<div class="dd"><a href="${u(h)}"${act(h)}>${t} ▾</a><div class="dd-menu"><a href="${u(h)}">Обзор мониторинга</a>${sub.map(([sh,st])=>`<a href="${u(sh)}">${st}</a>`).join("")}</div></div>`:`<a href="${u(h)}"${act(h)}>${t}</a>`).join("");
const header=document.createElement("header");header.className="site-header"+(document.body.dataset.hero?" on-hero":"");
header.innerHTML=`<div class="header-inner"><a class="logo" href="${u("")}">${logo}<span>${C.projectNameUpper}<small>${C.tagline}</small></span></a>
<nav class="nav" aria-label="Основная навигация">${navHtml}</nav>
<div class="nav-tools"><a href="${u("search/")}" aria-label="Поиск">⌕ Поиск</a><a href="${u("platform/demo/")}">Личный кабинет</a><a class="btn btn-primary" href="${u("contacts/")}">Связаться</a></div>
<button class="burger" aria-label="Меню" aria-expanded="false">☰</button></div>`;
document.body.prepend(header);
const b=header.querySelector(".burger");b.onclick=()=>{const o=header.classList.toggle("open");b.textContent=o?"✕":"☰";b.setAttribute("aria-expanded",o);document.body.style.overflow=o?"hidden":""};
if(header.classList.contains("on-hero")){const f=()=>header.classList.toggle("scrolled",scrollY>40);addEventListener("scroll",f);f();}
const footer=document.createElement("footer");footer.className="site-footer";
footer.innerHTML=`<div class="container"><div class="foot-grid"><div><a class="logo" href="${u("")}">${logo}<span>${C.projectNameUpper}</span></a><p style="margin-top:16px">${C.tagline}. Оператор платформы — ${C.operatorName}.</p><p class="demo-note" style="color:#e0b860">Прототип. Данные и проекты на сайте — демонстрационные.</p></div>
<div><h4>Платформа</h4><ul><li><a href="${u("platform/")}">О платформе</a></li><li><a href="${u("map/")}">Экологическая карта</a></li><li><a href="${u("monitoring/")}">Мониторинг</a></li><li><a href="${u("platform/demo/")}">Демо кабинета</a></li><li><a href="${u("analytics/")}">Аналитика</a></li></ul></div>
<div><h4>Направления</h4><ul><li><a href="${u("forestation/")}">Лесовосстановление</a></li><li><a href="${u("projects/")}">Проекты</a></li><li><a href="${u("business/")}">Для бизнеса</a></li><li><a href="${u("services/")}">Услуги</a></li><li><a href="${u("experts/")}">Экспертная сеть</a></li></ul></div>
<div><h4>Оператор</h4><ul><li><a href="${u("about/")}">${C.operatorName}</a></li><li><a href="${u("partnership/")}">Партнёрство</a></li><li><a href="${u("contacts/")}">Контакты</a></li><li>${C.email.includes("@")?`<a href="mailto:${C.email}">${C.email}</a>`:C.email}</li></ul></div></div>
<div class="foot-bottom"><span>© ${C.year} ${C.operatorName}</span><span><a href="${u("privacy/")}">Политика конфиденциальности</a> · Картография © участники OpenStreetMap</span></div></div>`;
const addF=()=>document.body.insertBefore(footer,document.querySelector("body>script:not([src*=layout])")||null);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",addF):addF();
document.querySelectorAll("[data-cfg]").forEach(e=>e.textContent=C[e.dataset.cfg]);
document.querySelectorAll("[data-href]").forEach(e=>e.setAttribute("href",u(e.dataset.href)));
if(document.title.includes("{P}"))document.title=document.title.replace("{P}",C.projectName);
/* Progressive reveal: content is visible by default; animation only when IO is available, motion allowed, and after DOM is parsed. */
const initReveal=()=>{try{
const els=[...document.querySelectorAll(".reveal")];if(!els.length)return;
if(!("IntersectionObserver" in window)||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches))return;
const showAll=()=>els.forEach(e=>e.classList.add("in"));
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:0,rootMargin:"0px 0px 10% 0px"});
els.forEach(e=>{const r=e.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)e.classList.add("in");else io.observe(e)});
document.documentElement.classList.add("js-reveal");
setTimeout(()=>{showAll();io.disconnect()},2500);
}catch(err){document.documentElement.classList.remove("js-reveal")}};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",initReveal):initReveal();
})();
