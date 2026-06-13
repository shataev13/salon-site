import { BookingProvider } from "@/components/booking/BookingProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Materials from "@/components/Materials";

export default function Home() {
  return (
    <BookingProvider>
      <div className="relative">
        <Header />
        <Hero />
      </div>
      <Services />
      <Team />
      <Materials />
    </BookingProvider>
  );
}
