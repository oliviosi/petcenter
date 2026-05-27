import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Integration test: prove that the real API client (api.getAdminPublicProfile)
 * correctly deserializes monitoring fields from backend responses through the
 * full request → mapAdminPublicProfile → mapAdminCustomDomain path.
 */

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Helper to create a successful mock response
function mockSuccessResponse(body: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as Response);
}

describe("api.getAdminPublicProfile - customDomain monitoring fields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "https://api.test.com";
    vi.resetModules();
  });

  it("deserializes monitoring fields from camelCase backend response", async () => {
    const { api } = await import("@/lib/api");
    const backendResponse = {
      id: "petshop-1",
      name: "Pet Center",
      slug: "pet-center",
      description: "Best pet shop",
      city: "São Paulo",
      neighborhood: "Vila Mariana",
      contactSummary: "11 1234-5678",
      addressSummary: "Rua A, 123",
      isPublished: true,
      customDomainMode: "subdomain",
      desiredCustomDomain: "pets.example.com",
      activeCustomDomain: "pets.example.com",
      customDomainStatus: "active",
      customDomainDnsStatus: "verified",
      customDomainDnsGuidance: {
        mode: "subdomain",
        recordType: "cname",
        recordName: "pets",
        zoneDns: "example.com",
        primaryInstruction: "Add CNAME",
      },
      customDomainTlsStatus: "ready",
      customDomainActivatedAt: "2025-01-15T10:00:00Z",
      customDomainCanonicalRevertedToFallback: true,
      customDomainLastHealthyMonitoringAt: "2025-01-15T11:00:00Z",
      customDomainLastDegradedMonitoringAt: "2025-01-15T12:00:00Z",
      customDomainLastDegradedMonitoringReason: "DNS resolution failed",
    };

    mockFetch.mockReturnValueOnce(mockSuccessResponse(backendResponse));

    const result = await api.getAdminPublicProfile("test-token");

    expect(result.customDomain.revertedToFallback).toBe(true);
    expect(result.customDomain.lastHealthyMonitoringAt).toBe("2025-01-15T11:00:00Z");
    expect(result.customDomain.lastDegradedMonitoringAt).toBe("2025-01-15T12:00:00Z");
    expect(result.customDomain.lastDegradedMonitoringReason).toBe("DNS resolution failed");
  });

  it("deserializes monitoring fields from PascalCase backend response", async () => {
    const { api } = await import("@/lib/api");
    const backendResponse = {
      Id: "petshop-2",
      Nome: "Pet Shop 2",
      Slug: "pet-shop-2",
      Descricao: "Another pet shop",
      Cidade: "Rio de Janeiro",
      Bairro: "Copacabana",
      ResumoContato: "21 9876-5432",
      ResumoEndereco: "Rua B, 456",
      Publica: true,
      CustomDomainMode: "apex",
      DesiredCustomDomain: "example.com",
      ActiveCustomDomain: "example.com",
      CustomDomainStatus: "active",
      CustomDomainDnsStatus: "verified",
      CustomDomainDnsGuidance: {
        Mode: "apex",
        RecordType: "apex_supported_targets",
        RecordName: "@",
        ZoneDns: "example.com",
        PrimaryInstruction: "Add A/AAAA/ALIAS",
      },
      CustomDomainTlsStatus: "ready",
      CustomDomainActivatedAt: "2025-01-15T10:00:00Z",
      CustomDomainCanonicalRevertedToFallback: false,
      CustomDomainLastHealthyMonitoringAt: "2025-01-15T13:00:00Z",
      CustomDomainLastDegradedMonitoringAt: null,
      CustomDomainLastDegradedMonitoringReason: null,
    };

    mockFetch.mockReturnValueOnce(mockSuccessResponse(backendResponse));

    const result = await api.getAdminPublicProfile("test-token");

    expect(result.customDomain.revertedToFallback).toBe(false);
    expect(result.customDomain.lastHealthyMonitoringAt).toBe("2025-01-15T13:00:00Z");
    expect(result.customDomain.lastDegradedMonitoringAt).toBeNull();
    expect(result.customDomain.lastDegradedMonitoringReason).toBeNull();
  });

  it("deserializes monitoring fields from pt-BR backend response", async () => {
    const { api } = await import("@/lib/api");
    const backendResponse = {
      Id: "petshop-3",
      Nome: "Pet Shop Brasil",
      Slug: "pet-shop-brasil",
      Descricao: "Loja de pets",
      Cidade: "Belo Horizonte",
      Bairro: "Savassi",
      ResumoContato: "31 3333-4444",
      ResumoEndereco: "Rua C, 789",
      Publica: false,
      DominioPersonalizadoModo: "subdomain",
      DominioPersonalizadoDesejado: "loja.pet.com",
      DominioPersonalizadoAtivo: "loja.pet.com",
      DominioPersonalizadoStatus: "active",
      DominioPersonalizadoDnsStatus: "verified",
      DominioPersonalizadoOrientacaoDns: {
        Modo: "subdomain",
        TipoRegistro: "cname",
        NomeRegistro: "loja",
        ZonaDns: "pet.com",
        InstrucaoPrimaria: "Adicione CNAME",
      },
      DominioPersonalizadoTlsStatus: "ready",
      DominioPersonalizadoAtivadoEm: "2025-01-15T10:00:00Z",
      DominioPersonalizadoCanonicoRevertidoParaFallback: true,
      DominioPersonalizadoUltimoMonitoramentoSaudavelEm: "2025-01-15T14:00:00Z",
      DominioPersonalizadoUltimoMonitoramentoDegradadoEm: "2025-01-15T15:00:00Z",
      DominioPersonalizadoUltimoMonitoramentoDegradadoMotivo: "Certificado expirado",
    };

    mockFetch.mockReturnValueOnce(mockSuccessResponse(backendResponse));

    const result = await api.getAdminPublicProfile("test-token");

    expect(result.customDomain.revertedToFallback).toBe(true);
    expect(result.customDomain.lastHealthyMonitoringAt).toBe("2025-01-15T14:00:00Z");
    expect(result.customDomain.lastDegradedMonitoringAt).toBe("2025-01-15T15:00:00Z");
    expect(result.customDomain.lastDegradedMonitoringReason).toBe("Certificado expirado");
  });

  it("handles missing monitoring fields gracefully", async () => {
    const { api } = await import("@/lib/api");
    const backendResponse = {
      id: "petshop-4",
      name: "Pet Shop 4",
      slug: "pet-shop-4",
      description: "No custom domain",
      city: "Curitiba",
      neighborhood: "Centro",
      contactSummary: "41 5555-6666",
      addressSummary: "Rua D, 101",
      isPublished: true,
      CustomDomainMode: "none",
      CustomDomainStatus: "removed",
      CustomDomainDnsStatus: "removed",
      CustomDomainDnsGuidance: null,
      CustomDomainTlsStatus: "not_started",
    };

    mockFetch.mockReturnValueOnce(mockSuccessResponse(backendResponse));

    const result = await api.getAdminPublicProfile("test-token");

    // revertedToFallback defaults to false when field is missing
    expect(result.customDomain.revertedToFallback).toBe(false);
    expect(result.customDomain.lastHealthyMonitoringAt).toBeNull();
    expect(result.customDomain.lastDegradedMonitoringAt).toBeNull();
    expect(result.customDomain.lastDegradedMonitoringReason).toBeNull();
  });

  it("deserializes degraded monitoring state through updateAdminPublicProfile", async () => {
    const { api } = await import("@/lib/api");
    const backendResponse = {
      Id: "petshop-5",
      Nome: "Pet Shop Degraded",
      Slug: "pet-shop-degraded",
      Descricao: "Shop with degraded monitoring",
      Cidade: "Porto Alegre",
      Bairro: "Moinhos",
      ResumoContato: "51 7777-8888",
      ResumoEndereco: "Rua E, 202",
      Publica: true,
      CustomDomainMode: "apex",
      DesiredCustomDomain: "example.com",
      ActiveCustomDomain: "example.com",
      CustomDomainStatus: "active",
      CustomDomainDnsStatus: "verified",
      CustomDomainDnsGuidance: {
        Mode: "apex",
        RecordType: "apex_supported_targets",
        RecordName: "@",
        ZoneDns: "example.com",
        PrimaryInstruction: "Configure apex",
      },
      CustomDomainTlsStatus: "ready",
      CustomDomainActivatedAt: "2025-01-10T10:00:00Z",
      CustomDomainCanonicalRevertedToFallback: true,
      CustomDomainLastHealthyMonitoringAt: "2025-01-14T10:00:00Z",
      CustomDomainLastDegradedMonitoringAt: "2025-01-15T17:00:00Z",
      CustomDomainLastDegradedMonitoringReason: "HTTP 5xx error rate exceeded threshold",
    };

    mockFetch.mockReturnValueOnce(mockSuccessResponse(backendResponse));

    const result = await api.updateAdminPublicProfile(
      {
        slug: "pet-shop-degraded",
        description: "Shop with degraded monitoring",
        city: "Porto Alegre",
        neighborhood: "Moinhos",
        contactSummary: "51 7777-8888",
        addressSummary: "Rua E, 202",
        desiredCustomDomain: "example.com",
        isPublished: true,
      },
      "test-token",
    );

    expect(result.customDomain.activatedAt).toBe("2025-01-10T10:00:00Z");
    expect(result.customDomain.revertedToFallback).toBe(true);
    expect(result.customDomain.lastHealthyMonitoringAt).toBe("2025-01-14T10:00:00Z");
    expect(result.customDomain.lastDegradedMonitoringAt).toBe("2025-01-15T17:00:00Z");
    expect(result.customDomain.lastDegradedMonitoringReason).toBe(
      "HTTP 5xx error rate exceeded threshold",
    );
  });
});
