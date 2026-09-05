import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllEpisodesForAdmin, podcastCategories } from "@/lib/data/podcasts";
import { PodcastsTable } from "./podcasts-table";

export default async function AdminPodcastsPage() {
  const rows = await getAllEpisodesForAdmin();
  const episodes = rows.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() }));

  return (
    <>
      <AdminTopbar title="Podcasts" />
      <div className="flex-1 p-4 sm:p-6">
        <PodcastsTable episodes={episodes} categories={podcastCategories} />
      </div>
    </>
  );
}
