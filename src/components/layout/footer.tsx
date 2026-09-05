import Link from "next/link";
import { MessageCircle, Send } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";
import { NewsletterForm } from "@/components/home/newsletter-section";
import { AdSlot } from "@/components/ads/ad-slot";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  youtube: FaYoutube,
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  whatsapp: MessageCircle,
  telegram: Send,
};

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface pb-24 pt-8 lg:pb-12">
      <Container className="mb-8">
        <AdSlot label="Advertisement" size="leaderboard" />
      </Container>
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted">{SITE.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((s) => {
                const Icon = ICONS[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand"
                  >
                    {Icon && <Icon size={16} />}
                  </a>
                );
              })}
            </div>
            <div className="mt-6 max-w-sm">
              <NewsletterForm compact />
            </div>
          </div>

          <FooterColumn
            title="News"
            links={[
              { label: "Ground Reports", href: "/ground-reports" },
              { label: "Interviews", href: "/interviews" },
              { label: "Videos", href: "/videos" },
              { label: "Podcasts", href: "/podcasts" },
              { label: "Special Reports", href: "/special-reports" },
              { label: "Trending", href: "/trending" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Our Team", href: "/about#team" },
              { label: "Contact", href: "/contact" },
              { label: "Careers", href: "/contact?department=Careers" },
              { label: "Advertise With Us", href: "/contact?department=Advertising" },
              { label: "Public Voice", href: "/public-voice" },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Disclaimer", href: "/disclaimer" },
              { label: "Editorial Policy", href: "/editorial-policy" },
              { label: "Corrections Policy", href: "/corrections-policy" },
              { label: "Fact-Check Policy", href: "/fact-check-policy" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>&copy; 2026 The Top Interview. All Rights Reserved.</p>
          <p>
            Built for authentic, ground-level journalism &middot; <Link href="/sitemap.xml" className="hover:text-brand">Sitemap</Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted transition hover:text-brand">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
