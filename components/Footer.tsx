import Link from "next/link";
import Logo from "./Logo";
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  PHONES_EXTRA,
  TELEGRAM_HREF,
  WHATSAPP_HREF,
} from "@/lib/site";
import { getServices } from "@/lib/sheet";

const NAV = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/#services" },
  { label: "О салоне", href: "/about" },
  { label: "Наши мастера", href: "/#team" },
  { label: "Материалы", href: "/#materials" },
  { label: "Подарочный сертификат", href: "/gift-cards" },
];

const LEGAL = [
  { label: "Политика конфиденциальности", href: "#" },
  { label: "Договор оферты", href: "#" },
  { label: "Правила посещения", href: "#" },
];

type Social = { name: string; href: string; icon: SocialIcon; meta?: boolean };

const SOCIALS: Social[] = [
  // TODO: заменить на реальные ссылки сообществ салона.
  { name: "ВКонтакте", href: "https://vk.com", icon: "vk" },
  { name: "Instagram", href: "https://instagram.com", icon: "instagram", meta: true },
  { name: "Telegram", href: TELEGRAM_HREF, icon: "telegram" },
  { name: "WhatsApp", href: WHATSAPP_HREF, icon: "whatsapp" },
];

const ADDRESSES = ["Москва, 4-й Ростовский переулок, 2с2"];

type SocialIcon = "vk" | "instagram" | "telegram" | "whatsapp";

function SocialGlyph({ name }: { name: SocialIcon }) {
  const common = { viewBox: "0 0 24 24", className: "size-[18px]", fill: "currentColor", "aria-hidden": true } as const;
  switch (name) {
    case "vk":
      return (
        <svg {...common}>
          <path d="M13.16 17.34c-5.47 0-8.78-3.84-8.92-10.2h2.74c.1 4.67 2.2 6.64 3.84 7.05V7.14h2.6v3.93c1.6-.17 3.29-2.04 3.86-3.93h2.58c-.43 2.32-2.27 4.19-3.58 4.96 1.31.63 3.4 2.26 4.2 5.18h-2.84c-.62-2.02-2.16-3.58-4.22-3.78v3.78z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
        </svg>
      );
    case "telegram":
      return (
        <svg {...common}>
          <path d="M11.94 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.06 0zm4.96 7.22c.1 0 .32.03.46.14a.5.5 0 01.17.33c.02.09.04.3.02.47-.18 1.9-.96 6.5-1.36 8.63-.17.9-.5 1.2-.82 1.23-.7.06-1.22-.46-1.9-.9-1.06-.7-1.65-1.13-2.68-1.8-1.18-.78-.41-1.21.26-1.91.18-.18 3.25-2.98 3.31-3.23 0-.03.01-.15-.06-.21-.07-.06-.17-.04-.25-.02-.1.02-1.79 1.14-5.06 3.34-.48.33-.91.49-1.3.48-.43-.01-1.25-.24-1.87-.44-.75-.24-1.35-.37-1.3-.79.03-.21.33-.43.9-.66 3.5-1.52 5.83-2.53 7-3.01 3.33-1.39 4.02-1.63 4.48-1.64z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.48-8.42z" />
        </svg>
      );
  }
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-white/85">
      {children}
    </h3>
  );
}

const linkClass =
  "text-sm text-white/50 transition-colors hover:text-brand-300";

export default async function Footer() {
  const services = await getServices();
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1240px] px-6 py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
          {/* Бренд + соцсети. */}
          <div>
            <Link href="/" aria-label="Shati Studio — на главную" className="inline-block">
              <Logo imgClassName="h-9 w-auto" textClassName="text-2xl" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/45">
              Салон красоты в центре Москвы. Премиальный уход и внимание к
              деталям с 2004 года.
            </p>
            <ul className="mt-7 flex flex-wrap items-center gap-3">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={
                      social.meta
                        ? `${social.name} (Meta запрещена в РФ)`
                        : social.name
                    }
                    className="relative grid size-10 place-items-center rounded-full text-white/55 ring-1 ring-white/15 transition-colors hover:text-white hover:ring-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                  >
                    <SocialGlyph name={social.icon} />
                    {social.meta && (
                      <span
                        aria-hidden="true"
                        className="absolute -right-0.5 -top-0.5 text-xs leading-none text-brand-300"
                      >
                        *
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Навигация. */}
          <nav>
            <ColumnTitle>Навигация</ColumnTitle>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Услуги. */}
          <nav>
            <ColumnTitle>Услуги</ColumnTitle>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className={linkClass}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Контакты. */}
          <div>
            <ColumnTitle>Контакты</ColumnTitle>
            {/* Основной номер — выделен; остальные с переадресацией на него. */}
            <a
              href={PHONE_HREF}
              className="mt-5 inline-block text-xl font-semibold text-white transition-colors hover:text-brand-300"
            >
              {PHONE_DISPLAY}
            </a>
            <ul className="mt-2 space-y-1">
              {PHONES_EXTRA.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="text-sm text-white/50 transition-colors hover:text-brand-300"
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              {ADDRESSES.map((address) => (
                <li key={address} className="flex items-start gap-2.5">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="mt-0.5 size-4 shrink-0 text-brand-300/70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {address}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Нижняя строка: ссылки, пометка про Meta, копирайт. */}
        <div className="mt-14 border-t border-white/10 pt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-xs text-white/50 transition-colors hover:text-brand-300">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 text-xs leading-relaxed text-white/35 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl">
              * Meta (Instagram, Facebook) признана экстремистской организацией
              и запрещена на территории РФ.
            </p>
            {/* TODO: реквизиты ИП / ИНН / ОГРНИП. */}
            <p className="shrink-0">© Shati Studio, 2026. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
