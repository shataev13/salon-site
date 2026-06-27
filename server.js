// Запуск Next.js в продакшене на хостинге с Node.js
// (reg.ru / ISPmanager + Passenger). Passenger использует этот файл как
// «файл запуска» приложения и передаёт порт через переменную PORT.
//
// Перед запуском на сервере должна быть сделана сборка: `npm run build`.
const { createServer } = require("http");
const next = require("next");

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "0.0.0.0";

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, hostname, () => {
    console.log(`> Shati Studio запущен на http://${hostname}:${port}`);
  });
});
