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
      setVar("--gmx", `${px * 100 + 50}%`);
      setVar("--gmy", `${py * 100 + 50}%`);
    });
  };

  const handleEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.pointerType !== "mouse") return;
    // Снижаем длительность перехода — карта 1:1 следует за курсором.
    setVar("--gdur", "0.12s");
    setVar("--gop", "1");
  };

  const handleLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    // Плавно возвращаем карту в исходное положение.
    setVar("--gdur", "0.55s");
    setVar("--gx", "0deg");
    setVar("--gy", "0deg");
    setVar("--gop", "0");
  };

  return (
    <section
      id="gift-cards"
      className="relative overflow-hidden bg-background py-20 sm:py-28"
    >
      {/* Мягкое фирменное свечение позади карты. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--brand-200),transparent_70%)] opacity-60 blur-2xl md:left-[28%]"
      />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-6 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Карта с 3D-наклоном за курсором. */}
        <div className="flex justify-center [perspective:1100px]">
          <div
            ref={cardRef}
            onPointerMove={handleMove}
            onPointerEnter={handleEnter}
            onPointerLeave={handleLeave}
            className="gift-tilt relative w-full max-w-md"
          >
            <Image
              src="/gift_card_no_background.png"
              alt="Подарочный сертификат Shati Studio"
              width={2048}
              height={1528}
              sizes="(max-width: 768px) 88vw, 460px"
              className="h-auto w-full drop-shadow-[0_28px_55px_-20px_var(--brand-900)]"
            />
            {/* Блик, следующий за курсором; обрезан по форме карты (маска по PNG). */}
            <span
              aria-hidden="true"
              className="gift-glare pointer-events-none absolute inset-0"
            />
          </div>
        </div>

        {/* Текст + действие. */}
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
            <BookingButton size="lg" label="Оформить" />
          </div>
        </div>
      </div>
    </section>
  );
}
