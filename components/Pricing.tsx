"use client";

import { useState } from "react";
import { LOCATIONS, PRICE_CATEGORIES } from "@/lib/pricing";

export default function Pricing() {
  const [location, setLocation] = useState(0);
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (id: string) => setOpen((cur) => (cur === id ? null : id));

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-surface-warm py-20 sm:py-28"
    >
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
            Выберите салон и категорию. Итоговая цена зависит от мастера и
            сложности работы.
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
                  className={`rounded-full px-6 py-3 text-xs font-medium uppercase tracking-[0.1em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-warm ${
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

        {/* Аккордеоны категорий. */}
        <div className="mt-14 sm:mt-16">
          {PRICE_CATEGORIES.map((category) => {
            const isOpen = open === category.id;
            return (
              <div
                key={category.id}
                className="border-t border-ink-deep/10 last:border-b"
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(category.id)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-warm"
                  >
                    <span className="text-base font-medium uppercase tracking-[0.12em] text-ink-deep sm:text-lg">
                      {category.title}
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

                {isOpen && (
                  <div className="u-accordion pb-12">
                    {/* Фото + текст. */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                      <div
                        className={`aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl ${category.placeholder} md:aspect-[5/4] md:w-72`}
                      />
                      <p className="text-sm leading-relaxed text-ink-deep/65 md:pt-1 md:text-base">
                        {category.intro}
                      </p>
                    </div>

                    {/* Прайс. */}
                    {category.groups.length > 0 ? (
                      <div className="mt-10 space-y-9">
                        {category.groups.map((group, gi) => (
                          <div key={group.title ?? gi}>
                            {group.title && (
                              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                                {group.title}
                              </h4>
                            )}
                            <ul className="divide-y divide-ink-deep/10">
                              {group.items.map((item) => (
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
                          </div>
                        ))}
                      </div>
                    ) : (
                      category.note && (
                        <p className="mt-8 text-sm leading-relaxed text-ink-deep/55">
                          {category.note}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
