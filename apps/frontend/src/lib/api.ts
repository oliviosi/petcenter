import type {
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
  const response = await fetch(withQuery(path, options?.params), {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
  });

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
};

export function getApiBaseUrl() {
  return buildUrl("/");
}
