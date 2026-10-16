# QA: обход всех страниц, проверка ссылок, ошибок консоли, переполнения на 390px, скриншоты
import asyncio, os, sys, urllib.request, urllib.parse
from playwright.async_api import async_playwright
BASE="http://localhost:8765/"; ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS="/workspace/baikal-kontur-shots"; os.makedirs(SHOTS,exist_ok=True)
routes=sorted(os.path.relpath(d,ROOT).replace('.','') for d,_,f in os.walk(ROOT) if 'index.html' in f and '/tools' not in d and '/assets' not in d)
async def main():
  errs=[];links=set();bad=[];over=[]
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for vp,name in [({'width':1440,'height':900},'desk'),({'width':390,'height':844},'mob')]:
      ctx=await b.new_context(viewport=vp,device_scale_factor=1)
      for r in routes:
        pg=await ctx.new_page(); url=BASE+(r+'/' if r else '')
        pg.on('console',lambda m,url=url: m.type=='error' and errs.append((url,name,m.text)))
        pg.on('pageerror',lambda e,url=url: errs.append((url,name,str(e))))
        await pg.goto(url,wait_until='networkidle'); await pg.wait_for_timeout(400)
        for h in await pg.eval_on_selector_all('a[href]','as=>as.map(a=>a.href)'):
          if h.startswith(BASE): links.add((url,h.split('#')[0]))
        if name=='mob':
          w=await pg.evaluate('document.documentElement.scrollWidth')
          if w>392: over.append((url,w))
        await pg.close()
      await ctx.close()
    # screenshots
    async def shot(path,vp,fn,full=True):
      ctx=await b.new_context(viewport=vp,device_scale_factor=2 if vp['width']<500 else 1);pg=await ctx.new_page()
      await pg.goto(BASE+path,wait_until='networkidle')
      await pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))"); await pg.wait_for_timeout(1500)
      await pg.screenshot(path=f"{SHOTS}/{fn}",full_page=full);await ctx.close()
    await shot('',{'width':1440,'height':900},'home-desktop.png')
    await shot('',{'width':390,'height':844},'home-mobile.png')
    await shot('map/',{'width':1440,'height':900},'map-desktop.png',False)
    await shot('platform/demo/',{'width':1440,'height':900},'platform-demo-desktop.png')
    await shot('platform/demo/',{'width':390,'height':844},'platform-demo-mobile.png')
    await b.close()
  for src,h in sorted(links):
    try: urllib.request.urlopen(h).read(1)
    except Exception as e: bad.append((src,h,str(e)))
  print('routes',len(routes),'unique internal links',len({h for _,h in links}))
  print('BROKEN',bad); print('CONSOLE',errs); print('OVERFLOW',over)
asyncio.run(main())
