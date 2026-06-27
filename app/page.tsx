import { BookingProvider } from "@/components/booking/BookingProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import GiftCard from "@/components/GiftCard";
import Team from "@/components/Team";
import Materials from "@/components/Materials";
import { getServices } from "@/lib/sheet";

export default async function Home() {
  const services = await getServices();
  return (
    <BookingProvider>
      <div className="relative">
        <Header services={services} />
        <Hero />
      </div>
      <Services />
      <GiftCard />
      <Team />
      <Materials />
    </BookingProvider>
  );
}
