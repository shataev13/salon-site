import BookingButton from "./booking/BookingButton";
import HeroVideo from "./HeroVideo";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col items-center justify-end overflow-hidden px-6 pb-16 text-center sm:pb-24"
    >
      {/* Фон: градиентный фолбэк → видео → затемнение для читаемости. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="u-kenburns absolute inset-0 bg-ink bg-[radial-gradient(120%_120%_at_15%_8%,var(--brand-700)_0%,transparent_46%),radial-gradient(130%_120%_at_88%_92%,var(--brand-800)_0%,transparent_52%)]" />
        <HeroVideo />
        {/* Затемнение: равномерное + усиленное к низу, где лежит текст. */}
        <div className="absolute inset-0 bg-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/85" />
      </div>

      {/* Контент в нижней части экрана: кикер, короткий заголовок, действие. */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="u-reveal u-reveal--d1 text-[11px] font-medium uppercase tracking-[0.28em] text-brand-100 sm:text-xs">
          Салон красоты в центре Москвы · с 2009
        </p>

        <h1 className="u-reveal u-reveal--d2 mt-5 max-w-2xl font-display text-3xl font-medium leading-[1.1] text-white sm:text-4xl lg:text-5xl">
          Красота в <span className="text-brand-300">деталях</span>
        </h1>

        <div className="u-reveal u-reveal--d3 mt-8">
          <BookingButton size="lg" />
        </div>
      </div>
    </section>
  );
}
