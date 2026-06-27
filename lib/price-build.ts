/* =========================================================================
   Разбор прайса из CSV Google Таблицы и раскладка по разделам сайта.

   Чистые функции без серверных зависимостей — используются и при сборке
   (lib/sheet.ts), и в браузере для «живого» обновления цен (components/
   LivePricing.tsx, данные приходят от PHP-прокси /prices.php).
   ========================================================================= */
import {
  PRICE_CATEGORIES as DEFAULT_PRICE_CATEGORIES,
  type PriceCategory,
  type PriceGroup,
  type PriceItem,
} from "./pricing";

/* Какие категории таблицы попадают в каждый раздел сайта (порядок = порядок
   групп на странице). flat — показать одним списком без подзаголовков. */
export const SECTION_SOURCE: Record<
  string,
  { flat?: boolean; categories: string[] }
> = {
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
export function parseCsv(text: string): string[][] {
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

export type Row = Record<string, string>;

/** Превращает строки CSV в записи по заголовку (нижний регистр ключей). */
export function toRows(table: string[][]): Row[] {
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
export function pick(row: Row, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key.toLowerCase()];
    if (value) return value;
  }
  return "";
}

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Цена как «4 000 ₽». Нечисловое значение оставляем как есть. */
export function formatPrice(raw: string): string {
  const match = raw.replace(/\s/g, "").replace(",", ".").match(/\d+(\.\d+)?/);
  if (!match) return clean(raw) || "по запросу";
  const n = Math.round(Number(match[0]));
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

/** Убираем повторяющиеся примечания: оставляем только уникальные в группе. */
export function keepUniqueNotes(items: PriceItem[]): PriceItem[] {
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

/** Раскладывает строки таблицы по 4 разделам сайта. */
export function buildPriceCategories(rows: Row[]): PriceCategory[] {
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

/** Разбирает CSV-текст таблицы в категории сайта. Пустой/битый CSV → []. */
export function buildCategoriesFromCsv(csv: string): PriceCategory[] {
  if (!csv || csv.trimStart().startsWith("<")) return [];
  const rows = toRows(parseCsv(csv));
  if (rows.length === 0) return [];
  const built = buildPriceCategories(rows);
  return built.some((c) => c.groups.length > 0) ? built : [];
}
