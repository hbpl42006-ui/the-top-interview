import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllNewsForAdmin } from "@/lib/data/news";
import { getAllCategories } from "@/lib/data/categories";
import { getAllReporters } from "@/lib/data/reporters";
import { NewsTable } from "./news-table";

export default async function AdminNewsPage() {
  const [rows, categories, reporters] = await Promise.all([
    getAllNewsForAdmin(),
    getAllCategories(),
    getAllReporters(),
  ]);
  const articles = rows.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }));

  return (
    <>
      <AdminTopbar title="News" />
      <div className="flex-1 p-4 sm:p-6">
        <NewsTable
          articles={articles}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          reporters={reporters.map((r) => ({ id: r.id, name: r.name }))}
        />
      </div>
    </>
  );
}
