"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Автопрокрутка слайдера и пауза после ручного переключения. */
const AUTOPLAY_MS = 8000;
const RESUME_AFTER_MS = 30000;

type Master = {
  name: string;
  /* Должность. */
  role?: string;
  /* Описание мастера. */
  bio: string;
  /* Портрет 3:4. Если нет — показываем подложку с инициалами. */
  photo?: string;
};

const MASTERS: Master[] = [
  {
    name: "Юрий Сапалев",
    role: "Парикмахер-колорист",
    photo: "/staff/yuriy-sapalev.webp",
    bio: "Парикмахер-колорист со стажем более 30 лет, в нашей команде с 2005 года. Выполняет стрижки и любые виды окрашивания, выстраивая образ под каждого клиента. Эстет и тонкий стилист, чьи стрижки нередко называют произведением искусства, а сам визит к нему сравнивают с походом в театр.",
  },
  {
    name: "Игорь Гурьев",
    role: "Парикмахер-колорист",
    photo: "/staff/igor-guryev.webp",
    bio: "Мастер с опытом более 20 лет: выразительные стрижки, качественное окрашивание и аккуратные укладки. Сильный колорист, педантичный и внимательный к деталям. Ему важно мнение каждого клиента, поэтому он всегда ищет лучшее решение для образа. А ещё с Игорем легко и интересно — он поддержит любой разговор и создаёт живую, комфортную атмосферу.",
  },
  {
    name: "Анна Умярова",
    role: "Парикмахер, стилист-колорист",
    photo: "/staff/anna-umyarova.webp",
    bio: "Парикмахер, колорист и стилист со стажем более 20 лет, из них около 15 с нами. Мастер широкого профиля: женские и мужские стрижки, сложные техники окрашивания, красивые укладки. Тонко чувствует образ и умеет подчеркнуть индивидуальность человека. Клиенты любят её за мягкость, тактичность и умение слушать — рядом с Анной всегда спокойно и приятно.",
  },
  {
    name: "Андрей Огольцов",
    role: "Парикмахер",
    photo: "/staff/andrey-ogoltsov.webp",
    bio: "Мастер со стажем более 30 лет, особенно силён в мужских стрижках. Его конёк — скорость без потери качества: точная форма, аккуратные детали, уверенный результат. Сразу понимает задачу и быстро приводит образ к нужному виду, даже в сложных стрижках. Приятный в общении и внимательный — стрижка проходит легко и комфортно.",
  },
  {
    name: "Нина Попова",
    role: "Мастер ногтевого сервиса",
    photo: "/staff/nina-popova.webp",
    bio: "Мастер ногтевого сервиса со стажем более 20 лет, в наших стенах уже 10. Владеет классическим, аппаратным и комбинированным маникюром и педикюром, а также подологическими методиками: работает с вросшими и грибковыми ногтями, кератозом и другими сложными случаями, в том числе лезвием. Тщательно следит за чистотой рабочего места и стерильностью инструментов. Доброжелательная и открытая, умеет создать тёплую, спокойную атмосферу, в которую хочется возвращаться.",
  },
  {
    name: "Юлия Соловьёва",
    role: "Мастер ногтевого сервиса",
    photo: "/staff/yuliya-soloveva.webp",
    bio: "Мастер ногтевого сервиса со стажем более 20 лет, из них 15 с нами. Внимательно следит за трендами, новыми техниками и материалами и с удовольствием подбирает актуальные решения под стиль клиента. В работе педантична и аккуратна, особенно внимательна к стерильности и комфорту во время процедуры. Клиенты ценят её за спокойный подход и красивый, ухоженный результат.",
  },
  {
    name: "Мария Папель",
    role: "Мастер ногтевого сервиса",
    photo: "/staff/mariya-papel.webp",
    bio: "Мастер ногтевого сервиса со стажем более 10 лет, в нашей команде 2 года. Следит за современными трендами, техниками и материалами: ей важно, чтобы маникюр смотрелся стильно и гармонично, а не просто аккуратно. Внимательна к деталям и заботится о комфорте каждого клиента. Её ценят за вкус, профессионализм и красивый результат.",
  },
  {
    name: "Евгения Калачёва",
    role: "Косметолог",
    photo: "/staff/evgeniya-kalacheva.webp",
    bio: "Косметолог со стажем более 20 лет и средним медицинским образованием, в нашей команде с 2005 года. Косметология для неё семейное дело: Евгения представляет уже третье поколение специалистов. Её сильная сторона — сложная и проблемная кожа: грамотный уход при акне и воспалениях, а также работа с возрастными изменениями с акцентом на свежесть и естественность. Постоянно учится и следит за новыми методиками.",
  },
  {
    name: "Ирина Солоева",
    role: "Врач-косметолог",
    photo: "/staff/irina-soloeva.webp",
    bio: "Врач-косметолог со стажем более 30 лет, в наших стенах больше 10. Работает с возрастными изменениями кожи, уходовыми процедурами, чистками лица и массажем, умеет комплексно оценить состояние кожи и подобрать уход. Делает акцент на здоровье, свежести и естественном результате. Клиенты ценят Ирину за опыт, тактичность и прекрасное чувство юмора, с которым процедуры проходят легко.",
  },
  {
    name: "Кристина Остапчук",
    role: "Массажист",
    photo: "/staff/kristina-ostapchuk.webp",
    bio: "Массажист высокого уровня со стажем более 20 лет, из них 15 с нами. Работает с разными видами массажа: лимфодренажным, антицеллюлитным, спортивным, а также с зонами напряжения и мышечными зажимами. Отдельное направление — талассо- и фангоритуалы, которые помогают скорректировать обмен веществ. Хорошо чувствует тело и подбирает подход под запрос, а клиенты возвращаются за деликатностью и ощутимым результатом.",
  },
];

/* Инициалы для подложки, когда фото ещё нет. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
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
          className="relative z-10 mb-6 h-0.5 w-10 rounded-full bg-accent"
        />
        <h2 className="relative z-10 font-display text-4xl font-medium text-ink-deep sm:text-5xl">
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
        {/* Слайды — мягкое перекрёстное затухание. */}
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
                {/* Фото 3:4 (или подложка с инициалами, пока нет фото). */}
                <div className="relative mx-auto aspect-[3/4] w-56 overflow-hidden rounded-2xl bg-surface ring-1 ring-ink-deep/10 sm:mx-0 sm:w-72 lg:w-[400px]">
                  {master.photo ? (
                    <Image
                      src={master.photo}
                      alt={master.name}
                      fill
                      sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 400px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-surface-accent">
                      <span
                        aria-hidden="true"
                        className="font-display text-6xl font-medium text-brand-400 sm:text-7xl"
                      >
                        {initialsOf(master.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Имя крупно фирменным шрифтом + описание. */}
                <div className="text-center sm:text-left">
                  {master.role && (
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                      {master.role}
                    </p>
                  )}
                  <h3 className="mt-3 font-display text-4xl font-medium leading-tight text-ink-deep sm:text-5xl lg:text-6xl">
                    {master.name}
                  </h3>
                  <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-deep/65 sm:mx-0 sm:text-base">
                    {master.bio}
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
