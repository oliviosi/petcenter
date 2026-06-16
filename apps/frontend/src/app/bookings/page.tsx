import { redirect } from "next/navigation";

export default function Page() {
  // Redirect legacy route to admin bookings dashboard
  redirect("/admin/bookings");
}
