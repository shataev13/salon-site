import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

// Заголовочный (акцентный) шрифт — заголовки секций и хедера. Локальный
// файл, начертание одно (Regular), поэтому weight задаём явно.
const nuqun = localFont({
  src: "./fonts/Nuqun-Regular.otf",
  variable: "--font-nuqun",
  weight: "400",
  display: "swap",
});

// Основной текстовый шрифт (body / интерфейс / текст под заголовками).
const interTight = localFont({
  src: "./fonts/InterTight-Light.ttf",
  variable: "--font-inter-tight",
  weight: "300",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shati Studio — салон красоты в центре Москвы",
  description:
    "Премиальный салон красоты Shati Studio в центре Москвы. С 2004 года — парикмахерское искусство, окрашивание, маникюр, уход и косметология. Онлайн-запись.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${nuqun.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
