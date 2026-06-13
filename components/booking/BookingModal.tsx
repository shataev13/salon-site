"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Блокируем прокрутку фона.
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    // Фокус внутрь окна.
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Ловушка фокуса: Tab не выходит за пределы окна.
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === dialog);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      body.style.overflow = prevOverflow;
      // Возвращаем фокус на элемент, с которого открыли окно.
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  // open становится true только после клиентского взаимодействия,
  // поэтому портал в document.body не выполняется на сервере.
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      {/* Затемнение фона — клик закрывает окно. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="u-fade-in absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className="u-panel-in relative z-[1] w-full max-w-lg rounded-t-3xl bg-background p-6 shadow-2xl outline-none sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.22em] text-brand-500">
              Shati Studio
            </p>
            <h2
              id={titleId}
              className="mt-2 font-display text-3xl font-medium text-ink"
            >
              Онлайн-запись
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно записи"
            className="grid size-10 shrink-0 place-items-center rounded-full text-ink/60 transition-colors hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p id={descId} className="mt-3 text-sm leading-relaxed text-ink/65">
          Выберите услугу, мастера и удобное время — запись займёт пару минут.
        </p>

        {/* Слот под виджет UniverseCRM (пока заглушка). */}
        <div className="mt-6 grid min-h-64 place-items-center rounded-2xl border border-dashed border-brand-200 bg-surface px-6 py-10 text-center">
          <div className="max-w-xs">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-100 text-brand-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="17" rx="2.5" />
                <path d="M3 9h18M8 2.5v3M16 2.5v3" />
              </svg>
            </span>
            <p className="mt-4 font-medium text-ink">Здесь появится виджет записи</p>
            <p className="mt-1 text-sm text-ink/60">
              Онлайн-запись UniverseCRM подключается на этот экран.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          Или позвоните нам:{" "}
          <a
            href={PHONE_HREF}
            className="font-medium text-brand-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            {PHONE_DISPLAY}
          </a>
        </p>
      </div>
    </div>,
    document.body,
  );
}
