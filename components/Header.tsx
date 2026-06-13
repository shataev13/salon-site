"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  CONTACTS,
  NAV_LINKS,
  SERVICES,
  type Contact,
  type Service,
} from "@/lib/site";
import BookingButton from "./booking/BookingButton";
import Logo from "./Logo";
import { ContactGlyph } from "./ContactIcons";

// Нижний ярус навигации — капс с трекингом (в духе reference).
const navTierClass =
  "text-[13px] font-medium uppercase tracking-[0.16em] text-ink/65 transition-colors hover:text-brand-600";

// Акцентный пункт «Подарочные карты» в нижнем ярусе.
const giftTierClass =
  "inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.16em] text-brand-600 transition-colors hover:text-brand-700";

// Круглые иконки связи — фиолетовые, на белом хедере.
const iconButtonClass =
  "grid place-items-center rounded-full text-brand-600 ring-1 ring-brand-200 transition-colors hover:bg-brand-50 hover:text-brand-700";

const plainLinks = NAV_LINKS.filter((l) => !l.hasMenu && !l.accent);
const giftCard = NAV_LINKS.find((l) => l.accent);
const phoneContact = CONTACTS.find((c) => c.icon === "phone");

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

const contactExternalProps = (c: Contact) =>
  c.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

/* Выпадающий список категорий для пункта «Услуги». */
function ServicesDropdown({ services }: { services: Service[] }) {
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
        className={`inline-flex items-center gap-1.5 ${navTierClass}`}
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
        className={`absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-4 transition duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl bg-background shadow-xl shadow-ink/10 ring-1 ring-ink/5">
          {/* Эхо «светового штриха» — тонкая фирменная линия. */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
          <ul className="p-2">
            {services.map((service) => (
              <li key={service.title}>
                <Link
                  href={`/services/${service.slug}`}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-surface"
                >
                  <span className="block text-sm font-medium text-ink">
                    {service.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink/55">
                    {service.description}
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

export default function Header({
  variant = "overlay",
  services = SERVICES,
}: {
  /* overlay — поверх героя на главной; solid — обычная плашка на стр. услуг. */
  variant?: "overlay" | "solid";
  /* Список услуг (для дропдауна и меню). По умолчанию — из кода. */
  services?: Service[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const positionClass =
    variant === "overlay" ? "absolute inset-x-0 top-0" : "sticky top-0";
  // Логотип всегда ведёт на главную страницу — с любой страницы сайта.
  const homeHref = "/";

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
    <header
      className={`${positionClass} z-40 border-b border-ink/5 bg-background shadow-[0_14px_40px_-28px_var(--brand-950)]`}
    >
      {/* === Мобайл / планшет (< lg): бургер · логотип · телефон + запись === */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6 lg:hidden">
        <button
          type="button"
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
          className="grid size-10 place-items-center rounded-full text-brand-600 transition-colors hover:bg-brand-50"
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

        <Link
          href={homeHref}
          aria-label="Shati Studio — на главную"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Logo imgClassName="h-8 w-auto" textClassName="text-xl" />
        </Link>

        <div className="flex items-center gap-2">
          {phoneContact && (
            <a
              href={phoneContact.href}
              aria-label={phoneContact.label}
              className={`size-10 ${iconButtonClass}`}
            >
              <ContactGlyph name="phone" />
            </a>
          )}
          <BookingButton variant="icon" />
        </div>
      </div>

      {/* === Десктоп (>= lg): два яруса как у reference === */}
      <div className="hidden lg:block">
        {/* Ярус 1: иконка записи · логотип по центру · иконки связи */}
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 pt-6 pb-4">
          <BookingButton variant="icon" />

          <Link
            href={homeHref}
            aria-label="Shati Studio — на главную"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Logo imgClassName="h-12 w-auto" textClassName="text-4xl" />
          </Link>

          <div className="flex items-center gap-2">
            {CONTACTS.map((c) => (
              <a
                key={c.icon}
                href={c.href}
                aria-label={c.label}
                {...contactExternalProps(c)}
                className={`size-9 ${iconButtonClass}`}
              >
                <ContactGlyph name={c.icon} />
              </a>
            ))}
          </div>
        </div>

        {/* Разделитель на всю ширину */}
        <div className="border-t border-ink/10" />

        {/* Ярус 2: навигация по центру */}
        <nav className="mx-auto flex max-w-7xl items-center justify-center gap-9 px-8 py-3.5">
          <ServicesDropdown services={services} />
          {plainLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navTierClass}>
              {link.label}
            </Link>
          ))}
          {giftCard && (
            <Link href={giftCard.href} className={giftTierClass}>
              <Sparkle />
              {giftCard.label}
            </Link>
          )}
        </nav>
      </div>

      {/* Мобильное меню. */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
          className="u-fade-in fixed inset-0 z-50 flex flex-col bg-background lg:hidden"
        >
          <div className="flex items-center justify-between px-5 py-5 sm:px-8">
            <Logo imgClassName="h-8 w-auto" textClassName="text-2xl" />
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
              className="u-menu-item flex items-center justify-between py-3 font-display text-2xl text-ink"
              style={{ animationDelay: "0.05s" }}
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
              <ul className="u-accordion mb-2 flex flex-col gap-1 border-l border-brand-100 pl-4">
                {services.map((service) => (
                  <li key={service.title}>
                    <Link
                      href={`/services/${service.slug}`}
                      onClick={closeMenu}
                      className="block py-2 text-base text-ink/70 transition-colors hover:text-brand-600"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {plainLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="u-menu-item py-3 font-display text-2xl text-ink"
                style={{ animationDelay: `${0.11 + i * 0.06}s` }}
              >
                {link.label}
              </Link>
            ))}
            {giftCard && (
              <Link
                href={giftCard.href}
                onClick={closeMenu}
                className="u-menu-item flex items-center gap-2 py-3 font-display text-2xl text-brand-600"
                style={{ animationDelay: `${0.11 + plainLinks.length * 0.06}s` }}
              >
                <Sparkle />
                {giftCard.label}
              </Link>
            )}
          </nav>

          <div className="border-t border-brand-100 px-5 py-6 sm:px-8">
            {/* Контакты иконками — без текста, действие по клику. */}
            <div
              className="u-menu-item flex items-center justify-center gap-3"
              style={{ animationDelay: "0.3s" }}
            >
              {CONTACTS.map((c) => (
                <a
                  key={c.icon}
                  href={c.href}
                  aria-label={c.label}
                  {...contactExternalProps(c)}
                  className={`size-11 ${iconButtonClass}`}
                >
                  <ContactGlyph name={c.icon} />
                </a>
              ))}
            </div>
            <div className="u-menu-item mt-5" style={{ animationDelay: "0.36s" }}>
              <BookingButton size="lg" className="w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
