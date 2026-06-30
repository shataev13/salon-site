import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookingProvider } from "@/components/booking/BookingProvider";
import BookingButton from "@/components/booking/BookingButton";
import ContactIcons from "@/components/ContactIcons";
import Header from "@/components/Header";
import Services from "@/components/Services";
import LivePricing from "@/components/LivePricing";
import { getPriceCategories, getServices } from "@/lib/sheet";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((s) => s.slug === slug);
  return {
    title: service ? `${service.title} — Shati Studio` : "Shati Studio",
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const services = await getServices();
  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index];
  if (!service) notFound();

  const num = String(index + 1).padStart(2, "0");
  const categories = await getPriceCategories();
  const category = categories.find((c) => c.id === service.slug);
  const description = category?.intro ?? service.description;

  return (
    <BookingProvider>
      <Header variant="solid" services={services} />
      <main>
        {/* Первый экран: фон во всю ширину, контент по центру. */}
        <section className="bg-surface-warm">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-6 py-16 sm:py-20 md:grid-cols-2 md:gap-14 lg:gap-20">
            {/* Фото: на десктопе слева, на мобиле — под текстом и компактное. */}
            <div className="order-2 mx-auto w-full max-w-xs md:order-1 md:max-w-none">
              <div
                className={`relative aspect-[3/4] w-full overflow-hidden rounded-[20px] ${service.photo ? "bg-surface" : service.placeholder}`}
              >
                {service.photo && (
                  <Image
                    src={service.photo}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 320px, 600px"
                    className="object-cover"
                    preload
                  />
                )}
              </div>
            </div>

            {/* Текст: на мобиле первым — сразу видно, что за услуга. */}
            <div className="order-1 text-center md:order-2 md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {num} — Услуга
              </p>
              <span
                aria-hidden="true"
                className="mx-auto mt-5 block h-0.5 w-10 rounded-full bg-accent md:mx-0"
              />
              <h1 className="mt-7 text-balance font-display text-4xl font-medium leading-tight text-ink-deep sm:text-5xl">
                {service.title}
              </h1>
              <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-deep/65 sm:text-lg md:mx-0">
                {description}
              </p>
              <div className="mt-9 flex justify-center md:justify-start">
                <BookingButton size="lg" />
              </div>
              <ContactIcons className="mt-8 justify-center md:justify-start" />
            </div>
          </div>
        </section>

        {/* Стоимость именно этой услуги. Цены подтягиваются вживую из
            Google Таблицы через PHP-прокси (см. components/LivePricing). */}
        {category && <LivePricing category={category} slug={service.slug} />}

        {/* Другие услуги — наш блок карточек. */}
        <Services id="other-services" title="Другие услуги" subtitle="Выберите услугу" />
      </main>
    </BookingProvider>
  );
}
