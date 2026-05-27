import type { AdminPublicProfile } from "@/types";

export type StorefrontEntryMode = "shared-host" | "custom-domain";

function trimTrailingSlash(value: string) {
  return value.trim().replace(/\/$/, "");
}

export function normalizeHost(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, "").split(":", 2)[0] ?? "";
}

export function getPreferredProtocol(publicAppOrigin: string) {
  return trimTrailingSlash(publicAppOrigin).startsWith("http://") ? "http:" : "https:";
}

export function getSharedHost(publicAppOrigin: string) {
  const trimmedOrigin = trimTrailingSlash(publicAppOrigin);

  if (!trimmedOrigin) {
    return "";
  }

  return normalizeHost(trimmedOrigin.replace(/^[a-z]+:\/\//i, ""));
}

export function shouldResolveCustomDomainEntry(
  requestHost: string,
  publicAppOrigin: string,
) {
  const sharedHost = getSharedHost(publicAppOrigin);

  if (!sharedHost) {
    return false;
  }

  return normalizeHost(requestHost) !== sharedHost;
}

export function buildSharedStorefrontPath(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  return normalizedSlug ? `/petshops/${normalizedSlug}` : null;
}

export function buildSharedStorefrontUrl(publicAppOrigin: string, slug: string) {
  const storefrontPath = buildSharedStorefrontPath(slug);
  const trimmedOrigin = trimTrailingSlash(publicAppOrigin);

  if (!storefrontPath || !trimmedOrigin) {
    return null;
  }

  return `${trimmedOrigin}${storefrontPath}`;
}

export function buildCustomDomainUrl(publicAppOrigin: string, domain: string | null) {
  if (!domain) {
    return null;
  }

  return `${getPreferredProtocol(publicAppOrigin)}//${normalizeHost(domain)}`;
}

function isActiveCustomDomain(
  customDomain: Pick<AdminPublicProfile["customDomain"], "activeDomain" | "status">,
) {
  return customDomain.status === "active" && Boolean(customDomain.activeDomain);
}

export function isDegradedActive(
  customDomain: Pick<
    AdminPublicProfile["customDomain"],
    "status" | "activeDomain" | "revertedToFallback"
  >,
) {
  return (
    customDomain.status === "active" &&
    !customDomain.activeDomain &&
    customDomain.revertedToFallback
  );
}

export function buildCanonicalStorefrontUrl(
  publicAppOrigin: string,
  profile: Pick<AdminPublicProfile, "slug" | "customDomain">,
) {
  return (
    (isActiveCustomDomain(profile.customDomain)
      ? buildCustomDomainUrl(publicAppOrigin, profile.customDomain.activeDomain)
      : null) ??
    buildSharedStorefrontUrl(publicAppOrigin, profile.slug)
  );
}

export function buildFallbackStorefrontUrl(
  publicAppOrigin: string,
  profile: Pick<AdminPublicProfile, "slug">,
) {
  return buildSharedStorefrontUrl(publicAppOrigin, profile.slug);
}

export function buildPendingCustomDomainUrl(
  publicAppOrigin: string,
  profile: Pick<AdminPublicProfile, "customDomain">,
) {
  return buildCustomDomainUrl(publicAppOrigin, profile.customDomain.desiredDomain);
}

export function buildBookingPath(slug: string, mode: StorefrontEntryMode) {
  return mode === "custom-domain" ? "/book" : `/petshops/${slug}/book`;
}

export function getStorefrontEntryMode(
  requestHost: string,
  customDomain: Pick<AdminPublicProfile["customDomain"], "activeDomain" | "status">,
): StorefrontEntryMode {
  const activeDomain =
    customDomain.status === "active" ? customDomain.activeDomain : null;

  return activeDomain &&
    normalizeHost(activeDomain) === normalizeHost(requestHost)
    ? "custom-domain"
    : "shared-host";
}
