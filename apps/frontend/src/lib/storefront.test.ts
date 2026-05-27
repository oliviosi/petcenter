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
      failureMessage: null,
      lastAttemptAt: null,
      nextRetryAt: null,
      verifiedAt: null,
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
        status: "verifying",
      }),
    );

    expect(canonicalUrl).toBe("https://petcenter.test/petshops/pet-center-vila");
  });

  it("keeps the shared-host link canonical after a recoverable verification failure", () => {
    const canonicalUrl = buildCanonicalStorefrontUrl(
      "https://petcenter.test",
      createProfile({
        activeDomain: "agenda.petcenter-vila.com",
        status: "failed",
      }),
    );

    expect(canonicalUrl).toBe("https://petcenter.test/petshops/pet-center-vila");
  });

  it("switches the canonical link and entry mode only after activation succeeds", () => {
    const profile = createProfile({
      activeDomain: "agenda.petcenter-vila.com",
      status: "active",
    });

    expect(buildCanonicalStorefrontUrl("https://petcenter.test", profile)).toBe(
      "https://agenda.petcenter-vila.com",
    );
    expect(
      getStorefrontEntryMode("agenda.petcenter-vila.com", profile.customDomain),
    ).toBe("custom-domain");
  });
});
