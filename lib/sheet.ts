import { cache } from "react";
import { SERVICES as DEFAULT_SERVICES, type Service } from "./site";
import {
  PRICE_CATEGORIES as DEFAULT_PRICE_CATEGORIES,
  type PriceCategory,
  type PriceGroup,
  type PriceItem,
} from "./pricing";

/* =========================================================================
   Прайс из Google Таблицы (экспорт каталога Яндекс.Бизнес — один лист).

   Колонки листа: «Категория», «Название», «Цена», «Описание» (+ прочие).
   17 категорий таблицы раскладываются по 4 разделам сайта (см. SECTION_SOURCE).

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

/* Какие категории таблицы попадают в каждый раздел сайта (порядок = порядок
   групп на странице). flat — показать одним списком без подзаголовков. */
const SECTION_SOURCE: Record<string, { flat?: boolean; categories: string[] }> =
  {
    hair: {
      categories: [
        "Стрижки и укладки",
        "Окрашивание волос",
        "Уходы и лечение волос (Lebel)",
      ],
    },
    nails: { flat: true, categories: ["Ногтевой сервис"] },
    cosmetology: {
      categories: [
        "Уходы для лица",
        "Пилинги",
        "Аппаратная косметология (Biogenie)",
        "Массаж лица",
        "Брови и ресницы",
        "Перманентный макияж",
        "Макияж",
        "Депиляция воском (LYCON)",
        "Депиляция сахаром (шугаринг)",
      ],
    },
    "massage-spa": {
      categories: [
        "Массаж тела",
        "Талассо-массаж и коррекция тела (THALION)",
        "Обёртывания THALION",
        "Метод AROSHA (коррекция фигуры)",
      ],
    },
  };

/** Минимальный CSV-парсер (кавычки, запятые и переносы строк внутри полей). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

type Row = Record<string, string>;

/** Превращает строки CSV в записи по заголовку (нижний регистр ключей). */
function toRows(table: string[][]): Row[] {
  if (table.length < 2) return [];
  const header = table[0].map((h) => h.trim().toLowerCase());
  return table.slice(1).map((cells) => {
    const row: Row = {};
    header.forEach((key, i) => {
      row[key] = (cells[i] ?? "").trim();
    });
    return row;
  });
}

/** Достаёт значение по первому из возможных названий колонки. */
function pick(row: Row, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key.toLowerCase()];
    if (value) return value;
  }
  return "";
}

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Цена как «4 000 ₽». Нечисловое значение оставляем как есть. */
function formatPrice(raw: string): string {
  const match = raw.replace(/\s/g, "").replace(",", ".").match(/\d+(\.\d+)?/);
  if (!match) return clean(raw) || "по запросу";
  const n = Math.round(Number(match[0]));
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

/** Убираем повторяющиеся примечания: оставляем только уникальные в группе. */
function keepUniqueNotes(items: PriceItem[]): PriceItem[] {
  const freq = new Map<string, number>();
  for (const it of items) {
    if (it.note) freq.set(it.note, (freq.get(it.note) ?? 0) + 1);
  }
  return items.map((it) =>
    it.note && freq.get(it.note) === 1
      ? it
      : { name: it.name, price: it.price },
  );
}

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

/** Раскладывает строки таблицы по 4 разделам сайта. */
function buildPriceCategories(rows: Row[]): PriceCategory[] {
  // Категория (нижний регистр) → позиции, в порядке появления в таблице.
  const byCategory = new Map<string, PriceItem[]>();
  for (const row of rows) {
    const category = pick(row, "категория", "category");
    const name = clean(pick(row, "название", "услуга", "name", "title"));
    if (!category || !name) continue;
    const key = category.trim().toLowerCase();
    const price = formatPrice(pick(row, "цена", "price"));
    const note = clean(pick(row, "описание", "description")) || undefined;
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push({ name, price, note });
  }

  const itemsOf = (category: string) =>
    keepUniqueNotes(byCategory.get(category.toLowerCase()) ?? []);

  // Берём метаданные разделов (id/title/intro/placeholder) из кода,
  // а наполнение — из таблицы. Раздел без данных в таблице остаётся как в коде.
  return DEFAULT_PRICE_CATEGORIES.map((base): PriceCategory => {
    const source = SECTION_SOURCE[base.id];
    if (!source) return base;

    let groups: PriceGroup[];
    if (source.flat) {
      const items = source.categories.flatMap(itemsOf);
      groups = items.length > 0 ? [{ items }] : [];
    } else {
      groups = source.categories
        .map((category) => ({ title: category, items: itemsOf(category) }))
        .filter((group) => group.items.length > 0);
    }

    if (groups.length === 0) return base;
    return { ...base, groups, note: undefined };
  });
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
