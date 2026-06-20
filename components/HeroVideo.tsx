"use client";

import { useEffect, useRef, useState } from "react";

/* Фоновое видео героя (1080p, без звука, ~2.5 МБ). Показывает постер сразу,
   пока грузится ролик; при reduced-motion остаётся статичный постер. */
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
      poster="/hero-poster.jpg"
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* Фоновый ролик салона. */}
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
}
