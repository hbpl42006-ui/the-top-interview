import { MessageCircle, Send } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";
import { Container } from "@/components/ui/container";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  youtube: FaYoutube,
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  whatsapp: MessageCircle,
  telegram: Send,
};

const STATS: Record<string, string> = {
  YouTube: "1.2M Subscribers",
  Instagram: "845K Followers",
  Facebook: "612K Followers",
  "X / Twitter": "340K Followers",
  "WhatsApp Channel": "210K Members",
  Telegram: "98K Members",
};

export function FollowSection() {
  return (
    <section className="py-10 sm:py-12">
      <Container>
        <div className="mb-6 text-center">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand">Stay Connected</span>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Follow The Top Interview</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SOCIAL_LINKS.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-5 text-center transition hover:border-brand hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-foreground transition group-hover:bg-brand group-hover:text-white">
                  {Icon && <Icon size={20} />}
                </span>
                <span className="text-sm font-bold">{s.label}</span>
                <span className="text-xs text-muted">{STATS[s.label] ?? SITE.name}</span>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
