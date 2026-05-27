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
});
