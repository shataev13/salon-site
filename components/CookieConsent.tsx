"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "shati-cookie-consent";

/* Cookie-баннер внизу экрана. Показывается при первом заходе; «Принять»
   запоминает выбор в localStorage, поэтому повторно не появляется. */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // На кадр позже — без мерцания и без setState прямо в эффекте.
    const id = requestAnimationFrame(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        setVisible(true);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Уведомление об использовании cookie"
      className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="u-fade-in mx-auto flex max-w-[1100px] flex-col gap-4 rounded-2xl bg-ink/95 px-5 py-5 text-white shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:px-7">
        <p className="text-center text-sm leading-relaxed text-white/80 sm:text-left">
          Мы используем файлы cookie. Сайт использует файлы cookie и сервис
          Яндекс.Метрика для аналитики и улучшения работы. Продолжая пользоваться
          сайтом, вы соглашаетесь с обработкой cookie в соответствии с{" "}
          <Link
            href="/policy"
            className="font-medium text-brand-300 underline-offset-4 hover:underline"
          >
            Политикой обработки персональных данных
          </Link>
          .
        </p>

        <div className="flex shrink-0 items-center justify-center gap-2.5 sm:justify-end">
          <Link
            href="/policy"
            className="rounded-full px-5 py-2.5 text-sm font-medium text-white/80 ring-1 ring-white/20 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            Подробнее
          </Link>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-[image:var(--brand-gradient-strong)] px-7 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-10px_var(--brand-800)] transition-[transform,filter] duration-300 hover:-translate-y-0.5 hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
