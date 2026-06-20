import type { Metadata } from "next";
import Image from "next/image";
import { BookingProvider } from "@/components/booking/BookingProvider";
import BookingButton from "@/components/booking/BookingButton";
import Header from "@/components/Header";
import { GIFT_CERTIFICATE_URL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { getServices } from "@/lib/sheet";

export const metadata: Metadata = {
  title: "Подарочный сертификат — Shati Studio",
  description:
    "Подарочный сертификат Shati Studio: выберите номинал и оформите онлайн — отличный подарок себе или близким.",
};

/* Доступные номиналы сертификата. */
const DENOMINATIONS = [
  "5 000 ₽",
  "7 000 ₽",
  "10 000 ₽",
  "15 000 ₽",
  "20 000 ₽",
  "30 000 ₽",
];

export default async function GiftCardsPage() {
  const services = await getServices();

  return (
    <BookingProvider>
      <Header variant="solid" services={services} />
      <main>
        <section className="bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-6">
            {/* Заголовок + описание. */}
            <header className="mx-auto max-w-2xl text-center">
              <span
                aria-hidden="true"
                className="mx-auto mb-6 block h-0.5 w-10 rounded-full bg-accent"
              />
              <h1 className="text-4xl font-medium uppercase tracking-[0.14em] text-ink-deep sm:text-5xl">
                Подарочный сертификат
              </h1>
              <p className="mt-6 leading-relaxed text-ink-deep/65 sm:text-lg">
                Больше не нужно думать о подарке близкому человеку. Выберите
                номинал и оформите подарочный сертификат на услуги Shati Studio —
                себе или в подарок.
              </p>
              {!GIFT_CERTIFICATE_URL && (
                <p className="mx-auto mt-5 max-w-md rounded-full bg-surface px-5 py-2.5 text-sm text-ink-deep/70">
                  Онлайн-оплата сертификатов скоро. Пока оформить можно по
                  телефону{" "}
                  <a
                    href={PHONE_HREF}
                    className="font-medium text-brand-600 underline-offset-4 hover:underline"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  .
                </p>
              )}
            </header>

            {/* Сетка номиналов: 1 → 2 → 3 колонки. Без подложки — у самой
                карты мягкая тень, чтобы она «лежала» над фоном. */}
            <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
              {DENOMINATIONS.map((denom) => (
                <li
                  key={denom}
                  className="flex flex-col items-center text-center"
                >
                  <Image
                    src="/gift_card_no_background.png"
                    alt={`Подарочный сертификат Shati Studio на ${denom}`}
                    width={2048}
                    height={1528}
                    sizes="(max-width: 640px) 86vw, (max-width: 1024px) 44vw, 360px"
                    className="h-auto w-full max-w-sm drop-shadow-[0_22px_45px_-22px_var(--brand-900)]"
                  />
                  <p className="mt-6 text-xl font-medium text-ink-deep">
                    {denom}
                  </p>
                  <BookingButton
                    label="Купить"
                    href={GIFT_CERTIFICATE_URL || PHONE_HREF}
                    className="mt-5 w-full max-w-xs"
                  />
                </li>
              ))}
            </ul>

            {/* Условия. */}
            <p className="mx-auto mt-16 max-w-3xl text-center text-sm leading-relaxed text-ink-deep/50 sm:mt-20">
              Сертификат действует во всех салонах Shati Studio (Тверской бульвар
              и Щёлковская). Им можно оплатить любую услугу салона. Если стоимость
              услуг превышает номинал — возможна доплата; при меньшей стоимости
              разница не возмещается. Сертификат возврату и обмену на денежный
              эквивалент не подлежит.
            </p>
          </div>
        </section>
      </main>
    </BookingProvider>
  );
}
