import BookingButton from "./booking/BookingButton";
import HeroVideo from "./HeroVideo";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Фон: градиентный фолбэк → видео → затемнение для читаемости. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="u-kenburns absolute inset-0 bg-ink bg-[radial-gradient(120%_120%_at_15%_8%,var(--brand-700)_0%,transparent_46%),radial-gradient(130%_120%_at_88%_92%,var(--brand-800)_0%,transparent_52%)]" />
        <HeroVideo />
        {/* Затемнение: равномерное + вертикальный градиент под хедер и низ. */}
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/75" />
      </div>

      {/* Контент: кикер, короткий заголовок, одно главное действие. */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="u-reveal u-reveal--d1 text-[11px] font-medium uppercase tracking-[0.28em] text-brand-100 sm:text-xs">
          Салон красоты в центре Москвы · с 2009
        </p>

        <h1 className="u-reveal u-reveal--d2 mt-6 max-w-3xl font-display text-5xl font-medium leading-[1.04] text-white sm:text-6xl lg:text-7xl">
          Красота в <span className="text-brand-300">деталях</span>
        </h1>

        <div className="u-reveal u-reveal--d3 mt-10">
          <BookingButton size="lg" />
        </div>
      </div>

      {/* «Световой штрих» — фирменная деталь и подсказка к скроллу. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="relative h-16 w-px">
          <span className="u-lightline absolute inset-0 block bg-gradient-to-b from-transparent via-brand-300 to-brand-400" />
          <span className="u-lightdot absolute bottom-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-brand-200 shadow-[0_0_14px_3px_var(--brand-400)]" />
        </div>
      </div>
    </section>
  );
}
