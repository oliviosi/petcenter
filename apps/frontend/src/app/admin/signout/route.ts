import { clearAdminSession } from "@/lib/adminSession";
import { NextResponse } from "next/server";

export async function POST() {
  await clearAdminSession();
  return NextResponse.redirect('/admin/login?reason=session');
}
