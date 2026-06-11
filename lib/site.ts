/* Общие данные сайта: контакты и структура навигации.
   Держим в одном месте, чтобы хедер, меню и модалка не расходились. */

export const PHONE_DISPLAY = "+7 499 248-22-25";
export const PHONE_HREF = "tel:+74992482225";

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
  { label: "Контакты", href: "#contacts" },
];
