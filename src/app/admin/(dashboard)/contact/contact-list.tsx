"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusPill } from "@/components/admin/status-pill";
import { timeAgo } from "@/lib/utils";

const STATUSES = ["PENDING", "RESOLVED", "SPAM"];

interface ContactRow {
  id: string;
  name: string;
  email: string;
  department: string;
  message: string;
  status: string;
  submittedAt: string;
}

export function ContactList({ submissions }: { submissions: ContactRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const filtered = submissions.filter(
    (s) => s.message.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase())
  );

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/contact/${id}`, {
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
                    {s.department}
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  <Mail size={11} /> {s.email} &middot; {timeAgo(s.submittedAt)}
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
            <p className="mt-2 text-sm text-foreground/90">{s.message}</p>
            <div className="mt-2">
              <StatusPill status={s.status.toLowerCase()} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-muted">No enquiries found.</p>}
      </div>
    </div>
  );
}
