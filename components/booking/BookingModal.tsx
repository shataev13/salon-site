"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { BOOKING_URL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])';

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

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Блокируем прокрутку фона.
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    // Фокус внутрь панели.
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Ловушка фокуса: Tab не выходит за пределы панели.
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
      // Возвращаем фокус на элемент, с которого открыли панель.
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  // open становится true только после клиентского взаимодействия,
  // поэтому портал в document.body не выполняется на сервере.
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* Затемнение фона — клик закрывает панель. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="u-fade-in absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      {/* Боковая панель справа на всю высоту. */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Онлайн-запись Shati Studio"
        tabIndex={-1}
        className="u-drawer-in absolute inset-y-0 right-0 flex w-full flex-col bg-background shadow-2xl outline-none sm:w-[480px] lg:w-[560px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть онлайн-запись"
          className="absolute left-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-background/90 text-ink shadow-md ring-1 ring-ink/10 backdrop-blur transition-colors hover:bg-background hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
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

        {BOOKING_URL ? (
          /* Виджет онлайн-записи YClients — на всю панель. */
          <iframe
            src={BOOKING_URL}
            title="Онлайн-запись Shati Studio"
            className="h-full w-full border-0"
          />
        ) : (
          /* Заглушка, пока не задана ссылка на онлайн-запись YClients. */
          <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-brand-100 text-brand-600">
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
            <div>
              <h2 id={titleId} className="font-display text-2xl font-medium text-ink">
                Онлайн-запись
              </h2>
              <p className="mt-2 text-sm text-ink/60">
                Виджет YClients подключается на этот экран.
              </p>
            </div>
            <p className="text-sm text-ink/60">
              Или позвоните нам:{" "}
              <a
                href={PHONE_HREF}
                className="font-medium text-brand-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                {PHONE_DISPLAY}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
