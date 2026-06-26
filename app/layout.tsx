import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Pacifico } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Основной текстовый шрифт (body / интерфейс).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Скрипт-шрифт для временного вордмарка, пока нет файла логотипа.
const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
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
      className={`${playfair.variable} ${montserrat.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
