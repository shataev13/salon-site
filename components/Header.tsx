"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  NAV_LINKS,
  PHONE_DISPLAY,
  PHONE_HREF,
  SERVICE_CATEGORIES,
  type NavLink,
} from "@/lib/site";
import BookingButton from "./booking/BookingButton";

const navLinkClass =
  "text-sm font-medium tracking-wide text-white/80 transition-colors hover:text-white";

const accentLinkClass =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium text-brand-50 ring-1 ring-brand-300/45 transition-colors hover:bg-brand-400/20 hover:text-white";

function Sparkle() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="currentColor"
    >
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
    </svg>
  );
}

/* Выпадающий список категорий для пункта «Услуги». */
function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!ref.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 ${navLinkClass}`}
      >
        Услуги
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={menuId}
        role="menu"
        className={`absolute left-0 top-full z-50 mt-4 w-80 transition duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl bg-background shadow-xl shadow-ink/10 ring-1 ring-ink/5">
          {/* Эхо «светового штриха» — тонкая фирменная линия. */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
          <ul className="p-2">
            {SERVICE_CATEGORIES.map((cat) => (
              <li key={cat.label}>
                <Link
                  href="#services"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-surface"
                >
                  <span className="block text-sm font-medium text-ink">
                    {cat.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink/55">
                    {cat.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function renderLink(link: NavLink, onClick?: () => void) {
  return (
    <Link
      key={link.href}
      href={link.href}
      onClick={onClick}
      className={link.accent ? accentLinkClass : navLinkClass}
    >
      {link.accent && <Sparkle />}
      {link.label}
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const leftLinks = NAV_LINKS.filter((l) => !l.accent).slice(0, 3);
  const rightLinks = NAV_LINKS.filter(
    (l) => l.label === "Подарочные карты" || l.label === "Контакты",
  );

  // Блокировка прокрутки, Escape и фокус для мобильного меню.
  useEffect(() => {
    if (!menuOpen) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-5 sm:px-8 sm:py-6">
        {/* Левая зона: десктоп-навигация / мобильный бургер. */}
        <nav className="hidden items-center gap-7 justify-self-start xl:flex">
          <ServicesDropdown />
          {leftLinks
            .filter((l) => !l.hasMenu)
            .map((link) => renderLink(link))}
        </nav>
        <button
          type="button"
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
          className="grid size-10 place-items-center justify-self-start rounded-full text-white/90 transition-colors hover:bg-white/10 xl:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {/* Центр: вордмарк. brand-400 — ступень фирменной шкалы,
            читается на тёмном видео и остаётся узнаваемо «фирменной». */}
        <Link
          href="#top"
          aria-label="Shati Studio — на главную"
          className="justify-self-center"
        >
          <span className="u-wordmark font-display text-2xl font-bold tracking-[0.2em] text-brand-400 sm:text-3xl">
            SHATI
          </span>
        </Link>

        {/* Правая зона: десктоп-действия / мобильная кнопка записи. */}
        <div className="hidden items-center gap-5 justify-self-end xl:flex">
          {rightLinks.map((link) => renderLink(link))}
          <span aria-hidden="true" className="h-5 w-px bg-white/20" />
          <a
            href={PHONE_HREF}
            className={`inline-flex items-center gap-2 whitespace-nowrap ${navLinkClass}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16 16 0 014.5 6.2 2 2 0 016.5 4z" />
            </svg>
            {PHONE_DISPLAY}
          </a>
          <BookingButton size="md" />
        </div>
        <div className="justify-self-end xl:hidden">
          <BookingButton size="md" className="h-10 px-5 text-sm" />
        </div>
      </div>

      {/* Мобильное меню. */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
          className="u-fade-in fixed inset-0 z-50 flex flex-col bg-background xl:hidden"
        >
          <div className="flex items-center justify-between px-5 py-5 sm:px-8">
            <span className="font-display text-2xl font-bold tracking-[0.2em] text-brand-500">
              SHATI
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Закрыть меню"
              onClick={closeMenu}
              className="grid size-10 place-items-center rounded-full text-ink/60 transition-colors hover:bg-surface hover:text-ink"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-4 sm:px-8">
            {/* Услуги — раскрываемый список категорий. */}
            <button
              type="button"
              aria-expanded={mobileServicesOpen}
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex items-center justify-between py-3 font-display text-2xl text-ink"
            >
              Услуги
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className={`size-5 text-ink/50 transition-transform duration-300 ${
                  mobileServicesOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {mobileServicesOpen && (
              <ul className="mb-2 flex flex-col gap-1 border-l border-brand-100 pl-4">
                {SERVICE_CATEGORIES.map((cat) => (
                  <li key={cat.label}>
                    <Link
                      href="#services"
                      onClick={closeMenu}
                      className="block py-2 text-base text-ink/70 transition-colors hover:text-brand-600"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {NAV_LINKS.filter((l) => !l.hasMenu).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`flex items-center gap-2 py-3 font-display text-2xl ${
                  link.accent ? "text-brand-600" : "text-ink"
                }`}
              >
                {link.accent && <Sparkle />}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-brand-100 px-5 py-6 sm:px-8">
            <a
              href={PHONE_HREF}
              className="block text-center text-lg font-medium text-ink"
            >
              {PHONE_DISPLAY}
            </a>
            <div className="mt-4">
              <BookingButton size="lg" className="w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
