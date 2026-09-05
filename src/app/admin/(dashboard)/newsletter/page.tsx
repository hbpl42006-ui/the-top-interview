import { AdminTopbar } from "@/components/admin/admin-topbar";
import { StatCard } from "@/components/admin/stat-card";
import { prisma } from "@/lib/prisma";
import { formatViews } from "@/lib/utils";
import { NewsletterTable } from "./newsletter-table";

export default async function AdminNewsletterPage() {
  const rows = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: "desc" } });
  const subscribers = rows.map((s) => ({ ...s, subscribedAt: s.subscribedAt.toISOString() }));

  // eslint-disable-next-line react-hooks/purity -- Server Component computed once per request, not a reactive render
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newThisWeek = subscribers.filter((s) => new Date(s.subscribedAt) > weekAgo).length;
  const activeCount = subscribers.filter((s) => s.isActive).length;

  return (
    <>
      <AdminTopbar title="Newsletter" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Subscribers" value={formatViews(subscribers.length)} accent />
          <StatCard label="Active" value={formatViews(activeCount)} />
          <StatCard label="New This Week" value={formatViews(newThisWeek)} />
        </div>
        <NewsletterTable subscribers={subscribers} />
      </div>
    </>
  );
}
