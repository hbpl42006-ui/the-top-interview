import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MapEmbed } from "@/components/article/map-embed";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with The Top Interview for news tips, advertising, partnerships and press enquiries.",
};

export default function ContactPage() {
  return (
    <div className="py-8 sm:py-10">
      <Container>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">Contact Us</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Reach out for news tips, advertising, partnerships, press enquiries or general questions.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
          <div className="space-y-6">
            <div className="space-y-3 rounded-lg border border-border bg-surface-muted p-5">
              <p className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-brand" /> {SITE.address}
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-brand" />
                <a href={`mailto:${SITE.email}`} className="hover:text-brand">
                  {SITE.email}
                </a>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-brand" /> {SITE.phone}
              </p>
              <p className="flex items-center gap-2 text-sm">
                <MessageCircle size={16} className="text-brand" /> WhatsApp: {SITE.whatsapp}
              </p>
            </div>
            <MapEmbed query={SITE.address} />
          </div>
        </div>
      </Container>
    </div>
  );
}
