import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Corrections Policy" };

export default function CorrectionsPolicyPage() {
  return (
    <LegalPage title="Corrections Policy" updated="September 1, 2026">
      <p>
        We aim to be accurate at first publication, but errors happen. When they do, we correct them
        transparently rather than quietly editing the record.
      </p>
      <h2>How We Correct</h2>
      <ul>
        <li>Factual errors are corrected in the article, with an &ldquo;Updated&rdquo; timestamp and, for significant changes, a note explaining what was corrected.</li>
        <li>Minor edits (spelling, grammar, formatting) do not carry a correction note.</li>
        <li>Significant factual errors that change the substance of a story will also be noted at the top of the article.</li>
      </ul>
      <h2>Reporting an Error</h2>
      <p>
        Every article includes a &ldquo;Report an Error&rdquo; link. Use it, or email our editorial team directly,
        with the article link and a description of the issue. We review all correction requests within 48 hours.
      </p>
    </LegalPage>
  );
}
