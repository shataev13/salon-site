"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  CONTACTS,
  NAV_LINKS,
  SERVICE_CATEGORIES,
  type Contact,
} from "@/lib/site";
import BookingButton from "./booking/BookingButton";
import Logo from "./Logo";

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

/* Иконки мессенджеров/телефона для быстрой связи. */
function ContactGlyph({ name }: { name: Contact["icon"] }) {
  switch (name) {
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212-.07-.062-.174-.041-.249-.024-.106.024-1.793 1.139-5.061 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      );
  }
}

const contactExternalProps = (c: Contact) =>
  c.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
    <header className="absolute inset-x-0 top-0 z-40 border-b border-ink/5 bg-background shadow-[0_14px_40px_-28px_var(--brand-950)]">
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
          href="#top"
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
            href="#top"
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
          <ServicesDropdown />
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
