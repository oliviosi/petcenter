import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminSessionSummary } from "@/types";

const adminSessionCookieName = "petcenter-admin-session";

export function getAdminLoginPath(reason?: "session") {
  return reason ? `/admin/login?reason=${reason}` : "/admin/login";
}

export async function setAdminSession(session: AdminSessionSummary) {
  const cookieStore = await cookies();

  cookieStore.set(adminSessionCookieName, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(adminSessionCookieName)?.value;

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<AdminSessionSummary>;

    if (!parsed.token || !parsed.userId || !parsed.empresaId) {
      return null;
    }

    return {
      token: parsed.token,
      userId: parsed.userId,
      empresaId: parsed.empresaId,
    } satisfies AdminSessionSummary;
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(adminSessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect(getAdminLoginPath());
  }

  return session;
}
