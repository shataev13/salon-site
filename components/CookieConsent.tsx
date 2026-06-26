"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "shati-cookie-consent";

/* Уведомление о cookie с подтверждением. Показывается один раз —
   до нажатия «Принять» (выбор хранится в localStorage). */
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
    <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="u-fade-in mx-auto flex max-w-[1100px] flex-col items-center gap-4 rounded-2xl bg-ink/95 px-5 py-4 text-white shadow-2xl backdrop-blur sm:flex-row sm:gap-6 sm:px-7">
        <p className="text-center text-sm leading-relaxed text-white/80 sm:text-left">
          Мы используем файлы cookie, чтобы сайт работал корректно и был удобнее.
          Продолжая пользоваться сайтом, вы соглашаетесь с этим.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-[image:var(--brand-gradient-strong)] px-7 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-10px_var(--brand-800)] transition-[transform,filter] duration-300 hover:-translate-y-0.5 hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
