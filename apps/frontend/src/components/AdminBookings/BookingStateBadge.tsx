import { Badge } from "@/components/ui/Badge";
import { getBookingStateLabel, getBookingStateTone } from "@/lib/adminBooking";
import type { AdminBookingState } from "@/types";

interface BookingStateBadgeProps {
  state: AdminBookingState;
}

export function BookingStateBadge({ state }: BookingStateBadgeProps) {
  return <Badge tone={getBookingStateTone(state)}>{getBookingStateLabel(state)}</Badge>;
}
