import Image from "next/image";
import AboutGallery, { type GalleryPhoto } from "./AboutGallery";

/* Фото интерьера салона для карусели. */
const ABOUT_GALLERY: GalleryPhoto[] = [
  { src: "/about/reception.jpg", alt: "Ресепшн Shati Studio" },
  { src: "/about/hall.jpg", alt: "Зона ожидания Shati Studio" },
  { src: "/about/hair-1.jpg", alt: "Парикмахерский зал Shati Studio" },
  { src: "/about/nails.jpg", alt: "Зона маникюра Shati Studio" },
  { src: "/about/cosmetology.jpg", alt: "Кабинет косметологии Shati Studio" },
];

export default function About() {
  return (
    <section id="about" className="bg-background py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Главное фото — фасад салона. */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[24px] shadow-[0_30px_70px_-32px_var(--brand-900)] ring-1 ring-ink-deep/5">
          <Image
            src="/about/facade.webp"
            alt="Фасад салона красоты Shati Studio в центре Москвы"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
        </div>

        {/* Текст о салоне. */}
        <div className="text-center md:text-left">
          <span
            aria-hidden="true"
            className="mx-auto mb-6 block h-0.5 w-10 rounded-full bg-accent md:mx-0"
          />
          <h2 className="font-display text-5xl font-medium text-ink-deep sm:text-6xl">
            О салоне
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-deep/70 sm:text-lg md:mx-0">
            Shati Studio — салон красоты в самом сердце Москвы. Мы работаем с
            2004 года и за это время собрали команду мастеров, которым доверяют.
          </p>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-deep/65 md:mx-0">
            Парикмахерское искусство и сложное окрашивание, ногтевой сервис,
            косметология и массаж — всё в одном месте. Работаем на премиальных
            материалах (THALION, Sothys, Lebel, Eclado) и подбираем уход под
            каждого гостя.
          </p>
          <p className="mx-auto mt-6 max-w-md text-sm font-medium uppercase tracking-[0.12em] text-accent md:mx-0">
            Москва · 4-й Ростовский переулок, 2с2
          </p>
        </div>
      </div>

      {/* Карусель фотографий салона (появится, когда добавим фото интерьера). */}
      {ABOUT_GALLERY.length > 0 && <AboutGallery photos={ABOUT_GALLERY} />}
    </section>
  );
}
