import Link from "next/link";
import Image from "next/image";
import { getServices } from "@/lib/sheet";

export default async function Services({
  id = "services",
  title = "Услуги",
  subtitle = "Выберите категорию",
}: {
  id?: string;
  title?: string;
  subtitle?: string;
}) {
  const services = await getServices();
  return (
    <section
      id={id}
      className="relative overflow-hidden bg-surface-warm py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1240px] px-6">
        {/* Шапка секции с контурным водяным знаком позади. */}
        <header className="relative flex flex-col items-center py-6 text-center">
<span
            aria-hidden="true"
            className="relative z-10 mb-6 h-0.5 w-10 rounded-full bg-accent"
          />
          <h2 className="relative z-10 font-display text-4xl font-medium text-ink-deep sm:text-5xl">
            {title}
          </h2>
          <p className="relative z-10 mt-4 text-sm tracking-wide text-ink-deep/50">
            {subtitle}
          </p>
        </header>

        {/* Сетка: 4 → 2 (≤1024px) → 1 (≤560px). */}
        <ul className="mt-12 grid grid-cols-1 gap-[22px] min-[560px]:grid-cols-2 sm:mt-16 lg:grid-cols-4">
          {services.map((service, index) => (
            <li key={service.title}>
              <Link
                href={`/services/${service.slug}`}
                aria-label={service.title}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-warm"
              >
                {/* Фото услуги: лёгкий zoom на hover (фолбэк — градиент). */}
                {service.photo ? (
                  <Image
                    src={service.photo}
                    alt={service.title}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.045]"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 ${service.placeholder} transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.045]`}
                  />
                )}
                {/* Затемнение снизу под текст. */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/25 to-transparent" />

                {/* Индекс. */}
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-5 text-sm font-medium tracking-widest text-white/80"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Подпись. */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-xl font-medium leading-snug text-white">
                    {service.title}
                  </h3>
                  {/* Акцентная линия, удлиняется на hover. */}
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-0.5 w-8 bg-accent transition-[width] duration-500 ease-out motion-safe:group-hover:w-16"
                  />
                  {/* «подробнее» со стрелкой. */}
                  <span
                    aria-hidden="true"
                    className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/85"
                  >
                    подробнее
                    <svg
                      viewBox="0 0 24 24"
                      className="size-3.5 transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
