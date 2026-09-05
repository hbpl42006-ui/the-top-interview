import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllVideosForAdmin } from "@/lib/data/videos";
import { VideosTable } from "./videos-table";

export default async function AdminVideosPage() {
  const rows = await getAllVideosForAdmin();
  const videos = rows.map((v) => ({ ...v, createdAt: v.createdAt.toISOString() }));

  return (
    <>
      <AdminTopbar title="Videos" />
      <div className="flex-1 p-4 sm:p-6">
        <VideosTable videos={videos} />
      </div>
    </>
  );
}
