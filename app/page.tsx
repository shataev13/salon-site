import { BookingProvider } from "@/components/booking/BookingProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <BookingProvider>
      <div className="relative">
        <Header />
        <Hero />
      </div>
    </BookingProvider>
  );
}
