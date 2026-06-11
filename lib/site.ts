/* Общие данные сайта: контакты и структура навигации.
   Держим в одном месте, чтобы хедер, меню и модалка не расходились. */

export const PHONE_DISPLAY = "+7 499 248-22-25";
export const PHONE_HREF = "tel:+74992482225";
export const WHATSAPP_HREF = "https://wa.me/74992482225";
// TODO: заменить на реальный @username студии в Telegram.
export const TELEGRAM_HREF = "https://t.me/shatistudio";

export type Contact = {
  label: string;
  href: string;
  icon: "phone" | "whatsapp" | "telegram";
  /* Внешние мессенджеры открываем в новой вкладке. */
  external?: boolean;
};

/* Быстрая связь иконками в хедере — без текста, действие по клику. */
export const CONTACTS: Contact[] = [
  { label: "Позвонить", href: PHONE_HREF, icon: "phone" },
  { label: "WhatsApp", href: WHATSAPP_HREF, icon: "whatsapp", external: true },
  { label: "Telegram", href: TELEGRAM_HREF, icon: "telegram", external: true },
];

export type ServiceCategory = {
  label: string;
  description: string;
};

/* Категории для выпадающего списка «Услуги». */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { label: "Парикмахерский зал", description: "Стрижки и укладки" },
  { label: "Окрашивание", description: "Сложные техники и тон в тон" },
  { label: "Маникюр и педикюр", description: "Уход и покрытие" },
  { label: "Брови и ресницы", description: "Форма, ламинирование" },
  { label: "Косметология", description: "Лицо и уходовые процедуры" },
  { label: "Макияж", description: "Дневной, вечерний, образ" },
];

export type NavLink = {
  label: string;
  href: string;
  /* Акцентный пункт — «Подарочные карты». */
  accent?: boolean;
  /* Пункт с выпадающим списком категорий. */
  hasMenu?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Услуги", href: "#services", hasMenu: true },
  { label: "О салоне", href: "#about" },
  { label: "Персонал", href: "#team" },
  { label: "Подарочные карты", href: "#gift-cards", accent: true },
];
