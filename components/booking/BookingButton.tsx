"use client";

import { useBooking } from "./BookingProvider";

type Size = "md" | "lg";

const sizeClasses: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-9 text-base sm:text-lg",
};

/* Главное действие сайта. Все экземпляры открывают одну модалку записи. */
export default function BookingButton({
  size = "md",
  className = "",
  label = "Записаться",
}: {
  size?: Size;
  className?: string;
  label?: string;
}) {
  const { open } = useBooking();

  return (
    <button
      type="button"
      onClick={open}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 font-medium tracking-wide text-white shadow-[0_8px_30px_-12px_var(--brand-700)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-[0_14px_40px_-12px_var(--brand-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 ${sizeClasses[size]} ${className}`}
    >
      {label}
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
    </button>
  );
}
