# Функциональные проверки: фильтры, слои, маркеры, вкладки кабинета, графики, формы
import asyncio
from playwright.async_api import async_playwright
B="http://localhost:8765/";res=[]
def ok(n,c):res.append(("OK " if c else "FAIL ")+n)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':900})
    await pg.goto(B+"map/",wait_until="networkidle")
    n0=await pg.locator(".leaflet-marker-icon").count()
    await pg.locator(".layer-toggle input").first.uncheck();n1=await pg.locator(".leaflet-marker-icon").count();ok(f"map layer toggle {n0}->{n1}",n1<n0)
    await pg.select_option("select[data-k=region]","Забайкальский край");n2=await pg.locator(".leaflet-marker-icon").count();ok(f"map region filter ->{n2}",0<n2<n1)
    await pg.click("[data-reset]");await pg.locator(".leaflet-marker-icon").first.click();ok("marker popup",await pg.locator(".leaflet-popup .pop").count()==1)
    z=await pg.evaluate("document.querySelector('[data-map]')._map.getZoom()");await pg.click(".leaflet-control-zoom-in");await pg.wait_for_timeout(400);ok("zoom",await pg.evaluate("document.querySelector('[data-map]')._map.getZoom()")>z)
    await pg.goto(B+"projects/",wait_until="networkidle");a=await pg.locator("[data-grid] .card").count()
    await pg.select_option("select[data-k=cat]","Лесовосстановление");c=await pg.locator("[data-grid] .card").count();ok(f"project filter {a}->{c}",c<a and c>0)
    await pg.locator("[data-grid] .card").first.click();await pg.wait_for_load_state("networkidle");ok("project card opens: "+await pg.locator("h1").inner_text(),"/projects/forest-restoration/" in pg.url)
    await pg.goto(B+"analytics/",wait_until="networkidle");await pg.click("[data-r='Лесные ресурсы']");ok("analytics rubric filter",await pg.locator("[data-grid] .card").count()==1)
    await pg.goto(B+"platform/demo/#objects",wait_until="networkidle");await pg.locator("#v-objects a.btn").nth(1).click();await pg.wait_for_timeout(300)
    await pg.click("[data-t=factors]");ok("cabinet object tabs",(await pg.locator("#obj-tab").inner_text()).find("тест")>=0)
    await pg.click("[data-t=mon]");await pg.wait_for_timeout(300);ok("cabinet object chart",await pg.locator("#c-obj").count()==1)
    await pg.click("a[data-v=activities]");await pg.click("[data-s='Выполнено']");ok("cabinet activity filter",await pg.locator("#act-body tr").count()==1)
    await pg.click("a[data-v=reports]");await pg.click("[data-rep='0']");ok("cabinet report view",await pg.locator("#rep-view canvas").count()==1)
    await pg.goto(B+"monitoring/water/",wait_until="networkidle");t1=await pg.locator("[data-table]").inner_text();await pg.select_option("[data-k=per]","3");ok("water explorer period",await pg.locator("[data-table] tbody tr").count()==3)
    await pg.goto(B+"",wait_until="networkidle");await pg.click("button[data-key=air]");await pg.wait_for_timeout(300);ok("home chart switch",(await pg.locator("#monChart").evaluate("c=>BKCharts.monChart.data.datasets[0].label")).startswith("Станция"))
    await pg.goto(B+"contacts/",wait_until="networkidle");await pg.fill("input[name=name]","Тест");await pg.fill("input[name=email]","t@t.ru");await pg.fill("textarea","x");await pg.check("form input[type=checkbox]");await pg.click("form button[type=submit]");ok("contact demo message",await pg.locator("#c-ok.show").count()==1)
    await pg.goto(B+"search/?q=лес",wait_until="networkidle");ok("search results",await pg.locator("#sres .card").count()>0)
    m=await b.new_page(viewport={'width':390,'height':844});await m.goto(B,wait_until="networkidle");await m.click(".burger");ok("mobile burger",await m.locator(".site-header.open .nav").is_visible())
    r=await m.goto(B+"no-such-page/");ok("404 status",r.status==404)
    await b.close()
  print("\n".join(res))
asyncio.run(main())
