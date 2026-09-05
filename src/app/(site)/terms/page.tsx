import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="September 1, 2026">
      <p>
        By accessing {SITE.name} (&ldquo;the Site&rdquo;), you agree to the following terms. If you do not agree,
        please discontinue use of the Site.
      </p>
      <h2>Use of Content</h2>
      <p>
        All articles, videos, images and podcast episodes are the property of {SITE.name} or its licensors.
        Content may be shared via the provided social sharing buttons but may not be reproduced, republished,
        or redistributed for commercial purposes without written permission.
      </p>
      <h2>User Submissions</h2>
      <p>
        By submitting a news tip, comment, photo or video through Public Voice or the comments section, you
        grant {SITE.name} a non-exclusive licence to review, edit for clarity, and publish that submission,
        subject to our editorial judgment and Privacy Policy.
      </p>
      <h2>Comments</h2>
      <p>
        Comments are moderated. We reserve the right to remove any comment that is abusive, defamatory, off-topic,
        or violates applicable law, without prior notice.
      </p>
      <h2>Limitation of Liability</h2>
      <p>
        While we take care to verify our reporting, {SITE.name} makes no warranty as to the completeness or
        accuracy of any article and is not liable for decisions made based on its content.
      </p>
    </LegalPage>
  );
}
