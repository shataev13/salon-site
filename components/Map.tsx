/* Карта Яндекс с меткой салона. */
export default function Map() {
  return (
    <section id="contacts" className="bg-surface-warm py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-6">
        <header className="flex flex-col items-center text-center">
          <span
            aria-hidden="true"
            className="mb-6 h-0.5 w-10 rounded-full bg-accent"
          />
          <h2 className="font-display text-5xl font-medium text-ink-deep sm:text-6xl">
            Как нас найти
          </h2>
          <p className="mt-4 text-sm tracking-wide text-ink-deep/50">
            Москва · 4-й Ростовский переулок, 2с2
          </p>
        </header>

        <div className="mt-10 overflow-hidden rounded-[20px] shadow-[0_24px_60px_-30px_var(--brand-900)] ring-1 ring-ink-deep/10 sm:mt-14">
          <iframe
            src="https://yandex.ru/map-widget/v1/?z=16&ol=biz&oid=1054105398"
            title="Shati Studio на карте"
            loading="lazy"
            allowFullScreen
            className="block h-[400px] w-full border-0 sm:h-[480px]"
          />
        </div>
      </div>
    </section>
  );
}
