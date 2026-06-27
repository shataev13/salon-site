# Деплой на reg.ru (Node.js, ISPmanager)

Сайт на Next.js запускается как Node-приложение через Passenger.
Файл запуска — `server.js` (в корне репозитория).

## 1. Требования к тарифу
Нужен хостинг с поддержкой **Node.js 20+** в ISPmanager. Если Node нет —
тариф нужно сменить/доплатить (или хостить статикой — другой вариант).

## 2. Загрузить код на сервер (SSH)
```bash
# зайти на сервер по SSH, перейти в каталог сайта (пример):
cd ~/sites/shatistudio.ru        # путь зависит от ISPmanager

git clone https://github.com/shataev13/salon-site.git .
npm ci
npm run build
```
> ⚠️ `npm run build` требует памяти. Если упадёт с «JavaScript heap out of
> memory» — поднимите лимит: `NODE_OPTIONS=--max-old-space-size=2048 npm run build`,
> либо соберите локально и залейте папку `.next` на сервер.

## 3. Создать Node.js-приложение в ISPmanager
ISPmanager → **Node.js** → создать приложение:
- **Версия Node.js:** 20 (или новее)
- **Каталог приложения:** папка сайта (куда сделали `git clone`)
- **Файл запуска:** `server.js`
- **Режим:** production
- (порт Passenger подставит сам через переменную `PORT`)

Сохранить и **перезапустить** приложение. Домен `shatistudio.ru` привязать к
этому приложению (ISPmanager обычно предлагает это при создании).

## 4. Переменные окружения (необязательно)
Всё работает со значениями по умолчанию. При желании — в настройках
приложения ISPmanager:
`NODE_ENV=production`, `NEXT_PUBLIC_BOOKING_URL`, `GOOGLE_SHEET_ID`,
`GOOGLE_SHEET_GID`, `GOOGLE_SHEET_REVALIDATE`.

> Чтобы цены тянулись из Google-таблицы — таблица должна быть открыта на
> чтение («Поделиться → Доступ по ссылке → Читатель»).

## 5. Направить домен на сервер reg.ru
Сейчас домен может вести на Cloudflare. Чтобы он показывал сайт с reg.ru:
- **Проще:** в Cloudflare → DNS убрать привязку воркера (Custom domain в
  `salon-site`), затем добавить записи `A shatistudio.ru → 37.140.192.187` и
  `A www → 37.140.192.187`.
- **Полностью уйти с Cloudflare:** у регистратора (reg.ru) вернуть NS-серверы
  домена на reg.ru — тогда домен, хостинг и почта снова в одном месте.

Почтовые записи (`mail/smtp/pop/ftp`, `MX`, `TXT`) не трогать.

## 6. Обновления «по запросу»
После правок (я меняю код и пушу в `main`) на сервере:
```bash
cd ~/sites/shatistudio.ru
git pull
npm ci
npm run build
```
и **перезапустить** Node-приложение в ISPmanager.

## Локально
- `npm run dev` — разработка.
- `npm run build && npm run server` — проверить продакшен-режим локально
  (как на сервере, файл `server.js`).
