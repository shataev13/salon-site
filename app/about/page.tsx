import type { Metadata } from "next";
import { BookingProvider } from "@/components/booking/BookingProvider";
import Header from "@/components/Header";
import About from "@/components/About";
import { getServices } from "@/lib/sheet";

export const metadata: Metadata = {
  title: "О салоне — Shati Studio",
  description:
    "Shati Studio — салон красоты в центре Москвы с 2004 года: парикмахерский зал, ногтевой сервис, косметология и массаж. 4-й Ростовский переулок, 2с2.",
};

export default async function AboutPage() {
  const services = await getServices();

  return (
    <BookingProvider>
      <Header variant="solid" services={services} />
      <main>
        <About />
      </main>
    </BookingProvider>
  );
}
