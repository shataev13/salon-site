# Деплой на reg.ru (Node.js)

Сайт собирается в **автономный Node-сервер** (`output: "standalone"`): на хостинге
не нужны ни `npm install`, ни сборка — только запуск готовых файлов. Цены
подтягиваются из Google-таблицы вживую (страницы услуг обновляются ~раз в 5 минут).

## Сборка пакета для загрузки

```bash
npm ci
npm run build

# Собрать папку для заливки (сервер + статика + публичные файлы):
rm -rf deploy && mkdir deploy
cp -r .next/standalone/. deploy/
mkdir -p deploy/.next/static && cp -r .next/static/. deploy/.next/static/
cp -r public deploy/public
```

Создать файл запуска `deploy/app.js`:

```js
process.env.NODE_ENV = "production";
process.env.HOSTNAME = "0.0.0.0";
if (!process.env.PORT) process.env.PORT = "3000";
require("./server.js");
```

Содержимое `deploy/` — это всё, что нужно на сервере.

## Установка в ISPmanager (reg.ru)

1. Залить содержимое `deploy/` в папку приложения (Менеджер файлов).
2. Раздел **Node.js → Создать приложение**:
   - Версия Node.js: 20 или 22
   - Режим: production
   - Корневая папка: папка с залитыми файлами
   - Файл запуска: `app.js`
   - Домен: shatistudio.ru
3. **Не** запускать `npm install` (зависимости уже внутри). Нажать «Перезапустить».

## Домен

`shatistudio.ru` должен указывать на сервер reg.ru (A-запись → `37.140.192.187`).
Почтовые записи (MX, mail/pop/smtp, TXT) не трогать.

## Живые цены

Google-таблица должна быть открыта на чтение по ссылке
(«Поделиться» → «Доступ по ссылке» → «Читатель»). Тогда правки в таблице
появляются на сайте автоматически в течение ~5 минут. Если таблица недоступна —
сайт показывает цены, заложенные в коде, и продолжает работать.

Переопределить источник можно переменными окружения (необязательно):
`GOOGLE_SHEET_ID`, `GOOGLE_SHEET_GID`, `GOOGLE_SHEET_PRICES_URL`,
`GOOGLE_SHEET_REVALIDATE`.
