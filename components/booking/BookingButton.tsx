"use client";

import Link from "next/link";
import { useBooking } from "./BookingProvider";

type Size = "md" | "lg";

const sizeClasses: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-9 text-base sm:text-lg",
};

const baseClass =
  "group bg-brand-500 text-white shadow-[0_8px_30px_-12px_var(--brand-700)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-[0_14px_40px_-12px_var(--brand-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0";

/* Главное действие сайта. Без href — открывает модалку записи; с href —
   рендерится ссылкой (переход на страницу). variant="icon" — компактная
   круглая кнопка (мобильный хедер). */
export default function BookingButton({
  size = "md",
  className = "",
  label = "Записаться",
  variant = "pill",
  href,
}: {
  size?: Size;
  className?: string;
  label?: string;
  variant?: "pill" | "icon";
  href?: string;
}) {
  const { open } = useBooking();

  const arrow = (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );

  const pillClass = `inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide ${baseClass} ${sizeClasses[size]} ${className}`;

  if (href) {
    const isWeb = /^https?:\/\//.test(href);
    // Внешние ссылки (http/tel/mailto) рендерим как <a>; веб — в новой вкладке.
    if (isWeb || /^(tel:|mailto:)/.test(href)) {
      return (
        <a
          href={href}
          {...(isWeb
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={pillClass}
        >
          {label}
          {arrow}
        </a>
      );
    }
    return (
      <Link href={href} className={pillClass}>
        {label}
        {arrow}
      </Link>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={open}
        aria-label={label}
        className={`grid size-10 place-items-center rounded-full ${baseClass} ${className}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
          <path d="M3 9h18M8 2.5v4M16 2.5v4" />
        </svg>
      </button>
    );
  }

  return (
    <button type="button" onClick={open} className={pillClass}>
      {label}
      {arrow}
    </button>
  );
}
