import type { BookingSubmissionValues } from "@/lib/validations/booking";
import type { BookingFeedbackSubmissionValues } from "@/lib/validations/bookingFeedback";

export interface ApiError {
  title: string;
  status: number;
}

export interface PublicPetshopFilters {
  query: string;
  city: string;
  service: string;
  rating: string;
  orderBy: string;
  orderDirection: string;
}

export interface PublicPetshopSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  neighborhood: string;
  contactSummary: string;
  addressSummary: string;
  averageRating: number | null;
  feedbackCount: number | null;
}

export interface PublicPetshopProfessional {
  id: string;
  name: string;
  specialty: string | null;
}

export interface PublicPetshopService {
  id: string;
  name: string;
  durationMinutes: number;
  basePrice: number;
}

export interface PublicPetshopDetail extends PublicPetshopSummary {
  professionals: PublicPetshopProfessional[];
  services: PublicPetshopService[];
}

export interface BookingSearchFilters {
  serviceId: string;
  professionalId: string;
  startDate: string;
  endDate: string;
}

export interface PublicBookingSlot {
  petshopId: string;
  professionalId: string;
  serviceId: string;
  slotStart: string;
  slotEnd: string;
}

export interface CreatePublicBookingPayload {
  petshopId: string;
  professionalId: string;
  serviceId: string;
  slotStart: string;
  slotEnd: string;
  ownerContact: string;
  petName: string;
  petSpecies: string;
}

export interface PublicBookingStatus {
  id: string;
  petshopId: string;
  professionalId: string;
  serviceId: string;
  state: "requested" | "confirmed" | "rejected" | "cancelled" | "completed" | "no-show";
  requestedAt: string;
  confirmedAt: string | null;
  slotStart: string;
  slotEnd: string;
  rejection: {
    rejectedAt: string;
    reason: string;
  } | null;
  cancellation: {
    cancelledAt: string;
  } | null;
  completion: {
    completedAt: string;
  } | null;
  noShow: {
    noShowAt: string;
  } | null;
}

export interface BookingStatusSessionSummary {
  statusToken: string;
  feedbackAccessToken?: string;
  petshopSlug: string;
  petshopName: string;
  serviceName: string;
  professionalName: string;
  ownerContact: string;
  petName: string;
  petSpecies: string;
}

export interface PublicBookingFeedbackEligibility {
  bookingId: string;
  canSubmit: boolean;
  reason: string | null;
}

export interface CreatePublicBookingFeedbackPayload {
  feedbackAccessToken: string;
  professionalRating: number;
  petshopRating: number;
  comment?: string;
}

export interface PublicBookingFeedback {
  bookingId: string;
  professionalRating: number;
  petshopRating: number;
  comment: string | null;
  submittedAt: string;
}

export interface SubmitBookingActionError {
  success: false;
  message?: string;
  fieldErrors?: Partial<Record<keyof BookingSubmissionValues, string>>;
}

export interface SubmitBookingActionSuccess {
  success: true;
  bookingId: string;
}

export type SubmitBookingActionResult =
  | SubmitBookingActionSuccess
  | SubmitBookingActionError;

export type SubmitBookingAction = (
  values: BookingSubmissionValues,
) => Promise<SubmitBookingActionResult>;

export interface SubmitBookingFeedbackActionError {
  success: false;
  code:
    | "validation"
    | "invalid-token"
    | "already-submitted"
    | "ineligible"
    | "unexpected";
  message: string;
  fieldErrors?: Partial<Record<keyof BookingFeedbackSubmissionValues, string>>;
}

export interface SubmitBookingFeedbackActionSuccess {
  success: true;
  feedback: PublicBookingFeedback;
}

export type SubmitBookingFeedbackActionResult =
  | SubmitBookingFeedbackActionSuccess
  | SubmitBookingFeedbackActionError;

export type SubmitBookingFeedbackAction = (
  values: BookingFeedbackSubmissionValues,
) => Promise<SubmitBookingFeedbackActionResult>;
