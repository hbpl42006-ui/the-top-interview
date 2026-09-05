import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 1, 2026">
      <p>
        {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what
        information we collect when you use this website, how we use it, and the choices you have.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li>Information you submit voluntarily — newsletter sign-ups, contact forms, and Public Voice submissions (name, contact details, location, description, and any photos or videos you upload).</li>
        <li>Usage data collected automatically — pages viewed, device type, approximate location and referral source, used to understand readership and improve the site.</li>
        <li>Cookies and local storage used for theme preference, recent searches, and bookmarked articles.</li>
      </ul>
      <h2>How We Use Information</h2>
      <ul>
        <li>To operate and improve the website and its content recommendations.</li>
        <li>To review and, where appropriate, publish Public Voice submissions — your identity is withheld from publication unless you explicitly consent.</li>
        <li>To send newsletter emails you have opted into. You can unsubscribe at any time.</li>
      </ul>
      <h2>Protecting Sources and Tipsters</h2>
      <p>
        We take the protection of news tipsters seriously. Contact details submitted through Public Voice are
        accessible only to editorial staff reviewing the submission and are never sold or shared with third parties.
      </p>
      <h2>Your Choices</h2>
      <p>
        You may request access to, correction of, or deletion of personal information you have submitted to us by
        emailing our editorial team.
      </p>
    </LegalPage>
  );
}
