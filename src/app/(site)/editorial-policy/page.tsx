import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Editorial Policy" };

export default function EditorialPolicyPage() {
  return (
    <LegalPage title="Editorial Policy" updated="September 1, 2026">
      <p>
        Our editorial process is built around one principle: report from the ground, verify before publishing,
        and correct openly when we get something wrong.
      </p>
      <h2>Sourcing Standards</h2>
      <ul>
        <li>Ground reports require on-location reporting, direct interviews, or documentary evidence (RTI responses, official records, video/photo evidence).</li>
        <li>Anonymous sources are used only when a named source would face real risk, and only with editor sign-off.</li>
        <li>Any individual or organisation criticised in a story is given a fair opportunity to respond before publication.</li>
      </ul>
      <h2>Separation of News and Opinion</h2>
      <p>
        Straight news reporting is kept separate from opinion and analysis. Opinion content is clearly labelled
        and does not appear in our core News, Ground Report or Breaking News feeds.
      </p>
      <h2>Sponsored Content</h2>
      <p>
        Any paid or sponsored content is clearly marked as such and is never written or edited by our news desk.
      </p>
      <h2>Independence</h2>
      <p>
        Our reporters do not accept gifts, payment, or favours from sources, subjects, advertisers, or public
        officials in exchange for coverage.
      </p>
    </LegalPage>
  );
}
