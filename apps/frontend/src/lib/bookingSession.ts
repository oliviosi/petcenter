import { cookies } from "next/headers";
import type { BookingStatusSessionSummary } from "@/types";

const cookiePrefix = "petcenter-booking-";

export function getBookingCookieName(bookingId: string) {
  return `${cookiePrefix}${bookingId}`;
}

export async function setBookingSession(
  bookingId: string,
  session: BookingStatusSessionSummary & { statusToken: string },
) {
  const cookieStore = await cookies();

  cookieStore.set(getBookingCookieName(bookingId), JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getBookingSession(bookingId: string) {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(getBookingCookieName(bookingId))?.value;

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as BookingStatusSessionSummary & {
      statusToken: string;
    };

    if (!parsed.statusToken) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
