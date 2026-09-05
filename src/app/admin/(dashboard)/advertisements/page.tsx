import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllAds } from "@/lib/data/ads";
import { AdsTable } from "./ads-table";

export default async function AdminAdvertisementsPage() {
  const ads = await getAllAds();

  return (
    <>
      <AdminTopbar title="Advertisements" />
      <div className="flex-1 p-4 sm:p-6">
        <AdsTable ads={ads} />
      </div>
    </>
  );
}
