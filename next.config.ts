import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статический экспорт: сайт — это готовые файлы (HTML/CSS/JS), которые
  // можно положить на любой хостинг (reg.ru, /www/shatistudio.ru).
  output: "export",
  // Каждый маршрут — папка с index.html (/about/ → about/index.html), чтобы
  // Apache на общем хостинге отдавал страницы без доп. настройки.
  trailingSlash: true,
  // На общем хостинге нет sharp — отдаём предсжатые картинки как есть.
  images: { unoptimized: true },
};

export default nextConfig;
