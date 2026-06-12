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

export type Service = {
  title: string;
  /* Короткое описание для выпадающего списка в хедере. */
  description: string;
  /* Класс-плейсхолдер фото для карточки (слот). */
  placeholder: string;
};

/* Единый источник категорий услуг — общий для блока «Услуги» (карточки)
   и выпадающего списка «Услуги» в хедере. */
export const SERVICES: Service[] = [
  { title: "Массаж", description: "Расслабление и уход за телом", placeholder: "u-ph-1" },
  { title: "СПА", description: "Обёртывания и программы для тела", placeholder: "u-ph-2" },
  { title: "Ногтевой сервис", description: "Маникюр, педикюр, покрытие", placeholder: "u-ph-3" },
  { title: "Парикмахерский зал", description: "Стрижки и укладки", placeholder: "u-ph-4" },
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
