import Image from "next/image";

/* Раздел о генеральном директоре — Светлане Шатаевой.
   Когда фото будет загружено в /public/staff/, пропишите путь в PHOTO
   (например "/staff/svetlana-shataeva.webp") — появится портрет вместо
   подложки с инициалами. */
const PHOTO: string | null = null;

export default function Director() {
  return (
    <section id="director" className="bg-surface-accent py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Текст слева на десктопе. */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <span
            aria-hidden="true"
            className="mx-auto mb-6 block h-0.5 w-10 rounded-full bg-accent md:mx-0"
          />
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
            Генеральный директор
          </p>
          <h2 className="mt-3 font-display text-5xl font-medium leading-tight text-ink-deep sm:text-6xl">
            Светлана Шатаева
          </h2>

          <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-deep/70 sm:text-lg md:mx-0">
            Shati Studio работает с 2004 года. За это время мы собрали команду,
            которой доверяют, и продолжаем держать высокую планку во всём, что
            касается красоты и заботы о госте.
          </p>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-deep/65 md:mx-0">
            Светлана лично следит за качеством: за уровнем услуг, за косметикой и
            материалами, которые мы используем и продаём, и за работой каждого
            мастера. Ничего случайного — только проверенные продукты и
            специалисты.
          </p>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-deep/65 md:mx-0">
            Она всегда на связи и быстро реагирует на каждый отзыв — и тёплые
            слова, и замечания помогают нам становиться лучше.
          </p>
        </div>

        {/* Портрет 4:5 (или подложка с инициалами, пока нет фото). */}
        <div className="order-1 mx-auto w-full max-w-sm md:order-2 md:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-surface shadow-[0_30px_70px_-32px_var(--brand-900)] ring-1 ring-ink-deep/5">
            {PHOTO ? (
              <Image
                src={PHOTO}
                alt="Светлана Шатаева — генеральный директор Shati Studio"
                fill
                sizes="(max-width: 768px) 384px, 600px"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-surface-accent">
                <span
                  aria-hidden="true"
                  className="font-display text-7xl font-medium text-brand-400 sm:text-8xl"
                >
                  СШ
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
