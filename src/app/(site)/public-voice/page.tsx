import type { Metadata } from "next";
import {
  Megaphone,
  Camera,
  MessageSquareWarning,
  ShieldCheck,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { PublicVoiceForm } from "@/components/public-voice/public-voice-form";
import { PublishedPublicVoice } from "@/components/public-voice/published-public-voice";
import { getLocale, getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Public Voice — Send Us News",
  description:
    "Share a news tip, local issue, photo or video with The Top Interview's editorial team.",
  keywords: ["public voice India", "citizen journalism India", "submit news India", "report local issue", "citizen reporter India", "share news tip", "community news India"],
  alternates: { canonical: "/public-voice" },
};

export default async function PublicVoicePage() {
  const dict = getDictionary(await getLocale());
  const d = dict.publicVoicePage;

  return (
    <div className="py-8 sm:py-10">
      <Container className="max-w-3xl">
        <div className="mb-8 text-center">
          <Megaphone
            size={36}
            className="mx-auto text-brand"
          />

          <span className="mt-3 block text-xs font-bold uppercase tracking-widest text-brand">
            {d.eyebrow}
          </span>

          <h1 className="mt-1 font-serif text-3xl font-extrabold sm:text-4xl">
            {d.heading}
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-muted">
            {d.body}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoCard
            icon={MessageSquareWarning}
            title={d.cardTipsTitle}
            body={d.cardTipsBody}
          />

          <InfoCard
            icon={Camera}
            title={d.cardMediaTitle}
            body={d.cardMediaBody}
          />

          <InfoCard
            icon={ShieldCheck}
            title={d.cardReviewTitle}
            body={d.cardReviewBody}
          />
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
          <PublicVoiceForm />
        </div>
      </Container>

      <Container className="mt-14 max-w-5xl">
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
            From The Community
          </span>

          <h2 className="mt-2 font-serif text-2xl font-extrabold sm:text-3xl">
            Voices From The Ground
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            Stories, issues, photos and videos submitted by citizens and
            approved by our editorial team.
          </p>
        </div>

        <PublishedPublicVoice />
      </Container>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4 text-center">
      <Icon size={22} />

      <p className="mt-2 text-sm font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs text-muted">
        {body}
      </p>
    </div>
  );
}
