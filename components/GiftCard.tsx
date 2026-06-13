import Image from "next/image";
import BookingButton from "./booking/BookingButton";

export default function GiftCard() {
  return (
    <section
      id="gift-cards"
      className="relative overflow-hidden bg-background py-20 sm:py-28"
    >
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-6 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Просто фото карты — без анимаций. */}
        <div className="flex justify-center">
          <Image
            src="/gift_card_no_background.png"
            alt="Подарочный сертификат Shati Studio"
            width={2048}
            height={1528}
            sizes="(max-width: 768px) 88vw, 460px"
            className="h-auto w-full max-w-md drop-shadow-[0_24px_50px_-22px_var(--brand-900)]"
          />
        </div>

        {/* Текст + действие. */}
        <div className="text-center md:text-left">
          <span
            aria-hidden="true"
            className="mx-auto mb-6 block h-0.5 w-10 rounded-full bg-accent md:mx-0"
          />
          <h2 className="text-4xl font-medium uppercase tracking-[0.14em] text-ink-deep sm:text-5xl">
            Подарочный сертификат
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-deep/65 sm:text-lg md:mx-0">
            Больше не нужно думать о подарке близкому человеку. Оформите
            подарочный сертификат на услуги Shati Studio — себе или в подарок.
          </p>
          <div className="mt-9 flex justify-center md:justify-start">
            <BookingButton size="lg" label="Оформить" />
          </div>
        </div>
      </div>
    </section>
  );
}
