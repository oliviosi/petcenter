import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { api, ApiRequestError } from "@/lib/api";
import { getAdminLoginPath, requireAdminSession } from "@/lib/adminSession";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdminSession();

  try {
    const currentUser = await api.getAdminMe(session.token);

    return (
      <AdminShell
        companyName={currentUser.company.name}
        userEmail={currentUser.email}
      >
        {children}
      </AdminShell>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect(getAdminLoginPath("session"));
    }

    throw error;
  }
}
