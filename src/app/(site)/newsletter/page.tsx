import type { Metadata } from "next";
import { Mail, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/home/newsletter-section";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE.name} Newsletter`,
  description: "Get important ground reports, interviews and public-interest stories directly in your inbox.",
};

const BENEFITS = [
  "One curated email a day — no spam, no clickbait",
  "Ground reports and investigations before they trend",
  "Early notice for new podcast episodes and interviews",
  "Unsubscribe anytime with one click",
];

export default function NewsletterPage() {
  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-lg text-center">
        <Mail size={36} className="mx-auto text-brand" />
        <span className="mt-3 block text-xs font-bold uppercase tracking-widest text-brand">
          {SITE.name} Newsletter
        </span>
        <h1 className="mt-1 font-serif text-3xl font-extrabold sm:text-4xl">
          Get important stories directly in your inbox.
        </h1>
        <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-muted">
          {BENEFITS.map((b) => (
            <li key={b} className="flex gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand" /> {b}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <NewsletterForm />
        </div>
      </Container>
    </div>
  );
}
