"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, MapPin } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusPill } from "@/components/admin/status-pill";
import { timeAgo } from "@/lib/utils";

const STATUSES = ["PENDING", "REVIEWED", "PUBLISHED", "REJECTED"];

interface SubmissionRow {
  id: string;
  source: string;
  name: string;
  location: string;
  category: string;
  description: string;
  mediaUrl: string | null;
  status: string;
  submittedAt: string;
}

export function SubmissionsList({ submissions }: { submissions: SubmissionRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const filtered = submissions.filter(
    (s) => s.description.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase())
  );

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/submissions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} />
      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{s.name}</span>
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-bold uppercase text-muted">
                    {s.category}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-muted">
                    {s.source === "NEWS_TIP" ? "Send Us News" : "Public Voice"}
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  <MapPin size={11} /> {s.location} &middot; {timeAgo(s.submittedAt)}
                  {s.mediaUrl && (
                    <span className="flex items-center gap-0.5">
                      &middot; <Paperclip size={11} /> Media
                    </span>
                  )}
                </p>
              </div>
              <select
                value={s.status}
                onChange={(e) => updateStatus(s.id, e.target.value)}
                className="rounded-sm border border-border bg-background px-2 py-1 text-xs outline-none focus:border-brand"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-sm text-foreground/90">{s.description}</p>
            <div className="mt-2">
              <StatusPill status={s.status.toLowerCase()} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-muted">No submissions found.</p>}
      </div>
    </div>
  );
}
