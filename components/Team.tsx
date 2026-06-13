"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Автопрокрутка слайдера и пауза после ручного переключения. */
const AUTOPLAY_MS = 8000;
const RESUME_AFTER_MS = 30000;

type Master = {
  name: string;
  /* Должность. Пока общая «Мастер» — уточним позже. */
  role?: string;
  /* Описание мастера. Пока временный текст; задаётся индивидуально позже. */
  bio?: string;
  /* Портрет 3:4 (как загружали ранее). */
  photo: string;
};

const MASTERS: Master[] = [
  { name: "Анна Умярова", role: "Мастер", photo: "/staff/anna-umyarova.png" },
  { name: "Евгения Калачева", role: "Мастер", photo: "/staff/evgeniya-kalacheva.png" },
  { name: "Игорь Гурьев", role: "Мастер", photo: "/staff/igor-guryev.png" },
  { name: "Крестина Остапчук", role: "Мастер", photo: "/staff/kristina-ostapchuk.png" },
  { name: "Юрий Сапалев", role: "Мастер", photo: "/staff/yuriy-sapalev.png" },
];

/* Временное описание мастера, пока нет реальных текстов. */
function bioOf(master: Master) {
  if (master.bio) return master.bio;
  const firstName = master.name.split(" ")[0];
  return `Привет, меня зовут ${firstName}. Я мастер с опытом работы, внимательно отношусь к каждому клиенту и помогаю подобрать лучший уход под индивидуальные особенности.`;
}

export default function Team() {
  const count = MASTERS.length;
  const [index, setIndex] = useState(0);
  /* Автопрокрутка на паузе после действий пользователя. */
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Уважаем prefers-reduced-motion: без автопрокрутки и плавных переходов.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Автопереключение каждые AUTOPLAY_MS, пока слайдер не на паузе.
  useEffect(() => {
    if (paused || reduceMotion || count <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % count),
      AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [paused, reduceMotion, count]);

  // Снимаем отложенное возобновление при размонтировании.
  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  // Ручное переключение: останавливаем автопрокрутку и возобновляем её
  // только после RESUME_AFTER_MS без действий пользователя.
  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
      setPaused(true);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setPaused(false), RESUME_AFTER_MS);
    },
    [count],
  );

  const arrowClass =
    "grid size-11 shrink-0 place-items-center rounded-full text-ink-deep/70 ring-1 ring-ink-deep/15 transition-colors hover:text-accent hover:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-accent";

  return (
    <section
      id="team"
      className="relative overflow-hidden bg-surface-accent py-20 sm:py-28"
    >
      {/* Шапка с контурным водяным знаком позади. */}
      <header className="relative mx-auto flex max-w-[1240px] flex-col items-center px-6 py-6 text-center">
        <span
          aria-hidden="true"
          className="u-watermark pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-semibold uppercase leading-none tracking-[0.04em] text-[clamp(72px,16vw,188px)]"
        >
          TEAM
        </span>

        <span
          aria-hidden="true"
          className="relative z-10 mb-6 h-0.5 w-10 rounded-full bg-accent"
        />
        <h2 className="relative z-10 text-4xl font-medium uppercase tracking-[0.14em] text-ink-deep sm:text-5xl">
          Наши мастера
        </h2>
        <p className="relative z-10 mt-4 text-sm tracking-wide text-ink-deep/50">
          Познакомьтесь с командой
        </p>
      </header>

      {/* Слайдер: один мастер за раз. */}
      <div
        className="relative mx-auto mt-12 max-w-[1080px] px-6 sm:mt-16"
        aria-roledescription="карусель"
        aria-label="Наши мастера"
      >
        {/* Слайды — мягкое перекрёстное затухание (без горизонтального «отката»). */}
        <div className="relative">
          {MASTERS.map((master, i) => {
            const active = i === index;
            return (
              <article
                key={master.name}
                aria-hidden={!active}
                className={`grid items-center gap-7 sm:grid-cols-[auto_1fr] sm:gap-10 lg:gap-14 motion-safe:transition-opacity motion-safe:duration-700 ${
                  active
                    ? "relative opacity-100"
                    : "pointer-events-none absolute inset-0 opacity-0"
                }`}
              >
                {/* Фото 3:4, компактное — блок не выглядит громоздко. */}
                <div className="relative mx-auto aspect-[3/4] w-56 overflow-hidden rounded-2xl bg-surface ring-1 ring-ink-deep/10 sm:mx-0 sm:w-72 lg:w-[400px]">
                  <Image
                    src={master.photo}
                    alt={master.name}
                    fill
                    sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 400px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Имя крупно фирменным шрифтом + описание. */}
                <div className="text-center sm:text-left">
                  {master.role && (
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                      {master.role}
                    </p>
                  )}
                  <h3 className="mt-3 font-display text-3xl font-medium leading-tight text-ink-deep sm:text-4xl lg:text-5xl">
                    {master.name}
                  </h3>
                  <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-deep/65 sm:mx-0 sm:text-base">
                    {bioOf(master)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Управление под карточкой — не наезжает на текст ни на одном экране. */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Предыдущий мастер"
            onClick={() => goTo(index - 1)}
            className={arrowClass}
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

          <ul className="flex items-center gap-1.5">
            {MASTERS.map((master, i) => {
              const active = i === index;
              return (
                <li key={master.name}>
                  <button
                    type="button"
                    aria-label={`Показать: ${master.name}`}
                    aria-current={active}
                    onClick={() => goTo(i)}
                    className="group grid h-6 w-6 place-items-center focus-visible:outline-none"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-surface-accent ${
                        active
                          ? "w-5 bg-accent"
                          : "w-1.5 bg-ink-deep/25 group-hover:bg-ink-deep/45"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label="Следующий мастер"
            onClick={() => goTo(index + 1)}
            className={arrowClass}
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
      </div>
    </section>
  );
}
