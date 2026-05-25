import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminSession";

export default async function AdminIndexPage() {
  const session = await getAdminSession();

  redirect(session ? "/admin/bookings" : "/admin/login");
}
