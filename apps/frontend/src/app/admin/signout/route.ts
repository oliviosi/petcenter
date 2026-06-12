import { clearAdminSession } from "@/lib/adminSession";
import { NextResponse } from "next/server";

export async function POST() {
  await clearAdminSession();
  const redirectUrl = new URL('/admin/login?reason=session', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost');
  return NextResponse.redirect(redirectUrl);
}
