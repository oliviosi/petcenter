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
    if (error instanceof ApiRequestError) {
      if (error.status === 401) {
        redirect(getAdminLoginPath("session"));
      }

      // If backend is unavailable (503), render shell with a graceful offline banner
      if (error.status === 503) {
        return (
          <AdminShell companyName={"Serviço indisponível"} userEmail={""}>
            <div className="p-6">
              <div className="rounded-md border border-error/20 bg-error/10 p-4 text-sm text-error">
                Servidor de API indisponível. Algumas funcionalidades podem não carregar. Tente novamente mais tarde.
              </div>
              {children}
            </div>
          </AdminShell>
        );
      }
    }

    throw error;
  }
}
