import type { CSSProperties } from "react";

/* Логотип Shati Studio.
   Форма берётся из /ShatiStudio_logo.webp (прозрачный фон = силуэт надписи)
   и заливается фирменным градиентом «розовое золото» через CSS-маску — так
   логотип всегда в фирменном цвете, без отдельного перекрашенного файла. */
const maskStyle: CSSProperties = {
  aspectRatio: "1866 / 433",
  WebkitMaskImage: "url(/ShatiStudio_logo.webp)",
  maskImage: "url(/ShatiStudio_logo.webp)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

export default function Logo({
  imgClassName = "h-9 w-auto",
}: {
  imgClassName?: string;
  /* Не используется (логотип теперь не текстовый); оставлен для совместимости. */
  textClassName?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Shati Studio"
      style={maskStyle}
      className={`inline-block shrink-0 bg-[image:var(--brand-gradient)] ${imgClassName}`}
    />
  );
}
