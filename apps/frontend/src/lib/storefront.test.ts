import {
  buildCanonicalStorefrontUrl,
  getStorefrontEntryMode,
} from "@/lib/storefront";
import type { AdminPublicProfile } from "@/types";

function createProfile(
  customDomain: Partial<AdminPublicProfile["customDomain"]>,
): Pick<AdminPublicProfile, "slug" | "customDomain"> {
  return {
    slug: "pet-center-vila",
    customDomain: {
      desiredDomain: "agenda.petcenter-vila.com",
      activeDomain: null,
      mode: "subdomain",
      dnsGuidance: {
        mode: "subdomain",
        recordType: "cname",
        recordName: "agenda",
        zoneDns: "petcenter-vila.com",
        expectedValues: ["petcenter.test"],
        expectedHostnames: ["petcenter.test"],
        expectedIps: [],
        primaryInstruction: "Crie um registro CNAME para 'agenda' apontando para 'petcenter.test'.",
        secondaryInstruction:
          "Depois que o DNS propagar, a verificação e o provisionamento HTTPS continuarão automaticamente.",
        optionalWwwRedirectInstruction: null,
      },
      status: "removed",
      dnsStatus: "removed",
      dnsFailureMessage: null,
      dnsLastAttemptAt: null,
      dnsNextRetryAt: null,
      dnsVerifiedAt: null,
      tlsStatus: "not_started",
      tlsFailureMessage: null,
      tlsProvisioningStartedAt: null,
      tlsLastAttemptAt: null,
      tlsNextRetryAt: null,
      httpsReadyAt: null,
      activatedAt: null,
      revertedToFallback: false,
      lastHealthyMonitoringAt: null,
      lastDegradedMonitoringAt: null,
      lastDegradedMonitoringReason: null,
      ...customDomain,
    },
  };
}

