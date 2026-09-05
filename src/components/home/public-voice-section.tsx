import Link from "next/link";
import { Megaphone, Camera, MessageSquareWarning } from "lucide-react";
import { Container } from "@/components/ui/container";

export function PublicVoiceSection() {
  return (
    <section className="border-y border-border bg-brand text-white">
      <Container className="flex flex-col items-center gap-6 py-12 text-center sm:py-14">
        <Megaphone size={36} />
        <div>
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Public Voice
          </span>
          <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">Your Story Deserves To Be Heard</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/85">
            Report a local issue, share a news tip, or send us photos and videos from the ground. Every submission is reviewed by our editorial team.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-white/90">
          <span className="flex items-center gap-2">
            <MessageSquareWarning size={16} /> News Tips &amp; Complaints
          </span>
          <span className="flex items-center gap-2">
            <Camera size={16} /> Photos &amp; Videos
          </span>
        </div>
        <Link
          href="/public-voice"
          className="rounded-sm bg-charcoal px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-black"
        >
          Share Your Story
        </Link>
      </Container>
    </section>
  );
}
