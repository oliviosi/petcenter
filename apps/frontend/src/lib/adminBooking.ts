import type { AdminBookingFilters, AdminBookingListItem, AdminBookingState } from "@/types";

type BookingStateBadgeTone = "brand" | "success" | "warning" | "danger" | "neutral";

export const bookingStateOptions: Array<{
  value: AdminBookingState | "";
  label: string;
}> = [
  { value: "", label: "Todos os estados" },
  { value: "requested", label: "Solicitada" },
  { value: "confirmed", label: "Confirmada" },
  { value: "rejected", label: "Rejeitada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "completed", label: "Concluída" },
  { value: "no-show", label: "Não compareceu" },
];

export function getBookingStateLabel(state: AdminBookingState) {
  const option = bookingStateOptions.find((item) => item.value === state);
  return option?.label ?? state;
}

export function getBookingStateTone(state: AdminBookingState): BookingStateBadgeTone {
  switch (state) {
    case "confirmed":
      return "brand";
    case "completed":
      return "success";
    case "rejected":
    case "cancelled":
      return "danger";
    case "no-show":
      return "warning";
    default:
      return "neutral";
  }
}

export function canCompleteBooking(state: AdminBookingState) {
  return state === "confirmed";
}

export function canCancelBooking(state: AdminBookingState) {
  return state === "requested" || state === "confirmed";
}

export function canNoShowBooking(state: AdminBookingState) {
  return state === "confirmed";
}

export function isDefaultAdminBookingWindow(filters: AdminBookingFilters) {
  return Boolean(filters.startDate) && !filters.endDate && !filters.state && !filters.professionalId;
}

export function getTerminalSummary(booking: AdminBookingListItem) {
  if (booking.completion) {
    return {
      title: "Atendimento concluído",
      description: "Preço final registrado e reserva encerrada para feedback posterior.",
    };
  }

  if (booking.cancellation) {
    return {
      title: "Reserva cancelada",
      description: booking.cancellation.reason,
    };
  }

  if (booking.noShow) {
    return {
      title: "Não comparecimento registrado",
      description: booking.noShow.reason,
    };
  }

  if (booking.rejection) {
    return {
      title: "Solicitação rejeitada",
      description: booking.rejection.reason,
    };
  }

  return null;
}

export function getUpdatedBookingMessage(value: string | undefined) {
  switch (value) {
    case "complete":
      return "Reserva concluída com sucesso.";
    case "cancel":
      return "Reserva cancelada com sucesso.";
    case "no-show":
      return "Não comparecimento registrado com sucesso.";
    default:
      return null;
  }
}
