import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" updated="September 1, 2026">
      <p>
        The information published on {SITE.name} is provided in good faith for general informational purposes.
        It is not intended as legal, financial, or medical advice.
      </p>
      <h2>News, Opinion & Sponsored Content</h2>
      <p>
        We clearly label content that is not straight news reporting. Opinion pieces reflect the views of the
        author and not necessarily those of {SITE.name}. Sponsored content is labelled as &ldquo;Sponsored&rdquo;
        and is produced independently of our editorial desk.
      </p>
      <h2>Ground Reports & Interviews</h2>
      <p>
        Ground reports and interviews reflect statements made by individuals at a specific place and time. We
        make reasonable efforts to verify claims and seek right-of-reply from concerned parties, but statements
        by interviewees represent their own views, not verified fact, unless explicitly corroborated in our
        reporting.
      </p>
      <h2>External Links</h2>
      <p>
        Our site may link to external websites (social media, government portals, third-party sources). We are
        not responsible for the content or privacy practices of those external sites.
      </p>
    </LegalPage>
  );
}
