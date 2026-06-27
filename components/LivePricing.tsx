"use client";

import { useEffect, useState } from "react";
import ServicePricing from "./ServicePricing";
import { type PriceCategory } from "@/lib/pricing";
import { buildCategoriesFromCsv } from "@/lib/price-build";

/* Прайс конкретного раздела. Изначально показываем цены, заложенные при
   сборке (мгновенно и работает всегда), а затем в браузере подтягиваем
   актуальные из Google Таблицы через PHP-прокси /prices.php. Так на
   статическом хостинге (reg.ru) цены остаются «живыми»: правка в таблице
   появляется на сайте без пересборки. Если прокси недоступен — остаются
   зашитые цены. */
export default function LivePricing({
  category,
  slug,
}: {
  category: PriceCategory;
  slug: string;
}) {
  const [current, setCurrent] = useState(category);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/prices.php", { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((csv) => {
        const fresh = buildCategoriesFromCsv(csv).find((c) => c.id === slug);
        if (fresh && fresh.groups.length > 0) setCurrent(fresh);
      })
      .catch(() => {
        /* нет сети/прокси — оставляем цены, заложенные при сборке */
      });
    return () => controller.abort();
  }, [slug]);

  return <ServicePricing category={current} />;
}
