import { cache } from "react";
import { SERVICES as DEFAULT_SERVICES, type Service } from "./site";
import {
  PRICE_CATEGORIES as DEFAULT_PRICE_CATEGORIES,
  type PriceCategory,
  type PriceGroup,
  type PriceItem,
} from "./pricing";

/* =========================================================================
   Управление прайсом/услугами через Google Таблицу.

   Если задан GOOGLE_SHEET_ID — данные берутся из таблицы (две вкладки:
   «Услуги» и «Прайс»). Если переменная не задана или таблица недоступна —
   используются данные из кода (DEFAULT_*), сайт продолжает работать.

   Таблица должна быть открыта на чтение («Доступ по ссылке → Читатель»).
   ========================================================================= */

const SHEET_ID = process.env.GOOGLE_SHEET_ID?.trim();
const SERVICES_TAB = process.env.GOOGLE_SHEET_SERVICES_TAB?.trim() || "Услуги";
const PRICES_TAB = process.env.GOOGLE_SHEET_PRICES_TAB?.trim() || "Прайс";
// Прямые CSV-ссылки (для «Опубликовать в интернете») — альтернатива ID.
const SERVICES_URL = process.env.GOOGLE_SHEET_SERVICES_URL?.trim();
const PRICES_URL = process.env.GOOGLE_SHEET_PRICES_URL?.trim();
// Как часто перечитывать таблицу (сек). 0 = всегда свежее.
const REVALIDATE = Number(process.env.GOOGLE_SHEET_REVALIDATE ?? 300);

const CONFIGURED = Boolean(SHEET_ID || SERVICES_URL || PRICES_URL);

const NO_PRICE_NOTE = "Актуальную стоимость уточняйте у администратора.";

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

function tabUrl(tab: string, direct?: string): string | null {
  if (direct) return direct;
  if (!SHEET_ID) return null;
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    tab,
  )}`;
}

/** Загружает вкладку таблицы как CSV. null — если не настроено/ошибка. */
async function fetchTab(tab: string, direct?: string): Promise<Row[] | null> {
  const url = tabUrl(tab, direct);
  if (!url) return null;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    const text = await res.text();
    // Закрытая таблица отдаёт HTML — это не наши данные.
    if (text.trimStart().startsWith("<")) return null;
    return toRows(parseCsv(text));
  } catch {
    return null;
  }
}

/** Услуги (карточки/страницы/порядок). Из таблицы или из кода. */
export const getServices = cache(async (): Promise<Service[]> => {
  const rows = await fetchTab(SERVICES_TAB, SERVICES_URL);
  if (!rows) return DEFAULT_SERVICES;

  const services = rows
    .map((row, i): Service | null => {
      const slug = pick(row, "slug", "слаг");
      const title = pick(row, "название", "услуга", "title", "name");
      if (!slug || !title) return null;
      return {
        slug,
        title,
        description: pick(row, "описание", "description"),
        placeholder: `u-ph-${(i % 4) + 1}`,
      };
    })
    .filter((s): s is Service => s !== null);

  return services.length > 0 ? services : DEFAULT_SERVICES;
});

/** Прайс по услугам. Категории строятся в порядке услуг. */
export const getPriceCategories = cache(async (): Promise<PriceCategory[]> => {
  if (!CONFIGURED) return DEFAULT_PRICE_CATEGORIES;

  const services = await getServices();
  const rows = (await fetchTab(PRICES_TAB, PRICES_URL)) ?? [];

  // slug → (название группы → позиции). Map сохраняет порядок появления.
  const bySlug = new Map<string, Map<string, PriceItem[]>>();
  for (const row of rows) {
    const slug = pick(row, "slug", "слаг");
    const name = pick(row, "название", "услуга", "name");
    const price = pick(row, "цена", "price");
    if (!slug || !name) continue;

    const group = pick(row, "группа", "group");
    const note = pick(row, "примечание", "note") || undefined;
    if (!bySlug.has(slug)) bySlug.set(slug, new Map());
    const groups = bySlug.get(slug)!;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push({ name, price, note });
  }

  return services.map((service): PriceCategory => {
    const groupsMap = bySlug.get(service.slug);
    const groups: PriceGroup[] = groupsMap
      ? [...groupsMap.entries()].map(([title, items]) => ({
          title: title || undefined,
          items,
        }))
      : [];
    return {
      id: service.slug,
      title: service.title,
      intro: service.description,
      placeholder: service.placeholder,
      groups,
      note: groups.length === 0 ? NO_PRICE_NOTE : undefined,
    };
  });
});
