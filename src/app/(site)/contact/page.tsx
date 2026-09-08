import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Megaphone,
  Mic,
  Briefcase,
  Newspaper,
  ExternalLink,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { MapEmbed } from "@/components/article/map-embed";
import { ContactForm } from "@/components/contact/contact-form";
import { CorrectionForm } from "@/components/contact/correction-form";
import { FollowSection } from "@/components/home/follow-section";
import { SITE, DEPARTMENTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have a story, news tip, interview request, feedback, or business enquiry? Get in touch with The Top Interview.",
};

const ENQUIRY_CARDS = [
  {
    icon: Newspaper,
    title: "News & Editorial",
    body: "For news tips, story ideas, editorial enquiries, and corrections.",
    department: "News Tip",
  },
  {
    icon: Mic,
    title: "Interview & Podcast",
    body: "For interview requests, podcast invitations, guest proposals, and collaborations.",
    department: "Podcast",
  },
  {
    icon: Megaphone,
    title: "Advertising & Partnership",
    body: "For advertising, sponsorships, partnerships, and commercial enquiries.",
    department: "Advertising",
  },
  {
    icon: Briefcase,
    title: "Careers",
    body: "For jobs, internships, freelance reporting, and media opportunities.",
    department: "Careers",
  },
];

const FAQ_ITEMS = [
  {
    question: "How can I submit a news tip?",
    answer: "Use the “Send News Tip” button on this page or visit our Public Voice page to share a local issue, breaking news, or photos and videos from the ground. Every tip is reviewed by our editorial team before publication.",
  },
  {
    question: "How can I request an interview?",
    answer: "Select “Interview Request” as the enquiry type in the contact form below, or write to us via the Interview & Podcast card, with a short note on who you'd like to speak to and why.",
  },
  {
    question: "Can I appear on The Top Interview Podcast?",
    answer: "Yes — select “Podcast” as the enquiry type in the contact form and share a short pitch about yourself or the topic you'd like to discuss. Our podcast team reviews every proposal.",
  },
  {
    question: "How can I advertise with The Top Interview?",
    answer: "Select “Advertising” as the enquiry type, or reach out via the Advertising & Partnership card, and our commercial team will get back to you with formats and rates.",
  },
  {
    question: "How can I report an error in a story?",
    answer: "Use the “Report an Error” section below with the article URL and details of the correction, or select “Correction” as the enquiry type in the contact form.",
  },
  {
    question: "How can I apply for a job or internship?",
    answer: "Select “Careers” as the enquiry type in the contact form, or reach out via the Careers card with your résumé and area of interest.",
  },
];

export default function ContactPage() {
  return (
    <div className="py-8 sm:py-10">
      <Container className="max-w-3xl text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">Get In Touch</span>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">Contact The Top Interview</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Have a story, news tip, interview request, feedback, or business enquiry? Get in touch with us.
        </p>
      </Container>

      <Container className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENQUIRY_CARDS.map((c) => (
            <Link
              key={c.title}
              href={`/contact?department=${encodeURIComponent(c.department)}#contact-form`}
              className="group rounded-lg border border-border p-5 transition hover:border-brand hover:shadow-md"
            >
              <c.icon size={22} className="text-brand" />
              <h3 className="mt-3 font-serif text-base font-bold">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{c.body}</p>
            </Link>
          ))}
        </div>
      </Container>

      <Container id="contact-form" className="mt-14 scroll-mt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold">Send Us A Message</h2>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
          <div className="space-y-6">
            <div className="space-y-3 rounded-lg border border-border bg-surface-muted p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand">{SITE.name}</p>
              <p className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand" /> {SITE.address}
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
              <p className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-brand" /> {SITE.workingHours}
              </p>
            </div>

            <div className="rounded-lg border border-brand/30 bg-brand/5 p-5">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand">
                <Megaphone size={16} /> Have A News Tip?
              </p>
              <p className="mt-2 text-sm text-muted">
                If you have information about an important issue, event, or story happening in your area, let our
                team know. All submitted news tips go through editorial moderation before publication.
              </p>
              <Link
                href="/public-voice"
                className="mt-3 inline-flex items-center gap-2 rounded-sm bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark"
              >
                📢 Send News Tip
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <Container className="mt-14">
        <SectionHeading eyebrow="Location" title="Find Us" />
        <MapEmbed query={SITE.address} />
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline"
        >
          Get Directions <ExternalLink size={14} />
        </a>
      </Container>

      <Container className="mt-14">
        <SectionHeading eyebrow="Departments" title="Department Contacts" subtitle="Reach the right team directly — every enquiry is routed to the relevant department." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map((d) => (
            <div key={d.key} className="flex flex-col justify-between rounded-lg border border-border p-5">
              <div>
                <h3 className="font-serif text-base font-bold">{d.label}</h3>
                <p className="mt-1.5 text-sm text-muted">{d.description}</p>
              </div>
              <Link
                href={`/contact?department=${encodeURIComponent(d.department)}#contact-form`}
                className="mt-4 text-sm font-bold text-brand hover:underline"
              >
                Contact this team →
              </Link>
            </div>
          ))}
        </div>
      </Container>

      <FollowSection />

      <Container className="mt-4">
        <div className="rounded-lg border border-border bg-surface-muted p-6 sm:p-8">
          <h2 className="mb-1 font-serif text-xl font-bold">Report An Error</h2>
          <p className="mb-5 text-sm text-muted">
            If you believe any published information is inaccurate or requires correction, please contact our
            editorial team.
          </p>
          <CorrectionForm />
        </div>
      </Container>

      <Container className="mt-14 max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
        <FaqAccordion items={FAQ_ITEMS} />
      </Container>

      <section className="mt-16 bg-brand text-white">
        <Container className="flex flex-col items-center gap-4 py-12 text-center sm:py-14">
          <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">Your Story Matters.</h2>
          <p className="max-w-xl text-white/85">Have something important to share with us?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/public-voice"
              className="rounded-sm bg-charcoal px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-black"
            >
              Send News Tip
            </Link>
            <Link
              href="#contact-form"
              className="rounded-sm border-2 border-white px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-white hover:text-brand"
            >
              Contact Our Team
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
