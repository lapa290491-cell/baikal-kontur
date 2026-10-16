/* Точка входа: инициализация компонентов по data-атрибутам */
document.addEventListener("DOMContentLoaded",()=>{const q=(s,f)=>document.querySelectorAll(s).forEach(f);
 if(window.L)q("[data-map]",initMap);
 if(window.Chart){q("canvas[data-series]",c=>seriesChart(c,c.dataset.series,{mini:c.dataset.mini==="1"}));
  q("[data-switch]",sw=>{const c=document.getElementById(sw.dataset.switch);sw.querySelectorAll("button[data-key]").forEach(b=>b.onclick=()=>{sw.querySelectorAll("button").forEach(x=>{x.classList.remove("on");x.setAttribute("aria-pressed","false")});b.classList.add("on");b.setAttribute("aria-pressed","true");seriesChart(c,b.dataset.key)})});
  q("[data-explorer]",initExplorer);}
 q("[data-projects]",renderProjects);q("[data-articles]",renderArticles);q("[data-services]",renderServices);q("[data-experts]",renderExperts);q("[data-detail]",renderDetail);q("[data-compare]",initCompare);
 initPipelines();initForms();initSearch();
 q("[data-wip-btn]",b=>b.onclick=()=>BK.toast("Функция находится в разработке"));
});
