import { AdminTopbar } from "@/components/admin/admin-topbar";
import { prisma } from "@/lib/prisma";
import { ContactList } from "./contact-list";

export default async function AdminContactPage() {
  const rows = await prisma.contactSubmission.findMany({ orderBy: { submittedAt: "desc" } });
  const submissions = rows.map((s) => ({ ...s, submittedAt: s.submittedAt.toISOString() }));

  return (
    <>
      <AdminTopbar title="Contact Enquiries" />
      <div className="flex-1 p-4 sm:p-6">
        <ContactList submissions={submissions} />
      </div>
    </>
  );
}
