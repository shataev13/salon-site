/* Общие данные сайта: контакты и структура навигации.
   Держим в одном месте, чтобы хедер, меню и модалка не расходились. */

export const PHONE_DISPLAY = "+7 499 248-22-25";
export const PHONE_HREF = "tel:+74992482225";
export const WHATSAPP_HREF = "https://wa.me/74992482225";
// TODO: заменить на реальный @username студии в Telegram.
export const TELEGRAM_HREF = "https://t.me/shatistudio";

/* Онлайн-запись YClients. По умолчанию — микросайт записи студии; можно
   переопределить переменной окружения NEXT_PUBLIC_BOOKING_URL. */
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || "https://n2279892.yclients.com";

/* Покупка подарочного сертификата (YClients). Включится, когда подключат
   онлайн-оплату — тогда впишите сюда ссылку, и кнопки «Купить» сами начнут
   вести на YClients. Пока пусто — «Купить» ведёт на телефон салона.
   Ссылка на будущее: https://yclients.com/group_loyalty_certificate_types/2001057 */
export const GIFT_CERTIFICATE_URL = "";

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
  /* Слаг для страницы услуги: /services/<slug>. */
  slug: string;
  /* Короткое описание для выпадающего списка в хедере. */
  description: string;
  /* Класс-плейсхолдер фото для карточки (слот) — фолбэк, если нет фото. */
  placeholder: string;
  /* Реальное фото услуги (в /public/services). */
  photo?: string;
};

/* Единый источник категорий услуг — общий для блока «Услуги» (карточки),
   выпадающего списка в хедере и страниц услуг. Порядок — единый по сайту. */
export const SERVICES: Service[] = [
  { title: "Парикмахерский зал", slug: "hair", description: "Стрижки и укладки", placeholder: "u-ph-1", photo: "/services/hair.png" },
  { title: "Ногтевой сервис", slug: "nails", description: "Маникюр, педикюр, покрытие", placeholder: "u-ph-2", photo: "/services/nails.jpg" },
  { title: "Косметология", slug: "cosmetology", description: "Уход за лицом и аппаратные процедуры", placeholder: "u-ph-3", photo: "/services/cosmetology.jpg" },
  { title: "Массаж / СПА", slug: "massage-spa", description: "Массаж, обёртывания и программы для тела", placeholder: "u-ph-4", photo: "/services/massage-spa.jpg" },
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
  { label: "Услуги", href: "/#services", hasMenu: true },
  { label: "О салоне", href: "/#about" },
  { label: "Персонал", href: "/#team" },
  { label: "Подарочный сертификат", href: "/gift-cards", accent: true },
];
