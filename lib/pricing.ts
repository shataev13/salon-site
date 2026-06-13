/* Данные раздела «Стоимость услуг».
   Цены — из текста салона. Структура: категория → группы → позиции.
   Фото — слот (placeholder-градиент), заменяется реальным снимком. */

export const LOCATIONS = ["Тверской бульвар", "Щёлковская"] as const;

export type PriceItem = {
  name: string;
  price: string;
  /* Доп. описание под позицией (необязательно). */
  note?: string;
};

export type PriceGroup = {
  title?: string;
  items: PriceItem[];
};

export type PriceCategory = {
  id: string;
  title: string;
  /* Короткий текст рядом с фото при открытии. */
  intro: string;
  /* Класс-плейсхолдер фото (слот). */
  placeholder: string;
  groups: PriceGroup[];
  /* Если цен пока нет — показываем эту заметку вместо списка. */
  note?: string;
};

export const PRICE_CATEGORIES: PriceCategory[] = [
  {
    id: "hair",
    title: "Парикмахерский зал",
    intro:
      "Стрижки и укладки для всей семьи — от классики до сложных вечерних образов.",
    placeholder: "u-ph-1",
    groups: [
      {
        title: "Мужская стрижка",
        items: [
          { name: "Мужская стрижка", price: "3 000 ₽" },
          { name: "Мужская стрижка длинных волос", price: "3 500 ₽" },
          { name: "Спортивная стрижка (под машинку)", price: "2 000 ₽" },
          { name: "Оформление усов и бороды", price: "2 000 ₽" },
        ],
      },
      {
        title: "Женская стрижка / укладка",
        items: [
          { name: "Короткие волосы", price: "4 000 ₽" },
          { name: "Волосы средней длины (до 20 см)", price: "4 000 ₽" },
          { name: "Длинные волосы", price: "4 500 ₽" },
          { name: "Стрижка чёлки", price: "1 500 ₽" },
        ],
      },
      {
        title: "Детская стрижка",
        items: [{ name: "Детская стрижка (1–7 лет)", price: "2 000 ₽" }],
      },
      {
        title: "Укладки",
        items: [
          { name: "Повседневная укладка", price: "2 500 ₽" },
          { name: "Коктейльная укладка (средние / длинные)", price: "4 000 ₽" },
          { name: "Наращённые волосы (средние и длинные)", price: "4 500 ₽" },
        ],
      },
    ],
  },
  {
    id: "nails",
    title: "Ногтевой сервис",
    intro:
      "Маникюр, педикюр, покрытия и уход за ногтями — аккуратно и долговечно.",
    placeholder: "u-ph-2",
    groups: [
      {
        title: "Маникюр",
        items: [
          { name: "Маникюр", price: "2 000 ₽" },
          { name: "Маникюр детский (до 10 лет)", price: "1 000 ₽" },
          { name: "Пилинг", price: "500 ₽" },
          { name: "Покрытие ногтей лаком", price: "800 ₽" },
          { name: "Покрытие лаком с френч-эффектом", price: "1 000 ₽" },
          { name: "Покрытие гелем", price: "2 200 ₽" },
          { name: "Покрытие гелем с френч-эффектом", price: "2 500 ₽" },
          { name: "Покрытие основой", price: "500 ₽" },
          { name: "Придание формы ногтям", price: "500 ₽" },
          { name: "Снятие лака", price: "200 ₽" },
          { name: "Снятие цветного геля", price: "500 ₽" },
          { name: "Наращивание 1 ногтя цветным гелем", price: "500 ₽" },
          { name: "Покрытие 1 ногтя цветным гелем", price: "300 ₽" },
          { name: "Дизайн ногтя (рисунок, страза)", price: "300 ₽" },
        ],
      },
      {
        title: "Педикюр",
        items: [
          { name: "Педикюр", price: "4 000 ₽" },
          { name: "Покрытие ногтей лаком", price: "800 ₽" },
          { name: "Покрытие лаком с френч-эффектом", price: "1 000 ₽" },
          { name: "Покрытие цветным гелем", price: "2 200 ₽" },
          { name: "Покрытие гелем с френч-эффектом", price: "2 500 ₽" },
          { name: "Покрытие основой", price: "500 ₽" },
          { name: "Снятие лака", price: "200 ₽" },
          { name: "Снятие цветного геля", price: "500 ₽" },
          { name: "Дизайн ногтя (рисунок, страза)", price: "300 ₽" },
        ],
      },
    ],
  },
  {
    id: "cosmetology",
    title: "Косметология",
    intro:
      "Уходовые и аппаратные процедуры для лица и кожи — чистки, пилинги, программы по типу кожи.",
    placeholder: "u-ph-3",
    groups: [],
    note: "Актуальную стоимость процедур уточняйте у администратора.",
  },
  {
    id: "massage-spa",
    title: "Массаж / СПА",
    intro:
      "Массаж и программы для тела: антицеллюлитные и уходовые процедуры — метод Arosha с прессотерапией и обёртывания Sothys и THALION (Франция).",
    placeholder: "u-ph-4",
    groups: [
      {
        title: "Массаж",
        items: [
          {
            name: "Все виды массажа",
            price: "по запросу",
            note: "Виды и стоимость массажа уточняйте у администратора.",
          },
        ],
      },
      {
        title: "Метод Arosha + прессотерапия",
        items: [
          { name: "Детокс", price: "8 600 ₽" },
          { name: "Дренаж", price: "8 500 ₽" },
          { name: "Живот", price: "7 200 ₽" },
          { name: "Фиброз", price: "8 600 ₽" },
          { name: "Укрепление", price: "по запросу" },
        ],
      },
      {
        title: "Обёртывание Sothys (Франция)",
        items: [
          { name: "Антицеллюлит", price: "4 500 ₽" },
          { name: "Упругость: грудь, руки", price: "3 600 ₽" },
          { name: "Упругость: нижняя зона", price: "4 100 ₽" },
        ],
      },
      {
        title: "Обёртывание THALION (Франция)",
        items: [
          { name: "Целлюлит-контроль: тело полностью", price: "8 700 ₽" },
          { name: "Целлюлит-контроль: бёдра + живот", price: "7 920 ₽" },
          { name: "Целлюлит-контроль: ноги полностью", price: "7 200 ₽" },
        ],
      },
      {
        title: "VIP",
        items: [
          {
            name: "«Тело и лицо»",
            price: "13 400 ₽",
            note: "Обёртывание всего тела на выбор + уход для лица по типу кожи. При покупке — укладка волос в подарок.",
          },
        ],
      },
    ],
  },
  {
    id: "makeup",
    title: "Макияж",
    intro: "Дневной и вечерний макияж для любого повода.",
    placeholder: "u-ph-1",
    groups: [
      {
        items: [
          { name: "Макияж дневной", price: "4 500 ₽" },
          { name: "Макияж вечерний", price: "5 500 ₽" },
        ],
      },
    ],
  },
];

/* Бренды-материалы салона. logo — путь к логотипу в /public/brands;
   width/height — интринсик-размеры файла (для корректных пропорций). */
export type Brand = { name: string; logo?: string; width?: number; height?: number };

export const BRANDS: Brand[] = [
  { name: "Thalion", logo: "/brands/thalion.png", width: 648, height: 255 },
  { name: "Eclado", logo: "/brands/eclado.png", width: 719, height: 278 },
  { name: "Sothys", logo: "/brands/sothys.png", width: 300, height: 139 },
  { name: "Arosha", logo: "/brands/arosha.png", width: 1063, height: 253 },
  { name: "BeautiX", logo: "/brands/beautix.png", width: 661, height: 377 },
  { name: "Lebel", logo: "/brands/lebel.png", width: 2000, height: 609 },
];
