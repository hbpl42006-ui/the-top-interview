import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { FactCheckBadge } from "@/components/article/fact-check-badge";

export const metadata: Metadata = { title: "Fact-Check Policy" };

export default function FactCheckPolicyPage() {
  return (
    <LegalPage title="Fact-Check & Verification Policy" updated="September 1, 2026">
      <p>
        Select articles carry a fact-check status badge reflecting the verification stage of the reporting at
        the time of publication or last update.
      </p>
      <div className="flex flex-wrap gap-2 not-prose">
        <FactCheckBadge status="Verified" />
        <FactCheckBadge status="Under Review" />
        <FactCheckBadge status="Disputed" />
      </div>
      <h2>What Each Status Means</h2>
      <ul>
        <li><strong>Verified</strong> — key facts have been corroborated through multiple independent sources, official records, or direct documentary evidence.</li>
        <li><strong>Under Review</strong> — used for fast-moving breaking news where initial reporting is based on eyewitness accounts or early official statements pending further confirmation.</li>
        <li><strong>Disputed</strong> — used when credible parties contest a claim in the story; we present both the original reporting and the dispute.</li>
      </ul>
      <h2>Updates</h2>
      <p>
        A story&apos;s fact-check status can change as more information becomes available. Status changes are
        reflected in the article&apos;s &ldquo;Updated&rdquo; timestamp.
      </p>
    </LegalPage>
  );
}
