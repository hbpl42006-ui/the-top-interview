import { AdminTopbar } from "@/components/admin/admin-topbar";
import { auth } from "@/auth";
import { apiResults, fetchApi } from "@/lib/api/client";
import { ContactList } from "./contact-list";

interface ContactSubmission { id: string; submittedAt: string; [key: string]: unknown }

export default async function AdminContactPage() {
  const session = await auth();
  const submissions = apiResults(await fetchApi<ContactSubmission[] | { results?: ContactSubmission[] }>("/api/submissions/contact/?ordering=-submittedAt", { token: session?.accessToken }));

  return (
    <>
      <AdminTopbar title="Contact Enquiries" />
      <div className="flex-1 p-4 sm:p-6">
        <ContactList submissions={submissions} />
      </div>
    </>
  );
}
