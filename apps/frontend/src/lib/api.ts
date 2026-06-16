import type {
  AdminBookingCancellation,
  AdminBookingCompletion,
  AdminBookingDetail,
  AdminFeedbackEntry,
  AdminFeedbackFilters,
  AdminCustomDomain,
  AdminFeedbackPetshopSummary,
  AdminFeedbackProfessionalSummary,
  AdminFeedbackSummary,
  AdminBookingFilters,
  AdminBookingListItem,
  AdminBookingNoShow,
  AdminBookingProfessional,
  AdminBookingRejection,
  AdminBookingService,
  AdminCurrentUser,
  AdminPublicProfile,
  AdminProfessional,
  AdminProfessionalAvailability,
  AdminProfessionalServiceAssignment,
  AdminService,
  AdminSessionSummary,
  ApiError,
  CreatePublicBookingFeedbackPayload,
  CreatePublicBookingPayload,
  PublicBookingFeedback,
  PublicBookingFeedbackEligibility,
  PublicBookingSlot,
  PublicBookingStatus,
  PublicPetshopDetail,
  PublicPetshopFilters,
  PublicPetshopSummary,
} from "@/types";

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

function ensureApiBaseUrl() {
  if (!apiBaseUrl) {
    throw new Error("API_BASE_URL não configurada.");
  }

  return apiBaseUrl;
}

function buildUrl(path: string) {
  return new URL(path, ensureApiBaseUrl()).toString();
}

function withQuery(path: string, params?: Record<string, string | undefined>) {
  const url = new URL(path, ensureApiBaseUrl());

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  return url.toString();
}

export class ApiRequestError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(error: ApiError & { fieldErrors?: Record<string, string[]> }) {
    super(error.title);
    this.name = "ApiRequestError";
    this.status = error.status;
    this.fieldErrors = error.fieldErrors;
  }
}

async function parseError(response: Response) {
  const fallback = {
    title: "Ocorreu um erro inesperado.",
    status: response.status,
  } satisfies ApiError;

  const error = (await response.json().catch(() => fallback)) as
    | (ApiError & { errors?: Record<string, string[]> })
    | undefined;

  return new ApiRequestError({
    title: error?.title ?? fallback.title,
    status: error?.status ?? fallback.status,
    fieldErrors: error?.errors,
  });
}

