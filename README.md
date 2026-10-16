# «Байкальский контур» — прототип сайта и платформы (MVP 0.1)

Статический многостраничный прототип: обычные HTML/CSS/JS, **без сборки**. Можно выложить на GitHub Pages как есть
(все ссылки относительные, каждый маршрут — папка с `index.html`, поэтому `/monitoring/water/` открывается напрямую).

> Все данные, объекты на карте, графики, проекты, документы и отчёты — **демонстрационные (тестовые)** и подписаны
> на страницах. Проекты — «Проектная концепция / Демонстрационный пример», а не выполненные работы оператора.

## Запуск
```bash
python3 -m http.server 8000   # откройте http://localhost:8000/
```
С `file://` работать не будет (переходы ведут в папки) — нужен любой HTTP-сервер.

## Названия и контакты
Всё в одном файле — **`assets/config.js`** (`projectName`, `tagline`, `operatorName`, контакты, подписи к фото, `siteUrl`).
На страницах значения подставляются через атрибут `data-cfg="ключ"`. Контакты и реквизиты сейчас — заглушки, пока их не пришлёт заказчик.

## Структура
```
index.html                     главная (12 блоков)
platform/ platform/demo/       платформа; демо-кабинет (SPA на #hash: обзор, объекты, карта, мониторинг,
                               мероприятия, проекты, документы, отчётность, настройки)
map/                           ГИС-экран: поиск, регион, статус, 8 слоёв, сброс, ⌂ домой, масштаб
monitoring/{water,air,forests,biodiversity}/
forestation/ forestation/map/
projects/ projects/<slug>/     каталог с фильтрами + шаблон (template) + 5 демо-проектов
business/ services/ services/<slug>/ (template + 6 услуг)
experts/ analytics/ analytics/<slug>/ (3 вводных материала)
about/ partnership/ contacts/ privacy/ search/ 404.html sitemap.xml robots.txt
assets/
  config.js                    названия и настройки
  data/demo-data.js            все демо-данные (window.DEMO_DATA)
  js/types.js                  модели данных (JSDoc): sourceId, sourceType, updatedAt, verificationStatus, isDemo
  js/data-api.js               слой доступа к данным (DataAPI) — единственная точка получения данных
  js/core.js                   утилиты, подстановка конфига, тестовые ряды, toast
  js/layout.js                 общие шапка/подвал (вставляются скриптом), бургер-меню, активный пункт
  js/maps.js                   компонент карты (Leaflet + тайлы OpenStreetMap)
  js/charts.js                 компонент графиков (Chart.js)
  js/components.js             карточки, каталоги с фильтрами, детальные страницы, формы, схемы, поиск
  js/cabinet.js                логика демо-кабинета
  js/main.js                   инициализация компонентов по data-атрибутам
  css/style.css css/dashboard.css
  img/                         фото Байкала (лицензии ниже)
tools/build_pages.py           генератор HTML-страниц из шаблонов (нужен только для правки разметки)
tools/qa.py tools/qa_func.py   проверки: ссылки, консоль, ширина 390 px, скриншоты; функциональные тесты
```
Страницы генерируются скриптом `python3 tools/build_pages.py` (общие блоки — функции на Python), результат закоммичен,
поэтому для деплоя сборка не нужна. Контент проектов/услуг/статей рендерится в браузере из данных по `data-slug`.

## Как подключить реальные данные
1. Весь UI получает данные только через `window.DataAPI` (`assets/js/data-api.js`).
2. Укажите `DataAPI.baseUrl = "https://api.example.org/v1"` — `get(key)` начнёт делать `fetch(baseUrl + "/" + key)`
   (`objects`, `layers`, `regions`, `series`, `projects`, `services`, `analytics`, `experts`, `cabinet`).
3. API должен отдавать JSON в формате `assets/data/demo-data.js` / `types.js`. Для смешанных источников заполняйте
   `sourceId`, `sourceType`, `updatedAt`, `verificationStatus`, `isDemo` (при `isDemo:false` уберите демо-плашки).
4. Нужен иной формат — адаптируйте ответ внутри `DataAPI.get`, компоненты менять не потребуется.
5. Новый объект на карте — элемент `objects` с `layer` из `layers`; новый проект — элемент `projects` + папка
   `projects/<slug>/` (скопируйте `projects/template/index.html`, поменяйте `data-slug`) и строка в `build_pages.py`.

## Деплой (GitHub Pages)
Залейте папку в репозиторий → Settings → Pages → ветка/корень. Поменяйте `siteUrl` в `config.js` и перезапустите
`tools/build_pages.py`, чтобы обновить `sitemap.xml`/`robots.txt`. `404.html` сам вычисляет корень проекта на `*.github.io`.

## Внешние библиотеки и лицензии
Leaflet 1.9.4 (BSD-2), Chart.js 4.4 (MIT) — CDN unpkg/jsDelivr; шрифт Manrope (OFL, Google Fonts).
Картографические тайлы © участники OpenStreetMap (ODbL); для продакшена при высокой нагрузке нужен собственный
или коммерческий тайл-сервер (политика использования tile.openstreetmap.org).
Фото: `hero.jpg` — Sergey Pesterev, Unsplash/Wikimedia Commons, CC0; `taiga.jpg` — Vyacheslav Argenberg, Wikimedia Commons,
CC BY 4.0; `shore.jpg` — Sergey Gabdurakhmanov, Wikimedia Commons, CC BY 2.0.

## Не реализовано на этом этапе (по ТЗ, п. 2.2)
Авторизация, реальная отправка форм, реальные станции/госинтеграции, спутниковые данные, AI-аналитика (отмечена «Планируемая функция»),
генерация документов (в кабинете — демонстрационный просмотр, кнопки скачивания показывают «Функция находится в разработке»).
