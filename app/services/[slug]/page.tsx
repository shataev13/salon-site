import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingProvider } from "@/components/booking/BookingProvider";
import BookingButton from "@/components/booking/BookingButton";
import Header from "@/components/Header";
import { SERVICES } from "@/lib/site";

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
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <BookingProvider>
      <Header variant="solid" />
      <main className="bg-surface-warm">
        <section className="mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center justify-center px-6 py-24 text-center">
          <span
            aria-hidden="true"
            className="mb-6 h-0.5 w-10 rounded-full bg-accent"
          />
          <h1 className="text-4xl font-medium uppercase tracking-[0.12em] text-ink-deep sm:text-5xl lg:text-6xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed text-ink-deep/55 sm:text-lg">
            Страница услуги в разработке. Скоро здесь появится подробное
            описание, цены и онлайн-запись.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <BookingButton size="lg" />
            <Link
              href="/#services"
              className="rounded text-sm font-medium uppercase tracking-[0.14em] text-ink-deep/60 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-warm"
            >
              ← Ко всем услугам
            </Link>
          </div>
        </section>
      </main>
    </BookingProvider>
  );
}