async function request<T>(
  path: string,
  options?: RequestInit & {
    params?: Record<string, string | undefined>;
  },
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(withQuery(path, options?.params), {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options?.body ? { "Content-Type": "application/json" } : {}),
        ...options?.headers,
      },
    });
  } catch (err: any) {
    // Network-level failures (e.g. ECONNREFUSED) should be surfaced as a 503-style ApiRequestError
    throw new ApiRequestError({ title: "Serviço indisponível.", status: 503 });
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function mapPetshopSummary(item: {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  cidade: string;
  bairro: string;
  resumoContato: string;
  resumoEndereco: string;
  averageRating: number | null;
  feedbackCount: number | null;
}): PublicPetshopSummary {
  return {
    id: item.id,
    name: item.nome,
    slug: item.slug,
    description: item.descricao,
    city: item.cidade,
    neighborhood: item.bairro,
    contactSummary: item.resumoContato,
    addressSummary: item.resumoEndereco,
    averageRating: item.averageRating,
    feedbackCount: item.feedbackCount,
  };
}

function mapPetshopDetail(item: {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  cidade: string;
  bairro: string;
  resumoContato: string;
  resumoEndereco: string;
  averageRating: number | null;
  feedbackCount: number | null;
  profissionais: Array<{
    id: string;
    nome: string;
    especialidade: string | null;
  }>;
  servicos: Array<{
    id: string;
    nome: string;
    duracaoMinutos: number;
    precoBase: number;
  }>;
}): PublicPetshopDetail {
  return {
    id: item.id,
    name: item.nome,
    slug: item.slug,
    description: item.descricao,
    city: item.cidade,
    neighborhood: item.bairro,
    contactSummary: item.resumoContato,
    addressSummary: item.resumoEndereco,
    averageRating: item.averageRating,
    feedbackCount: item.feedbackCount,
    professionals: item.profissionais.map((professional) => ({
      id: professional.id,
      name: professional.nome,
      specialty: professional.especialidade,
    })),
    services: item.servicos.map((service) => ({
      id: service.id,
      name: service.nome,
      durationMinutes: service.duracaoMinutos,
      basePrice: service.precoBase,
    })),
  };
}

type JsonRecord = Record<string, unknown>;

function toRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function readValue(record: JsonRecord, ...keys: string[]) {
  for (const key of keys) {
    if (key in record) {
      return record[key];
    }
  }

  return undefined;
}

function readString(record: JsonRecord, ...keys: string[]) {
  const value = readValue(record, ...keys);
  return typeof value === "string" ? value : "";
}

function readNullableString(record: JsonRecord, ...keys: string[]) {
  const value = readValue(record, ...keys);
  return typeof value === "string" ? value : null;
}

function readNumber(record: JsonRecord, ...keys: string[]) {
  const value = readValue(record, ...keys);

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return 0;
}

function readNullableNumber(record: JsonRecord, ...keys: string[]) {
  const value = readValue(record, ...keys);

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return null;
}

function readBoolean(record: JsonRecord, ...keys: string[]) {
  const value = readValue(record, ...keys);

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return false;
}

function readNullableObject(record: JsonRecord, ...keys: string[]) {
  const value = readValue(record, ...keys);
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function readArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function mapAdminBookingProfessional(value: unknown): AdminBookingProfessional {
  const record = toRecord(value);

  return {
    id: readString(record, "id", "Id"),
    name: readString(record, "name", "Name", "nome", "Nome"),
    specialty: readNullableString(
      record,
      "specialty",
      "Specialty",
      "especialidade",
      "Especialidade",
    ),
  };
}

function mapAdminFeedbackPetshopSummary(value: unknown): AdminFeedbackPetshopSummary {
  const record = toRecord(value);

  return {
    averageRating: readNullableNumber(record, "averageRating", "AverageRating"),
    feedbackCount: readNumber(record, "feedbackCount", "FeedbackCount"),
    isRated: readBoolean(record, "isRated", "IsRated"),
  };
}

function mapAdminFeedbackProfessionalSummary(value: unknown): AdminFeedbackProfessionalSummary {
  const record = toRecord(value);

  return {
    professionalId: readString(
      record,
      "professionalId",
      "ProfessionalId",
      "profissionalId",
      "ProfissionalId",
    ),
    name: readString(record, "name", "Name", "nome", "Nome"),
    specialty: readNullableString(
      record,
      "specialty",
      "Specialty",
      "especialidade",
      "Especialidade",
    ),
    averageRating: readNullableNumber(record, "averageRating", "AverageRating"),
    feedbackCount: readNumber(record, "feedbackCount", "FeedbackCount"),
    isRated: readBoolean(record, "isRated", "IsRated"),
  };
}

function mapAdminFeedbackSummary(value: unknown): AdminFeedbackSummary {
  const record = toRecord(value);

  return {
    petshop: mapAdminFeedbackPetshopSummary(readValue(record, "petshop", "Petshop")),
    professionals: readArray(readValue(record, "professionals", "Professionals")).map(
      mapAdminFeedbackProfessionalSummary,
    ),
  };
}

function mapAdminFeedbackEntry(value: unknown): AdminFeedbackEntry {
  const record = toRecord(value);

  return {
    bookingId: readString(record, "bookingId", "BookingId"),
    professional: {
      id: readString(
        toRecord(readValue(record, "professional", "Professional")),
        "id",
        "Id",
      ),
      name: readString(
        toRecord(readValue(record, "professional", "Professional")),
        "name",
        "Name",
        "nome",
        "Nome",
      ),
      specialty: readNullableString(
        toRecord(readValue(record, "professional", "Professional")),
        "specialty",
        "Specialty",
        "especialidade",
        "Especialidade",
      ),
    },
    petshopRating: readNumber(record, "petshopRating", "PetshopRating"),
    professionalRating: readNumber(record, "professionalRating", "ProfessionalRating"),
    comment: readNullableString(record, "comment", "Comment"),
    submittedAt: readString(record, "submittedAt", "SubmittedAt"),
  };
}

function mapAdminBookingService(value: unknown): AdminBookingService {
  const record = toRecord(value);

  return {
    id: readString(record, "id", "Id"),
    name: readString(record, "name", "Name", "nome", "Nome"),
    durationMinutes: readNumber(
      record,
      "durationMinutes",
      "DurationMinutes",
      "duracaoMinutos",
      "DuracaoMinutos",
    ),
    basePrice: readNumber(record, "basePrice", "BasePrice", "precoBase", "PrecoBase"),
  };
}

function mapAdminBookingRejection(value: unknown): AdminBookingRejection | null {
  const record = toRecord(value);
  const rejectedAt = readString(record, "rejectedAt", "RejectedAt");
  const reason = readString(record, "reason", "Reason");

  return rejectedAt && reason ? { rejectedAt, reason } : null;
}

function mapAdminBookingCompletion(value: unknown): AdminBookingCompletion | null {
  const record = toRecord(value);
  const completedAt = readString(record, "completedAt", "CompletedAt");

  return completedAt
    ? {
        completedAt,
        finalChargedPrice: readNumber(
          record,
          "finalChargedPrice",
          "FinalChargedPrice",
        ),
      }
    : null;
}

function mapAdminBookingCancellation(value: unknown): AdminBookingCancellation | null {
  const record = toRecord(value);
  const cancelledAt = readString(record, "cancelledAt", "CancelledAt");
  const reason = readString(
    record,
    "reason",
    "Reason",
    "cancellationReason",
    "CancellationReason",
  );

  return cancelledAt && reason ? { cancelledAt, reason } : null;
}

function mapAdminBookingNoShow(value: unknown): AdminBookingNoShow | null {
  const record = toRecord(value);
  const noShowAt = readString(record, "noShowAt", "NoShowAt");
  const reason = readString(record, "reason", "Reason", "noShowReason", "NoShowReason");

  return noShowAt && reason ? { noShowAt, reason } : null;
}

function mapAdminBookingListItem(value: unknown): AdminBookingListItem {
  const record = toRecord(value);
  const petRecord = toRecord(readValue(record, "pet", "Pet"));

  return {
    id: readString(record, "id", "Id"),
    state: readString(record, "state", "State") as AdminBookingListItem["state"],
    requestedAt: readString(record, "requestedAt", "RequestedAt"),
    confirmedAt: readNullableString(record, "confirmedAt", "ConfirmedAt"),
    slotStart: readString(record, "slotStart", "SlotStart"),
    slotEnd: readString(record, "slotEnd", "SlotEnd"),
    ownerContact: readString(record, "ownerContact", "OwnerContact"),
    professional: mapAdminBookingProfessional(
      readValue(record, "professional", "Professional"),
    ),
    service: mapAdminBookingService(readValue(record, "service", "Service")),
    pet: {
      name: readString(petRecord, "name", "Name", "nome", "Nome"),
      species: readString(petRecord, "species", "Species", "especie", "Especie"),
    },
    rejection: mapAdminBookingRejection(
      readNullableObject(record, "rejection", "Rejection"),
    ),
    completion: mapAdminBookingCompletion(
      readNullableObject(record, "completion", "Completion"),
    ),
    cancellation: mapAdminBookingCancellation(
      readNullableObject(record, "cancellation", "Cancellation"),
    ),
    noShow: mapAdminBookingNoShow(readNullableObject(record, "noShow", "NoShow")),
  };
}

function mapAdminBookingDetail(value: unknown): AdminBookingDetail {
  const record = toRecord(value);
  const petRecord = toRecord(readValue(record, "pet", "Pet"));

  return {
    ...mapAdminBookingListItem(record),
    empresaId: readString(record, "empresaId", "EmpresaId"),
    pet: {
      clientId: readString(petRecord, "clientId", "ClientId"),
      name: readString(petRecord, "name", "Name", "nome", "Nome"),
      species: readString(petRecord, "species", "Species", "especie", "Especie"),
    },
  };
}

function mapAdminLoginResponse(value: unknown): AdminSessionSummary {
  const record = toRecord(value);

  return {
    token: readString(record, "token", "Token"),
    userId: readString(record, "userId", "UserId"),
    empresaId: readString(record, "empresaId", "EmpresaId"),
  };
}

function mapAdminCurrentUser(value: unknown): AdminCurrentUser {
  const record = toRecord(value);
  const companyRecord = toRecord(readValue(record, "empresa", "Empresa"));

  return {
    userId: readString(record, "userId", "UserId"),
    email: readString(record, "email", "Email"),
    company: {
      id: readString(companyRecord, "id", "Id"),
      name: readString(companyRecord, "name", "Name", "nome", "Nome"),
    },
  };
}

function mapAdminPublicProfile(value: unknown): AdminPublicProfile {
  const record = toRecord(value);

  return {
    id: readString(record, "id", "Id"),
    name: readString(record, "name", "Name", "nome", "Nome"),
    slug: readString(record, "slug", "Slug"),
    description: readString(record, "description", "Description", "descricao", "Descricao"),
    city: readString(record, "city", "City", "cidade", "Cidade"),
    neighborhood: readString(
      record,
      "neighborhood",
      "Neighborhood",
      "bairro",
      "Bairro",
    ),
    contactSummary: readString(
      record,
      "contactSummary",
      "ContactSummary",
      "resumoContato",
      "ResumoContato",
    ),
    addressSummary: readString(
      record,
      "addressSummary",
      "AddressSummary",
      "resumoEndereco",
      "ResumoEndereco",
    ),
    customDomain: mapAdminCustomDomain(record),
    isPublished: readBoolean(record, "isPublished", "IsPublished", "publica", "Publica"),
  };
}

function mapAdminCustomDomainDnsGuidance(
  record: JsonRecord,
  fallbackMode: AdminCustomDomain["mode"],
): AdminCustomDomain["dnsGuidance"] {
  const guidanceRecord = readNullableObject(
    record,
    "customDomainDnsGuidance",
    "CustomDomainDnsGuidance",
    "dominioPersonalizadoOrientacaoDns",
    "DominioPersonalizadoOrientacaoDns",
  );

  if (!guidanceRecord) {
    return {
      mode: fallbackMode,
      recordType: "none",
      recordName: "",
      zoneDns: "",
      expectedValues: [],
      expectedHostnames: [],
      expectedIps: [],
      primaryInstruction: "",
      secondaryInstruction: null,
      optionalWwwRedirectInstruction: null,
    };
  }

  return {
    mode:
      (readString(guidanceRecord, "mode", "Mode", "modo", "Modo") as AdminCustomDomain["mode"]) ||
      fallbackMode,
    recordType:
      (readString(
        guidanceRecord,
        "recordType",
        "RecordType",
        "tipoRegistro",
        "TipoRegistro",
      ) as AdminCustomDomain["dnsGuidance"]["recordType"]) || "none",
    recordName: readNullableString(
      guidanceRecord,
      "recordName",
      "RecordName",
      "nomeRegistro",
      "NomeRegistro",
    ) ?? "",
    zoneDns: readNullableString(guidanceRecord, "zoneDns", "ZoneDns", "zonaDns", "ZonaDns") ?? "",
    expectedValues: readArray(
      readValue(
        guidanceRecord,
        "expectedValues",
        "ExpectedValues",
        "valoresEsperados",
        "ValoresEsperados",
      ),
    ).filter((value): value is string => typeof value === "string"),
    expectedHostnames: readArray(
      readValue(
        guidanceRecord,
        "expectedHostnames",
        "ExpectedHostnames",
        "hostnamesEsperados",
        "HostnamesEsperados",
      ),
    ).filter((value): value is string => typeof value === "string"),
    expectedIps: readArray(
      readValue(guidanceRecord, "expectedIps", "ExpectedIps", "ipsEsperados", "IpsEsperados"),
    ).filter((value): value is string => typeof value === "string"),
    primaryInstruction:
      readNullableString(
        guidanceRecord,
        "primaryInstruction",
        "PrimaryInstruction",
        "instrucaoPrimaria",
        "InstrucaoPrimaria",
      ) ?? "",
    secondaryInstruction: readNullableString(
      guidanceRecord,
      "secondaryInstruction",
      "SecondaryInstruction",
      "instrucaoSecundaria",
      "InstrucaoSecundaria",
    ),
    optionalWwwRedirectInstruction: readNullableString(
      guidanceRecord,
      "optionalWwwRedirectInstruction",
      "OptionalWwwRedirectInstruction",
      "orientacaoRedirecionamentoWwwOpcional",
      "OrientacaoRedirecionamentoWwwOpcional",
    ),
  };
}

function mapAdminCustomDomain(record: JsonRecord): AdminCustomDomain {
  const mode =
    (readNullableString(
      record,
      "customDomainMode",
      "CustomDomainMode",
      "dominioPersonalizadoModo",
      "DominioPersonalizadoModo",
    ) as AdminCustomDomain["mode"] | null) ?? "none";

  return {
    desiredDomain: readNullableString(
      record,
      "desiredCustomDomain",
      "DesiredCustomDomain",
      "dominioPersonalizadoDesejado",
      "DominioPersonalizadoDesejado",
    ),
    activeDomain: readNullableString(
      record,
      "activeCustomDomain",
      "ActiveCustomDomain",
      "dominioPersonalizadoAtivo",
      "DominioPersonalizadoAtivo",
    ),
    mode,
    dnsGuidance: mapAdminCustomDomainDnsGuidance(record, mode),
    status:
      (readString(
        record,
        "customDomainStatus",
        "CustomDomainStatus",
        "dominioPersonalizadoStatus",
        "DominioPersonalizadoStatus",
      ) as AdminCustomDomain["status"]) || "removed",
    dnsStatus:
      (readString(
        record,
        "customDomainDnsStatus",
        "CustomDomainDnsStatus",
        "dominioPersonalizadoDnsStatus",
        "DominioPersonalizadoDnsStatus",
      ) as AdminCustomDomain["dnsStatus"]) || "removed",
    dnsFailureMessage: readNullableString(
      record,
      "customDomainDnsFailureMessage",
      "CustomDomainDnsFailureMessage",
      "dominioPersonalizadoDnsUltimaFalha",
      "DominioPersonalizadoDnsUltimaFalha",
      "customDomainFailureMessage",
      "CustomDomainFailureMessage",
      "dominioPersonalizadoUltimaFalha",
      "DominioPersonalizadoUltimaFalha",
    ),
    dnsLastAttemptAt: readNullableString(
      record,
      "customDomainDnsLastAttemptAt",
      "CustomDomainDnsLastAttemptAt",
      "dominioPersonalizadoDnsUltimaTentativaEm",
      "DominioPersonalizadoDnsUltimaTentativaEm",
      "customDomainLastAttemptAt",
      "CustomDomainLastAttemptAt",
      "dominioPersonalizadoUltimaTentativaEm",
      "DominioPersonalizadoUltimaTentativaEm",
    ),
    dnsNextRetryAt: readNullableString(
      record,
      "customDomainDnsNextRetryAt",
      "CustomDomainDnsNextRetryAt",
      "dominioPersonalizadoDnsProximaTentativaEm",
      "DominioPersonalizadoDnsProximaTentativaEm",
      "customDomainNextRetryAt",
      "CustomDomainNextRetryAt",
      "dominioPersonalizadoProximaTentativaEm",
      "DominioPersonalizadoProximaTentativaEm",
    ),
    dnsVerifiedAt: readNullableString(
      record,
      "customDomainDnsVerifiedAt",
      "CustomDomainDnsVerifiedAt",
      "dominioPersonalizadoDnsVerificadoEm",
      "DominioPersonalizadoDnsVerificadoEm",
      "customDomainVerifiedAt",
      "CustomDomainVerifiedAt",
      "dominioPersonalizadoVerificadoEm",
      "DominioPersonalizadoVerificadoEm",
    ),
    tlsStatus:
      (readString(
        record,
        "customDomainTlsStatus",
        "CustomDomainTlsStatus",
        "dominioPersonalizadoTlsStatus",
        "DominioPersonalizadoTlsStatus",
      ) as AdminCustomDomain["tlsStatus"]) || "not_started",
    tlsFailureMessage: readNullableString(
      record,
      "customDomainTlsFailureMessage",
      "CustomDomainTlsFailureMessage",
      "dominioPersonalizadoTlsUltimaFalha",
      "DominioPersonalizadoTlsUltimaFalha",
    ),
    tlsProvisioningStartedAt: readNullableString(
      record,
      "customDomainTlsProvisioningStartedAt",
      "CustomDomainTlsProvisioningStartedAt",
      "dominioPersonalizadoTlsProvisionamentoIniciadoEm",
      "DominioPersonalizadoTlsProvisionamentoIniciadoEm",
    ),
    tlsLastAttemptAt: readNullableString(
      record,
      "customDomainTlsLastAttemptAt",
      "CustomDomainTlsLastAttemptAt",
      "dominioPersonalizadoTlsUltimaTentativaEm",
      "DominioPersonalizadoTlsUltimaTentativaEm",
    ),
    tlsNextRetryAt: readNullableString(
      record,
      "customDomainTlsNextRetryAt",
      "CustomDomainTlsNextRetryAt",
      "dominioPersonalizadoTlsProximaTentativaEm",
      "DominioPersonalizadoTlsProximaTentativaEm",
    ),
    httpsReadyAt: readNullableString(
      record,
      "customDomainHttpsReadyAt",
      "CustomDomainHttpsReadyAt",
      "dominioPersonalizadoHttpsProntoEm",
      "DominioPersonalizadoHttpsProntoEm",
    ),
    activatedAt: readNullableString(
      record,
      "customDomainActivatedAt",
      "CustomDomainActivatedAt",
      "dominioPersonalizadoAtivadoEm",
      "DominioPersonalizadoAtivadoEm",
    ),
    revertedToFallback: readBoolean(
      record,
      "customDomainCanonicalRevertedToFallback",
      "CustomDomainCanonicalRevertedToFallback",
      "dominioPersonalizadoCanonicoRevertidoParaFallback",
      "DominioPersonalizadoCanonicoRevertidoParaFallback",
    ),
    lastHealthyMonitoringAt: readNullableString(
      record,
      "customDomainLastHealthyMonitoringAt",
      "CustomDomainLastHealthyMonitoringAt",
      "dominioPersonalizadoUltimoMonitoramentoSaudavelEm",
      "DominioPersonalizadoUltimoMonitoramentoSaudavelEm",
    ),
    lastDegradedMonitoringAt: readNullableString(
      record,
      "customDomainLastDegradedMonitoringAt",
      "CustomDomainLastDegradedMonitoringAt",
      "dominioPersonalizadoUltimoMonitoramentoDegradadoEm",
      "DominioPersonalizadoUltimoMonitoramentoDegradadoEm",
    ),
    lastDegradedMonitoringReason: readNullableString(
      record,
      "customDomainLastDegradedMonitoringReason",
      "CustomDomainLastDegradedMonitoringReason",
      "dominioPersonalizadoUltimoMonitoramentoDegradadoMotivo",
      "DominioPersonalizadoUltimoMonitoramentoDegradadoMotivo",
    ),
    // Notification metadata (latest)
    lastNotificationCategory: readNullableString(
      record,
      "customDomainLastNotificationCategory",
      "CustomDomainLastNotificationCategory",
      "dominioPersonalizadoUltimaNotificacaoCategoria",
      "DominioPersonalizadoUltimaNotificacaoCategoria",
    ),
    lastNotificationReason: readNullableString(
      record,
      "customDomainLastNotificationReason",
      "CustomDomainLastNotificationReason",
      "dominioPersonalizadoUltimaNotificacaoMotivo",
      "DominioPersonalizadoUltimaNotificacaoMotivo",
    ),
    lastNotificationSentAt: readNullableString(
      record,
      "customDomainLastNotificationSentAt",
      "CustomDomainLastNotificationSentAt",
      "dominioPersonalizadoUltimaNotificacaoEnviadaEm",
      "DominioPersonalizadoUltimaNotificacaoEnviadaEm",
    ),
    lastNotificationResult: readNullableString(
      record,
      "customDomainLastNotificationResult",
      "CustomDomainLastNotificationResult",
      "dominioPersonalizadoUltimaNotificacaoResultado",
      "DominioPersonalizadoUltimaNotificacaoResultado",
    ),
    lastNotificationAttempts: readNumber(
      record,
      "customDomainLastNotificationAttempts",
      "CustomDomainLastNotificationAttempts",
      "dominioPersonalizadoUltimaNotificacaoTentativas",
      "DominioPersonalizadoUltimaNotificacaoTentativas",
    ),
  };
}

function mapAdminProfessional(value: unknown): AdminProfessional {
  const record = toRecord(value);

  return {
    id: readString(record, "id", "Id"),
    companyId: readString(record, "companyId", "CompanyId", "empresaId", "EmpresaId"),
    name: readString(record, "name", "Name", "nome", "Nome"),
    specialty: readNullableString(
      record,
      "specialty",
      "Specialty",
      "especialidade",
      "Especialidade",
    ),
    isActive: readBoolean(record, "isActive", "IsActive", "ativo", "Ativo"),
    createdAt: readString(record, "createdAt", "CreatedAt", "criadoEm", "CriadoEm"),
  };
}

function mapAdminService(value: unknown): AdminService {
  const record = toRecord(value);

  return {
    id: readString(record, "id", "Id"),
    companyId: readString(record, "companyId", "CompanyId", "empresaId", "EmpresaId"),
    name: readString(record, "name", "Name", "nome", "Nome"),
    durationMinutes: readNumber(
      record,
      "durationMinutes",
      "DurationMinutes",
      "duracaoMinutos",
      "DuracaoMinutos",
    ),
    basePrice: readNumber(record, "basePrice", "BasePrice", "precoBase", "PrecoBase"),
    isActive: readBoolean(record, "isActive", "IsActive", "ativo", "Ativo"),
    createdAt: readString(record, "createdAt", "CreatedAt", "criadoEm", "CriadoEm"),
  };
}

function mapAdminProfessionalServiceAssignment(
  value: unknown,
): AdminProfessionalServiceAssignment {
  const record = toRecord(value);

  return {
    assignmentId: readString(record, "assignmentId", "AssignmentId", "id", "Id"),
    companyId: readString(record, "companyId", "CompanyId", "empresaId", "EmpresaId"),
    professionalId: readString(
      record,
      "professionalId",
      "ProfessionalId",
      "profissionalId",
      "ProfissionalId",
    ),
    serviceId: readString(record, "serviceId", "ServiceId", "servicoId", "ServicoId"),
    serviceName: readString(record, "serviceName", "ServiceName", "nomeServico", "NomeServico"),
    serviceDurationMinutes: readNumber(
      record,
      "serviceDurationMinutes",
      "ServiceDurationMinutes",
      "duracaoServicoMinutos",
      "DuracaoServicoMinutos",
    ),
    basePrice: readNumber(record, "basePrice", "BasePrice", "precoBase", "PrecoBase"),
    active: readBoolean(record, "active", "Active", "ativo", "Ativo"),
    createdAt: readString(record, "createdAt", "CreatedAt", "criadoEm", "CriadoEm"),
  };
}

function mapAdminProfessionalAvailability(value: unknown): AdminProfessionalAvailability {
  const record = toRecord(value);

  return {
    id: readString(record, "id", "Id"),
    professionalId: readString(
      record,
      "professionalId",
      "ProfessionalId",
      "profissionalId",
      "ProfissionalId",
    ),
    weekday: readNumber(record, "weekday", "Weekday", "diaSemana", "DiaSemana"),
    startTime: readString(record, "startTime", "StartTime", "horaInicio", "HoraInicio"),
    endTime: readString(record, "endTime", "EndTime", "horaFim", "HoraFim"),
    createdAt: readString(record, "createdAt", "CreatedAt", "criadoEm", "CriadoEm"),
  };
}

function buildAuthHeaders(token?: string): HeadersInit | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export const api = {
  async listPublicPetshops(filters: PublicPetshopFilters) {
    const response = await request<
      Array<{
        id: string;
        nome: string;
        slug: string;
        descricao: string;
        cidade: string;
        bairro: string;
        resumoContato: string;
        resumoEndereco: string;
        averageRating: number | null;
        feedbackCount: number | null;
      }>
    >("/petshops/public", {
      cache: "no-store",
      params: {
        nome: filters.query || undefined,
        cidade: filters.city || undefined,
        servico: filters.service || undefined,
        minRating: filters.rating || undefined,
        orderBy: filters.orderBy || undefined,
        orderDirection: filters.orderDirection || undefined,
      },
    });

    return response.map(mapPetshopSummary);
  },

  async getPublicPetshopBySlug(slug: string) {
    const response = await request<{
      id: string;
      nome: string;
      slug: string;
      descricao: string;
      cidade: string;
      bairro: string;
      resumoContato: string;
      resumoEndereco: string;
      averageRating: number | null;
      feedbackCount: number | null;
      profissionais: Array<{
        id: string;
        nome: string;
        especialidade: string | null;
      }>;
      servicos: Array<{
        id: string;
        nome: string;
        duracaoMinutos: number;
        precoBase: number;
      }>;
    }>(`/petshops/public/${slug}`, {
      cache: "no-store",
    });

    return mapPetshopDetail(response);
  },

  async getPublicPetshopByHost(host: string) {
    const response = await request<{
      id: string;
      nome: string;
      slug: string;
      descricao: string;
      cidade: string;
      bairro: string;
      resumoContato: string;
      resumoEndereco: string;
      averageRating: number | null;
      feedbackCount: number | null;
      profissionais: Array<{
        id: string;
        nome: string;
        especialidade: string | null;
      }>;
      servicos: Array<{
        id: string;
        nome: string;
        duracaoMinutos: number;
        precoBase: number;
      }>;
    }>("/petshops/public/by-host", {
      cache: "no-store",
      params: {
        host,
      },
    });

    return mapPetshopDetail(response);
  },

  async getPublicSlots(
    petshopId: string,
    filters: {
      serviceId: string;
      professionalId?: string;
      startDate: string;
      endDate: string;
    },
  ) {
    return request<PublicBookingSlot[]>(`/petshops/${petshopId}/slots`, {
      cache: "no-store",
      params: {
        serviceId: filters.serviceId,
        professionalId: filters.professionalId || undefined,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    });
  },

  createBooking(payload: CreatePublicBookingPayload) {
    return request<{
      id: string;
      state: string;
      bookingStatusAccessToken: string;
      feedbackAccessToken: string;
    }>("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  },

  checkBookingStatus(bookingId: string, statusAccessToken: string) {
    return request<PublicBookingStatus>(`/bookings/${bookingId}/status`, {
      method: "POST",
      body: JSON.stringify({
        statusAccessToken,
      }),
      cache: "no-store",
    });
  },

  checkBookingFeedbackEligibility(
    bookingId: string,
    feedbackAccessToken: string,
  ) {
    return request<PublicBookingFeedbackEligibility>(
      `/bookings/${bookingId}/feedback/eligibility`,
      {
        method: "POST",
        body: JSON.stringify({
          feedbackAccessToken,
        }),
        cache: "no-store",
      },
    );
  },

  submitBookingFeedback(
    bookingId: string,
    payload: CreatePublicBookingFeedbackPayload,
  ) {
    return request<PublicBookingFeedback>(`/bookings/${bookingId}/feedback`, {
      method: "POST",
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  },

  async login(payload: { email: string; password: string }) {
    const response = await request<unknown>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    return mapAdminLoginResponse(response);
  },

  async getAdminMe(token: string) {
    const response = await request<unknown>("/auth/me", {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });

    return mapAdminCurrentUser(response);
  },

  async getAdminPublicProfile(token: string) {
    const response = await request<unknown>("/petshops/public-profile", {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });

    return mapAdminPublicProfile(response);
  },

  async updateAdminPublicProfile(
    payload: {
      slug: string;
      description: string;
      city: string;
      neighborhood: string;
      contactSummary: string;
      addressSummary: string;
      desiredCustomDomain: string;
      isPublished: boolean;
    },
    token: string,
  ) {
    const response = await request<unknown>("/petshops/public-profile", {
      method: "PUT",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify({
        Slug: payload.slug.trim(),
        Descricao: payload.description.trim(),
        Cidade: payload.city.trim(),
        Bairro: payload.neighborhood.trim(),
        ResumoContato: payload.contactSummary.trim(),
        ResumoEndereco: payload.addressSummary.trim(),
        DominioPersonalizadoDesejado: payload.desiredCustomDomain.trim(),
        Publica: payload.isPublished,
      }),
    });

    return mapAdminPublicProfile(response);
  },

  async listAdminProfessionals(token: string) {
    const response = await request<unknown[]>("/professionals", {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });

    return readArray(response).map(mapAdminProfessional);
  },

  async createAdminProfessional(
    payload: {
      name: string;
      specialty?: string;
    },
    token: string,
  ) {
    const response = await request<unknown>("/professionals", {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify({
        Nome: payload.name,
        Especialidade: payload.specialty || undefined,
      }),
    });

    return mapAdminProfessional(response);
  },

  async getAdminProfessionalById(id: string, token: string) {
    const response = await request<unknown>(`/professionals/${id}`, {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });

    return mapAdminProfessional(response);
  },

  async updateAdminProfessional(
    id: string,
    payload: {
      name: string;
      specialty?: string;
    },
    token: string,
  ) {
    const response = await request<unknown>(`/professionals/${id}`, {
      method: "PUT",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify({
        Nome: payload.name,
        Especialidade: payload.specialty || undefined,
      }),
    });

    return mapAdminProfessional(response);
  },

  activateAdminProfessional(id: string, token: string) {
    return request<void>(`/professionals/${id}/activate`, {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });
  },

  deactivateAdminProfessional(id: string, token: string) {
    return request<void>(`/professionals/${id}/deactivate`, {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });
  },

  async listAdminServices(token: string) {
    const response = await request<unknown[]>("/services", {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });

    return readArray(response).map(mapAdminService);
  },

  async createAdminService(
    payload: {
      name: string;
      durationMinutes: number;
      basePrice: number;
    },
    token: string,
  ) {
    const response = await request<unknown>("/services", {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify({
        Nome: payload.name,
        DuracaoMinutos: payload.durationMinutes,
        PrecoBase: payload.basePrice,
      }),
    });

    return mapAdminService(response);
  },

  async updateAdminService(
    id: string,
    payload: {
      name: string;
      durationMinutes: number;
      basePrice: number;
    },
    token: string,
  ) {
    const response = await request<unknown>(`/services/${id}`, {
      method: "PUT",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify({
        Nome: payload.name,
        DuracaoMinutos: payload.durationMinutes,
        PrecoBase: payload.basePrice,
      }),
    });

    return mapAdminService(response);
  },

  activateAdminService(id: string, token: string) {
    return request<void>(`/services/${id}/activate`, {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });
  },

  deactivateAdminService(id: string, token: string) {
    return request<void>(`/services/${id}/deactivate`, {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });
  },

  async listAdminProfessionalServices(professionalId: string, token: string) {
    const response = await request<unknown[]>(`/professionals/${professionalId}/services`, {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });

    return readArray(response).map(mapAdminProfessionalServiceAssignment);
  },

  async createAdminProfessionalServiceAssignment(
    professionalId: string,
    payload: {
      serviceId: string;
    },
    token: string,
  ) {
    const response = await request<unknown>(`/professionals/${professionalId}/services`, {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify({
        ServiceId: payload.serviceId,
      }),
    });

    return mapAdminProfessionalServiceAssignment(response);
  },

  deleteAdminProfessionalServiceAssignment(
    professionalId: string,
    serviceId: string,
    token: string,
  ) {
    return request<void>(`/professionals/${professionalId}/services/${serviceId}`, {
      method: "DELETE",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });
  },

  async listAdminProfessionalAvailability(professionalId: string, token: string) {
    const response = await request<unknown[]>(`/professionals/${professionalId}/availability`, {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });

    return readArray(response).map(mapAdminProfessionalAvailability);
  },

  async createAdminProfessionalAvailability(
    professionalId: string,
    payload: {
      weekday: number;
      startTime: string;
      endTime: string;
    },
    token: string,
  ) {
    const response = await request<unknown>(`/professionals/${professionalId}/availability`, {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify({
        DiaSemana: payload.weekday,
        HoraInicio: payload.startTime,
        HoraFim: payload.endTime,
      }),
    });

    return mapAdminProfessionalAvailability(response);
  },

  async updateAdminProfessionalAvailability(
    professionalId: string,
    availabilityId: string,
    payload: {
      weekday: number;
      startTime: string;
      endTime: string;
    },
    token: string,
  ) {
    const response = await request<unknown>(
      `/professionals/${professionalId}/availability/${availabilityId}`,
      {
        method: "PUT",
        cache: "no-store",
        headers: buildAuthHeaders(token),
        body: JSON.stringify({
          DiaSemana: payload.weekday,
          HoraInicio: payload.startTime,
          HoraFim: payload.endTime,
        }),
      },
    );

    return mapAdminProfessionalAvailability(response);
  },

  deleteAdminProfessionalAvailability(
    professionalId: string,
    availabilityId: string,
    token: string,
  ) {
    return request<void>(`/professionals/${professionalId}/availability/${availabilityId}`, {
      method: "DELETE",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });
  },

  async listAdminBookings(filters: Partial<AdminBookingFilters>, token: string) {
    const response = await request<unknown[]>("/bookings", {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      params: {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        state: filters.state || undefined,
        professionalId: filters.professionalId || undefined,
      },
    });

    return response.map(mapAdminBookingListItem);
  },

  async getAdminFeedbackSummary(token: string) {
    const response = await request<unknown>("/bookings/feedback/summary", {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });

    return mapAdminFeedbackSummary(response);
  },

  async listAdminFeedback(filters: Partial<AdminFeedbackFilters>, token: string) {
    const response = await request<unknown[]>("/bookings/feedback", {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      params: {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        professionalId: filters.professionalId || undefined,
      },
    });

    return readArray(response).map(mapAdminFeedbackEntry);
  },

  async getAdminBookingById(id: string, token: string) {
    const response = await request<unknown>(`/bookings/${id}`, {
      method: "GET",
      cache: "no-store",
      headers: buildAuthHeaders(token),
    });

    return mapAdminBookingDetail(response);
  },

  completeAdminBooking(
    id: string,
    payload: {
      finalChargedPrice: number | null;
    },
    token: string,
  ) {
    return request<unknown>(`/bookings/${id}/complete`, {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  cancelAdminBooking(
    id: string,
    payload: {
      reason: string;
    },
    token: string,
  ) {
    return request<unknown>(`/bookings/${id}/cancel`, {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  noShowAdminBooking(
    id: string,
    payload: {
      reason: string;
    },
    token: string,
  ) {
    return request<unknown>(`/bookings/${id}/no-show`, {
      method: "POST",
      cache: "no-store",
      headers: buildAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },
};

export function getApiBaseUrl() {
  return buildUrl("/");
}
