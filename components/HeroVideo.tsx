"use client";

import { useEffect, useRef, useState } from "react";

/* Фоновое видео героя. Слот под реальный ролик — пока его нет, элемент
   прозрачен и сквозь него виден градиентный фолбэк. Уважает reduced-motion. */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const reduce = mq.matches;
      setAutoplay(!reduce);
      const video = ref.current;
      if (!video) return;
      if (reduce) video.pause();
      else void video.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay={autoplay}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* Добавьте ролик в /public, чтобы он заиграл: */}
      <source src="/hero.webm" type="video/webm" />
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
}
