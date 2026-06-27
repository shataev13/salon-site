import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // На Cloudflare нет встроенного оптимизатора next/image — отдаём как есть
  // (картинки уже заранее сжаты в WebP/JPG).
  images: { unoptimized: true },
};

export default nextConfig;
