"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const BRAND = "#c8102e";

export function AnalyticsCharts({ contentByState }: { contentByState: { state: string; value: number }[] }) {
  if (contentByState.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-2 font-serif text-lg font-bold">Content by State</h2>
        <p className="text-sm text-muted">No location-tagged stories published yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h2 className="mb-4 font-serif text-lg font-bold">Published Stories by State</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={contentByState}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="state" stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
          <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="value" fill={BRAND} radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