describe("storefront canonical helpers", () => {
  it("keeps the shared-host link canonical while the custom domain is pending", () => {
    const canonicalUrl = buildCanonicalStorefrontUrl(
      "https://petcenter.test",
      createProfile({
        activeDomain: "agenda.petcenter-vila.com",
        status: "provisioning_tls",
        dnsStatus: "verified",
        tlsStatus: "provisioning",
      }),
    );

    expect(canonicalUrl).toBe("https://petcenter.test/petshops/pet-center-vila");
  });

  it("keeps the shared-host link canonical after a recoverable certificate failure", () => {
    const canonicalUrl = buildCanonicalStorefrontUrl(
      "https://petcenter.test",
      createProfile({
        activeDomain: "agenda.petcenter-vila.com",
        status: "tls_failed",
        dnsStatus: "verified",
        tlsStatus: "failed",
      }),
    );

    expect(canonicalUrl).toBe("https://petcenter.test/petshops/pet-center-vila");
  });

  it("switches the canonical link and entry mode only after activation succeeds", () => {
    const profile = createProfile({
      activeDomain: "agenda.petcenter-vila.com",
      status: "active",
      dnsStatus: "verified",
      tlsStatus: "ready",
    });

    expect(buildCanonicalStorefrontUrl("https://petcenter.test", profile)).toBe(
      "https://agenda.petcenter-vila.com",
    );
    expect(
      getStorefrontEntryMode("agenda.petcenter-vila.com", profile.customDomain),
    ).toBe("custom-domain");
  });

  it("keeps the shared-host link canonical while an apex domain is still provisioning", () => {
    const canonicalUrl = buildCanonicalStorefrontUrl(
      "https://petcenter.test",
      createProfile({
        desiredDomain: "petcenter-vila.com.br",
        activeDomain: "petcenter-vila.com.br",
        mode: "apex",
        dnsGuidance: {
          mode: "apex",
          recordType: "apex_supported_targets",
          recordName: "@",
          zoneDns: "petcenter-vila.com.br",
          expectedValues: ["198.51.100.10", "apex.storefront.petcenter.local"],
          expectedHostnames: ["apex.storefront.petcenter.local"],
          expectedIps: ["198.51.100.10"],
          primaryInstruction:
            "Configure o domínio raiz para resolver para um dos destinos apex suportados.",
          secondaryInstruction:
            "Use registros A/AAAA com os IPs informados ou, se seu provedor suportar ALIAS/ANAME/flattening, faça o domínio raiz resolver para um dos hostnames esperados.",
          optionalWwwRedirectInstruction:
            "Opcionalmente, você pode redirecionar 'www.petcenter-vila.com.br' para 'petcenter-vila.com.br', mas isso não é obrigatório para ativação.",
        },
        status: "provisioning_tls",
        dnsStatus: "verified",
        tlsStatus: "provisioning",
      }),
    );

    expect(canonicalUrl).toBe("https://petcenter.test/petshops/pet-center-vila");
  });

  it("activates canonical entry for an apex domain with the same active-domain rule", () => {
    const profile = createProfile({
      desiredDomain: "petcenter-vila.com.br",
      activeDomain: "petcenter-vila.com.br",
      mode: "apex",
      dnsGuidance: {
        mode: "apex",
        recordType: "apex_supported_targets",
        recordName: "@",
        zoneDns: "petcenter-vila.com.br",
        expectedValues: ["198.51.100.10", "apex.storefront.petcenter.local"],
        expectedHostnames: ["apex.storefront.petcenter.local"],
        expectedIps: ["198.51.100.10"],
        primaryInstruction:
          "Configure o domínio raiz para resolver para um dos destinos apex suportados.",
        secondaryInstruction:
          "Use registros A/AAAA com os IPs informados ou, se seu provedor suportar ALIAS/ANAME/flattening, faça o domínio raiz resolver para um dos hostnames esperados.",
        optionalWwwRedirectInstruction:
          "Opcionalmente, você pode redirecionar 'www.petcenter-vila.com.br' para 'petcenter-vila.com.br', mas isso não é obrigatório para ativação.",
      },
      status: "active",
      dnsStatus: "verified",
      tlsStatus: "ready",
    });

    expect(buildCanonicalStorefrontUrl("https://petcenter.test", profile)).toBe(
      "https://petcenter-vila.com.br",
    );
    expect(
      getStorefrontEntryMode("petcenter-vila.com.br", profile.customDomain),
    ).toBe("custom-domain");
  });

  it("reverts canonical link to shared-host fallback when a previously active domain becomes degraded", () => {
    const profile = createProfile({
      desiredDomain: "agenda.petcenter-vila.com",
      activeDomain: null,
      status: "active",
      dnsStatus: "verified",
      tlsStatus: "ready",
      revertedToFallback: true,
      lastHealthyMonitoringAt: "2024-01-10T10:00:00Z",
      lastDegradedMonitoringAt: "2024-01-15T14:30:00Z",
      lastDegradedMonitoringReason: "DNS resolution failed",
    });

    expect(buildCanonicalStorefrontUrl("https://petcenter.test", profile)).toBe(
      "https://petcenter.test/petshops/pet-center-vila",
    );
    expect(
      getStorefrontEntryMode("agenda.petcenter-vila.com", profile.customDomain),
    ).toBe("shared-host");
  });

  it("restores canonical link to custom domain after recovery from degraded state", () => {
    const profile = createProfile({
      desiredDomain: "agenda.petcenter-vila.com",
      activeDomain: "agenda.petcenter-vila.com",
      status: "active",
      dnsStatus: "verified",
      tlsStatus: "ready",
      revertedToFallback: false,
      lastHealthyMonitoringAt: "2024-01-16T09:00:00Z",
      lastDegradedMonitoringAt: "2024-01-15T14:30:00Z",
      lastDegradedMonitoringReason: null,
    });

    expect(buildCanonicalStorefrontUrl("https://petcenter.test", profile)).toBe(
      "https://agenda.petcenter-vila.com",
    );
    expect(
      getStorefrontEntryMode("agenda.petcenter-vila.com", profile.customDomain),
    ).toBe("custom-domain");
  });

  it("treats degraded apex domain the same as degraded subdomain", () => {
    const profile = createProfile({
      desiredDomain: "petcenter-vila.com.br",
      activeDomain: null,
      mode: "apex",
      status: "active",
      dnsStatus: "verified",
      tlsStatus: "ready",
      revertedToFallback: true,
      lastDegradedMonitoringAt: "2024-01-15T14:30:00Z",
      lastDegradedMonitoringReason: "HTTPS certificate expired",
    });

    expect(buildCanonicalStorefrontUrl("https://petcenter.test", profile)).toBe(
      "https://petcenter.test/petshops/pet-center-vila",
    );
    expect(
      getStorefrontEntryMode("petcenter-vila.com.br", profile.customDomain),
    ).toBe("shared-host");
  });
});
