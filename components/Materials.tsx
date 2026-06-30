import Image from "next/image";
import { BRANDS } from "@/lib/pricing";

export default function Materials() {
  return (
    <section
      id="materials"
      className="relative overflow-hidden bg-background py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1240px] px-6">
        <header className="flex flex-col items-center text-center">
          <span
            aria-hidden="true"
            className="mb-6 h-0.5 w-10 rounded-full bg-accent"
          />
          <h2 className="font-display text-4xl font-medium text-ink-deep sm:text-5xl">
            Наши материалы
          </h2>
          <p className="mt-4 text-sm tracking-wide text-ink-deep/50">
            Мы используем только лучшие материалы
          </p>
        </header>

        <ul className="mt-14 grid grid-cols-2 items-center gap-x-8 gap-y-12 sm:mt-20 sm:grid-cols-3 lg:grid-cols-6">
          {BRANDS.map((brand) => (
            <li key={brand.name} className="flex items-center justify-center">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={brand.width ?? 160}
                  height={brand.height ?? 64}
                  className="h-12 w-auto object-contain opacity-60 brightness-0 transition duration-300 hover:opacity-100 hover:brightness-100"
                />
              ) : (
                /* Слот под реальный логотип — пока название текстом. */
                <span className="text-lg font-semibold uppercase tracking-[0.15em] text-ink-deep/30 transition-colors duration-300 hover:text-ink-deep/70 sm:text-xl">
                  {brand.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
