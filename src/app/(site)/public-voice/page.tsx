import type { Metadata } from "next";
import { Megaphone, Camera, MessageSquareWarning, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PublicVoiceForm } from "@/components/public-voice/public-voice-form";

export const metadata: Metadata = {
  title: "Public Voice — Send Us News",
  description: "Share a news tip, local issue, photo or video with The Top Interview's editorial team.",
};

export default function PublicVoicePage() {
  return (
    <div className="py-8 sm:py-10">
      <Container className="max-w-3xl">
        <div className="mb-8 text-center">
          <Megaphone size={36} className="mx-auto text-brand" />
          <span className="mt-3 block text-xs font-bold uppercase tracking-widest text-brand">Public Voice</span>
          <h1 className="mt-1 font-serif text-3xl font-extrabold sm:text-4xl">Your Story Deserves To Be Heard</h1>
          <p className="mx-auto mt-2 max-w-xl text-muted">
            Report a local issue, share a breaking news tip, or send photos and videos directly from the ground.
            Every submission is reviewed by our editorial team before publication.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoCard icon={MessageSquareWarning} title="News Tips & Complaints" body="Local issues, breaking news, corruption, infrastructure problems." />
          <InfoCard icon={Camera} title="Photos & Videos" body="Upload evidence directly — max 50MB per submission." />
          <InfoCard icon={ShieldCheck} title="Reviewed Before Publishing" body="Our moderation queue verifies every tip before it goes live." />
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
          <PublicVoiceForm />
        </div>
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
      <p className="mt-2 text-sm font-bold">{title}</p>
      <p className="mt-1 text-xs text-muted">{body}</p>
    </div>
  );
}
