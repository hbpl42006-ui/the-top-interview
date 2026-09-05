import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Target, ShieldCheck, Eye, Users2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getAllReporters } from "@/lib/data/reporters";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: "Who We Are, Our Mission, Our Journalism and Editorial Values at The Top Interview.",
};

export default async function AboutPage() {
  const reporters = await getAllReporters();
  return (
    <div className="py-10 sm:py-14">
      <Container className="max-w-4xl">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">About Us</span>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">Who We Are</h1>
        <p className="mt-4 text-lg text-muted">
          {SITE.name} is a ground-reporting and interview-based news organisation. We don&apos;t wait for press
          releases — our reporters travel to villages, district towns and city neighbourhoods to meet people,
          record their voices, and verify what is actually happening before we publish.
        </p>

        <div className="my-10 rounded-lg border-l-4 border-brand bg-surface-muted p-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
            <Target size={14} /> Our Mission
          </p>
          <p className="mt-2 font-serif text-xl font-semibold leading-snug">{SITE.mission}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <ValueCard
            icon={MapPin}
            title="Ground Reporting"
            body="Every major story begins on location. Our reporters meet residents, officials and eyewitnesses directly, recording interviews rather than relying on secondhand accounts."
          />
          <ValueCard
            icon={ShieldCheck}
            title="Editorial Values"
            body="We separate news from opinion, label sponsored content clearly, correct errors publicly, and give a right to reply to anyone named in our reporting."
          />
          <ValueCard
            icon={Eye}
            title="Our Journalism"
            body="From daily news to multi-month special reports, we prioritise verified, on-record information over speed for its own sake."
          />
          <ValueCard
            icon={Users2}
            title="Our Vision"
            body="A media organisation where ordinary people — farmers, students, shopkeepers, workers — get the same voice and scrutiny as public figures."
          />
        </div>

        <div className="mt-14">
          <h2 id="team" className="mb-6 font-serif text-2xl font-bold">Our Team</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {reporters.map((r) => (
              <Link key={r.slug} href={`/reporter/${r.slug}`} className="group text-center">
                <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-transparent transition group-hover:border-brand">
                  <Image src={r.photo} alt={r.name} fill className="object-cover" sizes="80px" />
                </div>
                <p className="mt-2 text-sm font-bold transition group-hover:text-brand">{r.name}</p>
                <p className="text-xs text-muted">{r.designation}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-lg border border-border bg-surface-muted p-6">
          <h2 className="mb-2 font-serif text-xl font-bold">Contact Our Editorial Team</h2>
          <p className="text-sm text-muted">
            For corrections, tips, or editorial queries, write to{" "}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-brand hover:underline">
              {SITE.email}
            </a>{" "}
            or visit our <Link href="/contact" className="font-semibold text-brand hover:underline">Contact page</Link>.
          </p>
        </div>
      </Container>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border p-5">
      <Icon size={22} />
      <h3 className="mt-3 font-serif text-lg font-bold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{body}</p>
    </div>
  );
}
