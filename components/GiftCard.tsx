"use client";

import { type PointerEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import BookingButton from "./booking/BookingButton";

/* Максимальный наклон карты — лёгкий, не агрессивный. */
const MAX_TILT = 9;

export default function GiftCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  // Наклон только для мыши: на тач-устройствах и при reduced-motion — статично.
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setInteractive(hover.matches && !reduce.matches);
    apply();
    hover.addEventListener("change", apply);
    reduce.addEventListener("change", apply);
    return () => {
      hover.removeEventListener("change", apply);
      reduce.removeEventListener("change", apply);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const setVar = (name: string, value: string) =>
    cardRef.current?.style.setProperty(name, value);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // -0.5…0.5 относительно центра карты.
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setVar("--gy", `${px * MAX_TILT}deg`);
      setVar("--gx", `${-py * MAX_TILT}deg`);
    });
  };

  const handleEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.pointerType !== "mouse") return;
    // Снижаем длительность перехода — карта 1:1 следует за курсором.
    setVar("--gdur", "0.12s");
  };

  const handleLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    // Плавно возвращаем карту в исходное положение.
    setVar("--gdur", "0.55s");
    setVar("--gx", "0deg");
    setVar("--gy", "0deg");
  };

  return (
    <section
      id="gift-cards"
      className="relative overflow-hidden bg-background py-20 sm:py-28"
    >
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-6 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Карта с лёгким 3D-наклоном за курсором (без свечения и бликов). */}
        <div className="flex justify-center [perspective:1100px]">
          <div
            ref={cardRef}
            onPointerMove={handleMove}
            onPointerEnter={handleEnter}
            onPointerLeave={handleLeave}
            className="gift-tilt relative mx-auto aspect-[7/5] w-full max-w-md"
          >
            {/* Мужская карта — чуть позади, выглядывает из-за женской. */}
            <Image
              src="/gift-card-male.svg"
              alt="Мужской подарочный сертификат Shati Studio"
              width={420}
              height={266}
              className="absolute left-1/2 top-1/2 h-auto w-[80%] -translate-x-[38%] -translate-y-[60%] rotate-[5deg] drop-shadow-[0_22px_45px_-20px_var(--brand-900)]"
            />
            {/* Женская карта — спереди. */}
            <Image
              src="/gift-card-female.svg"
              alt="Женский подарочный сертификат Shati Studio"
              width={420}
              height={266}
              className="absolute left-1/2 top-1/2 h-auto w-[82%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_28px_55px_-22px_var(--brand-900)]"
            />
          </div>
        </div>

        {/* Текст + переход на страницу сертификатов. */}
        <div className="text-center md:text-left">
          <span
            aria-hidden="true"
            className="mx-auto mb-6 block h-0.5 w-10 rounded-full bg-accent md:mx-0"
          />
          <h2 className="text-4xl font-medium uppercase tracking-[0.14em] text-ink-deep sm:text-5xl">
            Подарочный сертификат
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-deep/65 sm:text-lg md:mx-0">
            Больше не нужно думать о подарке близкому человеку. Оформите
            подарочный сертификат на услуги Shati Studio — себе или в подарок.
          </p>
          <div className="mt-9 flex justify-center md:justify-start">
            <BookingButton size="lg" label="Оформить" href="/gift-cards" />
          </div>
        </div>
      </div>
    </section>
  );
}
