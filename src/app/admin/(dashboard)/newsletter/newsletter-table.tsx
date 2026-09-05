"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

export function NewsletterTable({ subscribers }: { subscribers: Subscriber[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  async function remove(id: string) {
    await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function exportCsv() {
    const rows = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${s.subscribedAt}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} />
      <div className="mb-3 flex justify-end">
        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition hover:border-brand hover:text-brand"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5">Subscribed</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2.5 font-medium">{s.email}</td>
                <td className="px-4 py-2.5 text-muted">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => remove(s.id)} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted">
                  No subscribers match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
