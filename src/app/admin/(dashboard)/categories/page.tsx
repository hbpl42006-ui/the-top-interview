import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllCategories } from "@/lib/data/categories";
import { CategoriesTable } from "./categories-table";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <AdminTopbar title="Categories" />
      <div className="flex-1 p-4 sm:p-6">
        <CategoriesTable categories={categories} />
      </div>
    </>
  );
}
