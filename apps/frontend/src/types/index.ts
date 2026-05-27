import type { AdminLoginValues } from "@/lib/validations/adminLogin";
import type {
  CancelAdminBookingValues,
  CompleteAdminBookingValues,
  NoShowAdminBookingValues,
} from "@/lib/validations/adminBookingAction";
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

export type AdminCustomDomainStatus =
  | "removed"
  | "pending_setup"
  | "verifying_dns"
  | "provisioning_tls"
  | "active"
  | "dns_failed"
  | "tls_failed";

export type AdminCustomDomainDnsStatus =
  | "removed"
  | "pending_setup"
  | "verifying"
  | "verified"
  | "failed";

export type AdminCustomDomainTlsStatus =
  | "not_started"
  | "provisioning"
  | "ready"
  | "failed";

export type AdminCustomDomainMode = "none" | "subdomain" | "apex";

export type AdminCustomDomainDnsRecordType =
  | "none"
  | "cname"
  | "apex_supported_targets";

export interface AdminCustomDomainDnsGuidance {
  mode: AdminCustomDomainMode;
  recordType: AdminCustomDomainDnsRecordType;
  recordName: string;
  zoneDns: string;
  expectedValues: string[];
  expectedHostnames: string[];
  expectedIps: string[];
  primaryInstruction: string;
  secondaryInstruction: string | null;
  optionalWwwRedirectInstruction: string | null;
}

export interface AdminCustomDomain {
  desiredDomain: string | null;
  activeDomain: string | null;
  mode: AdminCustomDomainMode;
  dnsGuidance: AdminCustomDomainDnsGuidance;
  status: AdminCustomDomainStatus;
  dnsStatus: AdminCustomDomainDnsStatus;
  dnsFailureMessage: string | null;
  dnsLastAttemptAt: string | null;
  dnsNextRetryAt: string | null;
  dnsVerifiedAt: string | null;
  tlsStatus: AdminCustomDomainTlsStatus;
  tlsFailureMessage: string | null;
  tlsProvisioningStartedAt: string | null;
  tlsLastAttemptAt: string | null;
  tlsNextRetryAt: string | null;
  httpsReadyAt: string | null;
  activatedAt: string | null;
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

export interface AdminSessionSummary {
  token: string;
  userId: string;
  empresaId: string;
}

export interface AdminCurrentUser {
  userId: string;
  email: string;
  company: {
    id: string;
    name: string;
  };
}

export interface AdminPublicProfile {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  neighborhood: string;
  contactSummary: string;
  addressSummary: string;
  customDomain: AdminCustomDomain;
  isPublished: boolean;
}

export interface AdminProfessional {
  id: string;
  companyId: string;
  name: string;
  specialty: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AdminService {
  id: string;
  companyId: string;
  name: string;
  durationMinutes: number;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminProfessionalServiceAssignment {
  assignmentId: string;
  companyId: string;
  professionalId: string;
  serviceId: string;
  serviceName: string;
  serviceDurationMinutes: number;
  basePrice: number;
  active: boolean;
  createdAt: string;
}

export interface AdminProfessionalAvailability {
  id: string;
  professionalId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export type AdminBookingState =
  | "requested"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "completed"
  | "no-show";

export interface AdminBookingProfessional {
  id: string;
  name: string;
  specialty: string | null;
}

export interface AdminBookingService {
  id: string;
  name: string;
  durationMinutes: number;
  basePrice: number;
}

export interface AdminBookingPet {
  clientId?: string;
  name: string;
  species: string;
}

export interface AdminBookingRejection {
  rejectedAt: string;
  reason: string;
}

export interface AdminBookingCompletion {
  completedAt: string;
  finalChargedPrice: number;
}

export interface AdminBookingCancellation {
  cancelledAt: string;
  reason: string;
}

export interface AdminBookingNoShow {
  noShowAt: string;
  reason: string;
}

export interface AdminBookingListItem {
  id: string;
  state: AdminBookingState;
  requestedAt: string;
  confirmedAt: string | null;
  slotStart: string;
  slotEnd: string;
  ownerContact: string;
  professional: AdminBookingProfessional;
  service: AdminBookingService;
  pet: AdminBookingPet;
  rejection: AdminBookingRejection | null;
  completion: AdminBookingCompletion | null;
  cancellation: AdminBookingCancellation | null;
  noShow: AdminBookingNoShow | null;
}

export interface AdminBookingDetail extends AdminBookingListItem {
  empresaId: string;
  pet: AdminBookingPet & {
    clientId: string;
  };
}

export interface AdminBookingFilters {
  startDate: string;
  endDate: string;
  state: AdminBookingState | "";
  professionalId: string;
}

export interface AdminFeedbackPetshopSummary {
  averageRating: number | null;
  feedbackCount: number;
  isRated: boolean;
}

export interface AdminFeedbackProfessionalSummary {
  professionalId: string;
  name: string;
  specialty: string | null;
  averageRating: number | null;
  feedbackCount: number;
  isRated: boolean;
}

export interface AdminFeedbackSummary {
  petshop: AdminFeedbackPetshopSummary;
  professionals: AdminFeedbackProfessionalSummary[];
}

export interface AdminFeedbackEntry {
  bookingId: string;
  professional: {
    id: string;
    name: string;
    specialty: string | null;
  };
  petshopRating: number;
  professionalRating: number;
  comment: string | null;
  submittedAt: string;
}

export interface AdminFeedbackFilters {
  startDate: string;
  endDate: string;
  professionalId: string;
}

export interface SubmitAdminLoginActionError {
  success: false;
  message: string;
  fieldErrors?: Partial<Record<keyof AdminLoginValues, string>>;
}

export interface SubmitAdminLoginActionSuccess {
  success: true;
  redirectTo: string;
}

export type SubmitAdminLoginActionResult =
  | SubmitAdminLoginActionSuccess
  | SubmitAdminLoginActionError;

export type SubmitAdminLoginAction = (
  values: AdminLoginValues,
) => Promise<SubmitAdminLoginActionResult>;

export interface AdminBookingMutationError<FieldName extends string = string> {
  success: false;
  message: string;
  fieldErrors?: Partial<Record<FieldName, string>>;
}

export interface AdminBookingMutationSuccess {
  success: true;
  redirectTo: string;
}

export interface AdminMutationError<FieldName extends string = string> {
  success: false;
  message: string;
  fieldErrors?: Partial<Record<FieldName, string>>;
}

export interface AdminMutationSuccess {
  success: true;
  message: string;
}

export type AdminBookingMutationResult<FieldName extends string = string> =
  | AdminBookingMutationSuccess
  | AdminBookingMutationError<FieldName>;

export type AdminMutationResult<FieldName extends string = string> =
  | AdminMutationSuccess
  | AdminMutationError<FieldName>;

export type SubmitAdminCompleteBookingAction = (
  values: CompleteAdminBookingValues,
) => Promise<
  AdminBookingMutationResult<Extract<keyof CompleteAdminBookingValues, string>>
>;

export type SubmitAdminCancelBookingAction = (
  values: CancelAdminBookingValues,
) => Promise<
  AdminBookingMutationResult<Extract<keyof CancelAdminBookingValues, string>>
>;

export type SubmitAdminNoShowBookingAction = (
  values: NoShowAdminBookingValues,
) => Promise<
  AdminBookingMutationResult<Extract<keyof NoShowAdminBookingValues, string>>
>;
