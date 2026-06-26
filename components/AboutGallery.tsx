"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type GalleryPhoto = { src: string; alt: string };

/* Небольшая горизонтальная карусель фотографий салона. */
export default function AboutGallery({ photos }: { photos: GalleryPhoto[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCards = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const pitch = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * pitch, behavior: reduce ? "auto" : "smooth" });
  };

  const arrowClass =
    "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-ink-deep shadow-lg ring-1 ring-ink-deep/10 backdrop-blur transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className="relative mx-auto mt-12 max-w-[1320px] sm:mt-14">
      <button
        type="button"
        aria-label="Предыдущие фото"
        onClick={() => scrollByCards(-1)}
        disabled={!canLeft}
        className={`left-3 sm:left-5 ${arrowClass}`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <ul
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-6 px-6 py-2 sm:scroll-pl-12 sm:px-12"
      >
        {photos.map((photo) => (
          <li
            key={photo.src}
            data-card
            className="shrink-0 snap-start basis-[78%] sm:basis-[46%] lg:basis-[31%]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface ring-1 ring-ink-deep/5">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 400px"
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-label="Следующие фото"
        onClick={() => scrollByCards(1)}
        disabled={!canRight}
        className={`right-3 sm:right-5 ${arrowClass}`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
