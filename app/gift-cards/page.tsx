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
    "Подарочный сертификат Shati Studio: женский и мужской, разные номиналы. Отличный подарок себе или близким.",
};

/* Две карты: женская (до 100 000 ₽) и мужская (до 50 000 ₽). */
const CERTIFICATES = [
  {
    title: "Женский сертификат",
    image: "/gift-card-female.svg",
    denominations: [
      "5 000 ₽",
      "10 000 ₽",
      "20 000 ₽",
      "30 000 ₽",
      "50 000 ₽",
      "100 000 ₽",
    ],
  },
  {
    title: "Мужской сертификат",
    image: "/gift-card-male.svg",
    denominations: [
      "5 000 ₽",
      "10 000 ₽",
      "15 000 ₽",
      "20 000 ₽",
      "30 000 ₽",
      "50 000 ₽",
    ],
  },
];

/* Куда ведёт «Купить»: онлайн-оплата YClients (когда подключат) или телефон. */
const BUY_HREF = GIFT_CERTIFICATE_URL || PHONE_HREF;

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
                Лучший подарок себе или близким. Женский сертификат — до
                100 000 ₽, мужской — до 50 000 ₽. Выберите номинал и оформите за
                пару минут.
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

            {/* Два типа карт, у каждого — свой набор номиналов. */}
            <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
              {CERTIFICATES.map((cert) => (
                <div key={cert.title}>
                  <h2 className="text-center text-2xl font-medium uppercase tracking-[0.12em] text-ink-deep sm:text-3xl">
                    {cert.title}
                  </h2>
                  <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {cert.denominations.map((denom) => (
                      <li
                        key={denom}
                        className="flex flex-col items-center text-center"
                      >
                        <Image
                          src={cert.image}
                          alt={`${cert.title} Shati Studio на ${denom}`}
                          width={420}
                          height={266}
                          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 380px"
                          className="h-auto w-full max-w-sm drop-shadow-[0_18px_40px_-20px_var(--brand-900)]"
                        />
                        <p className="mt-6 text-xl font-medium text-ink-deep">
                          {denom}
                        </p>
                        <BookingButton
                          label="Купить"
                          href={BUY_HREF}
                          className="mt-5 w-full max-w-xs"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Условия. */}
            <p className="mx-auto mt-16 max-w-3xl text-center text-sm leading-relaxed text-ink-deep/50 sm:mt-20">
              Сертификат действует в салоне Shati Studio. Им можно оплатить любую
              услугу салона. Если стоимость услуг превышает номинал — возможна
              доплата; при меньшей стоимости разница не возмещается. Сертификат
              возврату и обмену на денежный эквивалент не подлежит.
            </p>
          </div>
        </section>
      </main>
    </BookingProvider>
  );
}
