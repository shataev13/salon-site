"use client";

import { useState } from "react";
import { LOCATIONS, type PriceCategory, type PriceItem } from "@/lib/pricing";

function PriceRows({ items }: { items: PriceItem[] }) {
  return (
    <ul className="divide-y divide-ink-deep/10">
      {items.map((item) => (
        <li
          key={item.name}
          className="flex items-baseline justify-between gap-6 py-3.5"
        >
          <div className="min-w-0">
            <span className="text-sm text-ink-deep sm:text-base">
              {item.name}
            </span>
            {item.note && (
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-ink-deep/50">
                {item.note}
              </p>
            )}
          </div>
          <span className="shrink-0 whitespace-nowrap text-sm font-medium text-ink-deep sm:text-base">
            {item.price}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ServicePricing({
  category,
}: {
  category: PriceCategory;
}) {
  const [location, setLocation] = useState(0);
  const titledGroups = category.groups.filter((g) => g.title);
  // Несколько разделов могут быть открыты одновременно и не закрывают
  // друг друга — обычный независимый аккордеон. По умолчанию открыт первый.
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(titledGroups[0]?.title ? [titledGroups[0].title] : []),
  );

  const toggle = (title: string) =>
    setOpenGroups((cur) => {
      const next = new Set(cur);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-[960px] px-6">
        <header className="flex flex-col items-center text-center">
          <span
            aria-hidden="true"
            className="mb-6 h-0.5 w-10 rounded-full bg-accent"
          />
          <h2 className="text-4xl font-medium uppercase tracking-[0.14em] text-ink-deep sm:text-5xl">
            Стоимость услуг
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed tracking-wide text-ink-deep/50">
            Итоговая цена зависит от мастера и сложности работы.
          </p>

          {/* Переключатель салона. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {LOCATIONS.map((loc, index) => {
              const active = index === location;
              return (
                <button
                  key={loc}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLocation(index)}
                  className={`rounded-full px-6 py-3 text-xs font-medium uppercase tracking-[0.1em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active
                      ? "text-ink-deep ring-2 ring-ink-deep"
                      : "text-ink-deep/45 ring-1 ring-ink-deep/15 hover:text-ink-deep/70 hover:ring-ink-deep/30"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </header>

        <div className="mt-14 sm:mt-16">
          {category.groups.length === 0 ? (
            category.note && (
              <p className="text-center text-sm leading-relaxed text-ink-deep/55">
                {category.note}
              </p>
            )
          ) : titledGroups.length === 0 ? (
            // Одна группа без названия — показываем прайс сразу.
            <PriceRows items={category.groups[0].items} />
          ) : (
            // Группы услуги — аккордеонами.
            category.groups.map((group, index) => {
              const heading = group.title ?? `Группа ${index + 1}`;
              const isOpen = openGroups.has(heading);
              return (
                <div
                  key={heading}
                  className="border-t border-ink-deep/10 last:border-b"
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggle(heading)}
                      className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span className="text-base font-medium uppercase tracking-[0.12em] text-ink-deep sm:text-lg">
                        {heading}
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className={`size-5 shrink-0 text-ink-deep/50 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </h3>
                  {/* Плавное раскрытие по высоте: grid-template-rows 0fr→1fr.
                      Содержимое всегда смонтировано, поэтому анимация идёт
                      в обе стороны без рывка. */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-8">
                        <PriceRows items={group.items} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
