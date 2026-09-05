import { AdminTopbar } from "@/components/admin/admin-topbar";
import { StatCard } from "@/components/admin/stat-card";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { getAnalyticsSummary } from "@/lib/data/analytics";
import { formatViews } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const summary = await getAnalyticsSummary();

  return (
    <>
      <AdminTopbar title="Analytics Dashboard" />
      <div className="flex-1 space-y-8 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Published News"
            value={formatViews(summary.content.news.published)}
            hint={`${summary.content.news.draft} in draft`}
            accent
          />
          <StatCard label="Ground Reports" value={formatViews(summary.content.groundReports)} />
          <StatCard label="Interviews" value={formatViews(summary.content.interviews)} />
          <StatCard label="Newsletter Subscribers" value={formatViews(summary.engagement.newsletterSubscribers)} />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Podcast Episodes" value={formatViews(summary.content.podcastEpisodes)} />
          <StatCard label="Videos" value={formatViews(summary.content.videos)} />
          <StatCard label="Pending Comments" value={formatViews(summary.engagement.pendingComments)} />
          <StatCard label="Pending Submissions" value={formatViews(summary.engagement.pendingSubmissions + summary.engagement.pendingContact)} />
        </div>

        <AnalyticsCharts contentByState={summary.contentByState} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RankedList title="Most-Read Stories" items={summary.topArticles.map((a) => ({ label: a.label, meta: `${formatViews(a.value)} views` }))} />
          <RankedList title="Popular Ground Reports" items={summary.topGroundReports.map((r) => ({ label: r.label, meta: `${formatViews(r.value)} views` }))} />
          <RankedList title="Popular Podcasts" items={summary.topEpisodes.map((p) => ({ label: p.label, meta: `${formatViews(p.value)} plays` }))} />
        </div>

        <p className="text-xs text-muted">
          Visitor traffic, device and search-term analytics require a pageview-logging pipeline (see the
          <code className="mx-1 font-mono">AnalyticsEvent</code> model in <code className="font-mono">prisma/schema.prisma</code>) or a
          provider like GA4 wired up via <code className="mx-1 font-mono">NEXT_PUBLIC_GA_MEASUREMENT_ID</code>. The figures above are
          all real counts from the database.
        </p>
      </div>
    </>
  );
}

function RankedList({ title, items }: { title: string; items: { label: string; meta: string }[] }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h2 className="mb-3 font-serif text-lg font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted">No published content yet.</p>
      ) : (
        <ol className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-sm">
              <span className="line-clamp-1 flex-1">
                <span className="mr-1.5 font-bold text-brand">{i + 1}.</span>
                {item.label}
              </span>
              <span className="shrink-0 text-xs text-muted">{item.meta}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
