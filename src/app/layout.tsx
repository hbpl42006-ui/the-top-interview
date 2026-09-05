import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PodcastPlayerProvider } from "@/components/podcast/podcast-player-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.mission,
  keywords: ["ground reports", "Indian news", "interviews", "podcast", "local news", "The Top Interview"],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE.name,
    url: SITE.url,
    slogan: SITE.tagline,
    description: SITE.mission,
    sameAs: [
      "https://youtube.com/@thetopinterview",
      "https://instagram.com/thetopinterview",
      "https://facebook.com/thetopinterview",
      "https://x.com/thetopinterview",
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PodcastPlayerProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
            >
              Skip to content
            </a>
            {children}
          </PodcastPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
