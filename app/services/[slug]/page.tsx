import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingProvider } from "@/components/booking/BookingProvider";
import BookingButton from "@/components/booking/BookingButton";
import ContactIcons from "@/components/ContactIcons";
import Header from "@/components/Header";
import { SERVICES } from "@/lib/site";
import { PRICE_CATEGORIES } from "@/lib/pricing";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  return {
    title: service ? `${service.title} — Shati Studio` : "Shati Studio",
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const index = SERVICES.findIndex((s) => s.slug === slug);
  const service = SERVICES[index];
  if (!service) notFound();

  const num = String(index + 1).padStart(2, "0");
  // Описание берём из нашего же контента раздела «Стоимость».
  const description =
    PRICE_CATEGORIES.find((c) => c.id === service.slug)?.intro ??
    service.description;

  return (
    <BookingProvider>
      <Header variant="solid" />
      <main className="bg-surface-warm">
        <section className="mx-auto grid max-w-[1240px] items-center gap-10 px-6 py-16 sm:py-20 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* Слева: фото-панель (наше скругление карточек, слот под фото). */}
          <div
            className={`aspect-[3/4] w-full overflow-hidden rounded-[20px] ${service.placeholder}`}
          >
            {/* Слот под реальное фото услуги:
                <Image src="..." alt="" fill className="object-cover" /> */}
          </div>

          {/* Справа: индекс, заголовок, описание, запись, контакты. */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              {num} — Услуга
            </p>
            <span
              aria-hidden="true"
              className="mt-5 block h-0.5 w-10 rounded-full bg-accent"
            />
            <h1 className="mt-7 text-4xl font-medium uppercase tracking-[0.12em] text-ink-deep sm:text-5xl lg:text-6xl">
              {service.title}
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-ink-deep/65 sm:text-lg">
              {description}
            </p>
            <div className="mt-9">
              <BookingButton size="lg" />
            </div>
            <ContactIcons className="mt-8" />
          </div>
        </section>
      </main>
    </BookingProvider>
  );
}
