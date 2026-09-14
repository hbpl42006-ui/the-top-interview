import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

import { SITE } from "@/lib/constants";
import { getLocale } from "@/lib/i18n";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
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

  description: "The Top Interview brings you breaking news, exclusive interviews, ground reports, public voices, special reports and current affairs from India.",

  keywords: [
    "The Top Interview", "latest news India", "breaking news India", "Indian news", "latest interviews", "exclusive interviews", "political interviews India", "business interviews India", "ground reports India", "special reports India", "public voice India", "citizen journalism India", "current affairs India", "politics news India", "business news India", "education news India", "technology news India", "entertainment news India", "sports news India", "Hindi news", "English news India", "video interviews", "news podcasts India",
  ],

  verification: {
    google: "SHl76yGiNCZRAwlZWlz8rAm6OjKPWKepwiS-R8aDBQE",
  },

  icons: {
  icon: "/favicon.png",
  shortcut: "/favicon.png",
  apple: "/favicon.png",
},

  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: "Breaking news, interviews and ground reports from India.",
    url: SITE.url,
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: "Breaking news, interviews and ground reports from India.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

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
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgSchema),
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <LanguageProvider initialLocale={locale}>
            <PodcastPlayerProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
              >
                Skip to content
              </a>

              {children}
            </PodcastPlayerProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
