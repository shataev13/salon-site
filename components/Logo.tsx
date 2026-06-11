"use client";

import { useState } from "react";
import Image from "next/image";

/* Логотип Shati Studio.
   Использует /public/logo.png; пока файла нет — показывает временный
   вордмарк скрипт-шрифтом. Как только logo.png появится в репозитории,
   оригинал подхватится автоматически, без правок кода. */
export default function Logo({
  imgClassName = "h-9 w-auto",
  textClassName = "text-3xl",
}: {
  imgClassName?: string;
  textClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`font-script leading-none text-brand-500 ${textClassName}`}
      >
        Shati Studio
      </span>
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="Shati Studio"
      width={240}
      height={64}
      priority
      onError={() => setFailed(true)}
      className={imgClassName}
    />
  );
}
