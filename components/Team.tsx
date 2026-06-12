"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Master = {
  name: string;
  specialization: string;
  description: string;
  /* Слот под реальное фото — заменить на путь к снимку. */
  photo?: string;
};

const MASTERS: Master[] = [
  {
    name: "Анна Лебедева",
    specialization: "Стилист-колорист",
    description: "Сложное окрашивание и бережный уход за цветом.",
  },
  {
    name: "Мария Орлова",
    specialization: "Лэшмейкер",
    description: "Наращивание и ламинирование ресниц.",
  },
  {
    name: "Екатерина Соколова",
    specialization: "Мастер маникюра",
    description: "Аппаратный маникюр, укрепление и дизайн.",
  },
  {
    name: "София Морозова",
    specialization: "СПА-терапевт",
    description: "Уходовые ритуалы и массаж лица.",
  },
  {
    name: "Дарья Волкова",
    specialization: "Парикмахер-стилист",
    description: "Стрижки и укладки любой сложности.",
  },
  {
    name: "Ольга Кузнецова",
    specialization: "Бровист",
    description: "Архитектура бровей и окрашивание.",
  },
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Team() {
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
    const gap = 24;
    const pitch = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * pitch, behavior: reduce ? "auto" : "smooth" });
  };

  const arrowClass =
    "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-ink-deep shadow-lg shadow-ink-deep/10 ring-1 ring-ink-deep/10 backdrop-blur transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-warm disabled:pointer-events-none disabled:opacity-0";

  return (
    <section
      id="team"
      className="relative overflow-hidden bg-surface-warm py-20 sm:py-28"
    >
      {/* Шапка с контурным водяным знаком позади. */}
      <header className="relative mx-auto flex max-w-[1240px] flex-col items-center px-6 py-6 text-center">
        <span
          aria-hidden="true"
          className="u-watermark pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-semibold uppercase leading-none tracking-[0.04em] text-[clamp(72px,16vw,188px)]"
        >
          TEAM
        </span>

        <h2 className="relative z-10 text-4xl font-medium uppercase tracking-[0.14em] text-ink-deep sm:text-5xl">
          Наши мастера
        </h2>
        <p className="relative z-10 mt-4 text-sm tracking-wide text-ink-deep/50">
          Познакомьтесь с командой
        </p>
      </header>

      {/* Лента со стрелками. */}
      <div className="relative mx-auto mt-10 max-w-[1320px] sm:mt-14">
        <button
          type="button"
          aria-label="Предыдущие мастера"
          onClick={() => scrollByCards(-1)}
          disabled={!canLeft}
          className={`left-3 sm:left-5 ${arrowClass}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        <ul
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-6 px-6 pb-3 sm:scroll-pl-12 sm:px-12"
        >
          {MASTERS.map((master, index) => (
            <li
              key={master.name}
              data-card
              className="shrink-0 snap-start basis-full sm:basis-[calc((100%_-_24px)/2)] lg:basis-[calc((100%_-_72px)/4)]"
            >
              <article className="group/card text-center">
                <div className="relative mx-auto size-36 rounded-full ring-1 ring-ink-deep/10 transition-[transform,box-shadow] duration-500 ease-out group-hover/card:-translate-y-1.5 group-hover/card:ring-2 group-hover/card:ring-accent group-hover/card:ring-offset-2 group-hover/card:ring-offset-surface-warm motion-reduce:transform-none motion-reduce:transition-none sm:size-40">
                  <div className="absolute inset-0 overflow-hidden rounded-full grayscale transition duration-500 ease-out group-hover/card:grayscale-0 motion-reduce:transition-none">
                    {master.photo ? (
                      <Image
                        src={master.photo}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 112px, 160px"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center u-ph-${(index % 4) + 1}`}
                      >
                        <span
                          aria-hidden="true"
                          className="text-2xl font-semibold text-white/90 sm:text-3xl"
                        >
                          {initialsOf(master.name)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-ink-deep">
                  {master.name}
                </h3>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                  {master.specialization}
                </p>
                <p className="mx-auto mt-2 max-w-60 text-sm leading-relaxed text-ink-deep/55">
                  {master.description}
                </p>
              </article>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Следующие мастера"
          onClick={() => scrollByCards(1)}
          disabled={!canRight}
          className={`right-3 sm:right-5 ${arrowClass}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
