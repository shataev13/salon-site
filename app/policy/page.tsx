import type { Metadata } from "next";
import { BookingProvider } from "@/components/booking/BookingProvider";
import Header from "@/components/Header";
import LegalDocument from "@/components/LegalDocument";
import { getServices } from "@/lib/sheet";
import doc from "@/content/legal/policy.json";

export const metadata: Metadata = { title: `${doc.title} — Shati Studio` };

export default async function PolicyPage() {
  const services = await getServices();
  return (
    <BookingProvider>
      <Header variant="solid" services={services} />
      <LegalDocument title={doc.title} updated={doc.updated} blocks={doc.blocks} />
    </BookingProvider>
  );
}
