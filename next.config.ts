import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Автономная сборка: Node-сервер со встроенными зависимостями.
  // На сервере не нужны ни `npm install`, ни сборка — только запуск.
  output: "standalone",
  // На общем хостинге нет sharp — отдаём предсжатые картинки как есть.
  images: { unoptimized: true },
};

export default nextConfig;
