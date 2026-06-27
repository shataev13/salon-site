import { cache } from "react";
import { SERVICES as DEFAULT_SERVICES, type Service } from "./site";
import {
  PRICE_CATEGORIES as DEFAULT_PRICE_CATEGORIES,
  type PriceCategory,
} from "./pricing";
import {
  buildPriceCategories,
  parseCsv,
  toRows,
  type Row,
} from "./price-build";

/* =========================================================================
   Прайс из Google Таблицы (экспорт каталога Яндекс.Бизнес — один лист).

   Колонки листа: «Категория», «Название», «Цена», «Описание» (+ прочие).
   17 категорий таблицы раскладываются по 4 разделам сайта (см. SECTION_SOURCE
   в lib/price-build.ts).

   По умолчанию используется таблица салона (ID/он же gid ниже). Чтобы это
   работало вживую, таблица должна быть открыта на чтение:
   «Поделиться → Доступ по ссылке → Читатель».
   Если таблица недоступна (закрыта/нет сети) — сайт берёт данные из кода
   (DEFAULT_PRICE_CATEGORIES), поэтому всегда продолжает работать.

   Переопределить можно переменными окружения:
     GOOGLE_SHEET_ID, GOOGLE_SHEET_GID            — ID таблицы и gid листа;
     GOOGLE_SHEET_PRICES_URL                       — прямая CSV-ссылка;
     GOOGLE_SHEET_REVALIDATE                        — период перечитывания, сек.
   ========================================================================= */

const SHEET_ID = (
  process.env.GOOGLE_SHEET_ID ?? "1_Rcd5Md8KeO8Tufluf_YZVnb6iwV_11lPYBxTRXc14Y"
).trim();
const SHEET_GID = (process.env.GOOGLE_SHEET_GID ?? "133399415").trim();
const PRICES_URL = process.env.GOOGLE_SHEET_PRICES_URL?.trim();

const REVALIDATE = (() => {
  const n = Number(process.env.GOOGLE_SHEET_REVALIDATE);
  return Number.isFinite(n) && n >= 0 ? n : 300;
})();

const csvUrl = (): string | null => {
  if (PRICES_URL) return PRICES_URL;
  if (!SHEET_ID) return null;
  const base = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
  return SHEET_GID ? `${base}&gid=${encodeURIComponent(SHEET_GID)}` : base;
};

/** Загружает лист таблицы как CSV. null — если не настроено/недоступно. */
async function fetchPriceRows(): Promise<Row[] | null> {
  const url = csvUrl();
  if (!url) return null;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    const text = await res.text();
    // Закрытая таблица отдаёт HTML (страница входа) — это не наши данные.
    if (text.trimStart().startsWith("<")) return null;
    return toRows(parseCsv(text));
  } catch {
    return null;
  }
}

/** Услуги (4 раздела) — фиксированы в коде: у них слаги, фото и описания. */
export const getServices = cache(async (): Promise<Service[]> => {
  return DEFAULT_SERVICES;
});

/** Прайс по разделам. Из Google Таблицы, иначе — из кода. */
export const getPriceCategories = cache(async (): Promise<PriceCategory[]> => {
  const rows = await fetchPriceRows();
  if (!rows || rows.length === 0) return DEFAULT_PRICE_CATEGORIES;

  const built = buildPriceCategories(rows);
  // Если из таблицы ничего не разложилось (другой формат) — данные из кода.
  const hasAny = built.some((category) => category.groups.length > 0);
  return hasAny ? built : DEFAULT_PRICE_CATEGORIES;
});
