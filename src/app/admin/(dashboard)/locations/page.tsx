import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllStates } from "@/lib/data/locations";
import { LocationsTable } from "./locations-table";

export default async function AdminLocationsPage() {
  const states = await getAllStates();

  return (
    <>
      <AdminTopbar title="Locations" />
      <div className="flex-1 p-4 sm:p-6">
        <LocationsTable states={states} />
      </div>
    </>
  );
}
