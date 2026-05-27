"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Link2,
  Store,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SetupNotice } from "@/components/AdminSetup/SetupNotice";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  adminPublicProfileSchema,
  type AdminPublicProfileValues,
} from "@/lib/validations/adminPublicProfile";
import {
  buildCanonicalStorefrontUrl,
  buildFallbackStorefrontUrl,
  buildPendingCustomDomainUrl,
  getSharedHost,
  normalizeHost,
} from "@/lib/storefront";
import type {
  AdminCustomDomain,
  AdminMutationResult,
  AdminPublicProfile,
} from "@/types";

interface PublicProfilePageClientProps {
  profile: AdminPublicProfile;
  updatePublicProfileAction: (
    values: AdminPublicProfileValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminPublicProfileValues, string>>>;
}

interface FeedbackState {
  tone: "success" | "danger";
  message: string;
}

interface StorefrontLinkState {
  kind: "active" | "preview" | "unavailable";
  badge: {
    tone: "success" | "warning" | "neutral";
    label: string;
  };
  title: string;
  description: string;
}

interface DomainOnboardingState {
  badge: {
    tone: "success" | "warning" | "danger" | "neutral";
    label: string;
  };
  title: string;
  description: string;
  guidance: string;
  latestOutcome: string;
  retryGuidance: string;
}

interface DomainStageState {
  key: "dns" | "tls";
  eyebrow: string;
  title: string;
  description: string;
  badge: {
    tone: "success" | "warning" | "danger" | "neutral";
    label: string;
  };
  metadata: Array<{
    label: string;
    value: string;
  }>;
}

const publicationRequirements = [
  { field: "slug", label: "Slug da vitrine" },
  { field: "description", label: "Descrição" },
  { field: "city", label: "Cidade" },
  { field: "neighborhood", label: "Bairro" },
  { field: "contactSummary", label: "Resumo de contato" },
  { field: "addressSummary", label: "Resumo de endereço" },
] satisfies Array<{
  field: keyof Pick<
    AdminPublicProfileValues,
    "slug" | "description" | "city" | "neighborhood" | "contactSummary" | "addressSummary"
  >;
  label: string;
}>;

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const countryCodeSecondLevelDomains = new Set([
  "com",
  "net",
  "org",
  "gov",
  "edu",
  "mil",
  "co",
]);

function formatDateTimeLabel(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return fallback;
  }

  return dateTimeFormatter.format(parsedValue);
}

function toDefaultValues(profile: AdminPublicProfile): AdminPublicProfileValues {
  return {
    slug: profile.slug,
    description: profile.description,
    city: profile.city,
    neighborhood: profile.neighborhood,
    contactSummary: profile.contactSummary,
    addressSummary: profile.addressSummary,
    desiredCustomDomain: profile.customDomain.desiredDomain ?? "",
    isPublished: profile.isPublished,
  };
}

function createEmptyDnsGuidance(
  mode: AdminCustomDomain["mode"] = "none",
): AdminCustomDomain["dnsGuidance"] {
  return {
    mode,
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

function createEmptyCustomDomain(): AdminCustomDomain {
  return {
    desiredDomain: null,
    activeDomain: null,
    mode: "none",
    dnsGuidance: createEmptyDnsGuidance(),
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
  };
}

function analyzeCustomDomain(domain: string | null) {
  const normalizedDomain = domain ? normalizeHost(domain) : "";

  if (!normalizedDomain) {
    return {
      normalizedDomain: "",
      mode: "none" as const,
      zoneDns: "",
      recordName: "",
    };
  }

  const labels = normalizedDomain.split(".").filter(Boolean);

  if (labels.length < 2) {
    return {
      normalizedDomain,
      mode: "none" as const,
      zoneDns: normalizedDomain,
      recordName: "",
    };
  }

  const topLevelDomain = labels.at(-1) ?? "";
  const secondLevelDomain = labels.at(-2) ?? "";
  const publicSuffixLength =
    topLevelDomain.length === 2 && countryCodeSecondLevelDomains.has(secondLevelDomain)
      ? 2
      : 1;
  const registrableLabelCount = publicSuffixLength + 1;
  const zoneLabels = labels.slice(-registrableLabelCount);
  const recordLabels = labels.slice(0, -registrableLabelCount);

  return {
    normalizedDomain,
    mode: (recordLabels.length === 0 ? "apex" : "subdomain") as AdminCustomDomain["mode"],
    zoneDns: zoneLabels.join("."),
    recordName: recordLabels.join(".") || "@",
  };
}

function buildLocalDnsGuidance(
  domain: string | null,
  publicAppOrigin: string,
): AdminCustomDomain["dnsGuidance"] {
  const analysis = analyzeCustomDomain(domain);

  if (analysis.mode === "none") {
    return createEmptyDnsGuidance();
  }

  const sharedHost = getSharedHost(publicAppOrigin);

  if (analysis.mode === "subdomain") {
    return {
      mode: "subdomain",
      recordType: "cname",
      recordName: analysis.recordName,
      zoneDns: analysis.zoneDns,
      expectedValues: sharedHost ? [sharedHost] : [],
      expectedHostnames: sharedHost ? [sharedHost] : [],
      expectedIps: [],
      primaryInstruction: sharedHost
        ? `Crie um registro CNAME para '${analysis.recordName}' apontando para '${sharedHost}'.`
        : "Defina a URL pública da aplicação para exibir o destino CNAME esperado.",
      secondaryInstruction:
        "Depois que o DNS propagar, a verificação e o provisionamento HTTPS continuarão automaticamente.",
      optionalWwwRedirectInstruction: null,
    };
  }

  return {
    mode: "apex",
    recordType: "apex_supported_targets",
    recordName: "@",
    zoneDns: analysis.zoneDns,
    expectedValues: [],
    expectedHostnames: [],
    expectedIps: [],
    primaryInstruction:
      "Configure o domínio raiz para resolver para um dos destinos apex suportados.",
    secondaryInstruction:
      "Salve o domínio para carregar os destinos suportados pela plataforma e escolher entre A/AAAA direto ou ALIAS/ANAME/flattening no provedor DNS.",
    optionalWwwRedirectInstruction: analysis.zoneDns
      ? `Opcionalmente, você pode redirecionar 'www.${analysis.zoneDns}' para '${analysis.zoneDns}', mas isso não é obrigatório para ativação.`
      : null,
  };
}

function getDomainModeLabel(mode: AdminCustomDomain["mode"]) {
  switch (mode) {
    case "apex":
      return "Domínio raiz";
    case "subdomain":
      return "Subdomínio";
    default:
      return "Host compartilhado";
  }
}

function getRecordTypeLabel(
  recordType: AdminCustomDomain["dnsGuidance"]["recordType"],
  mode: AdminCustomDomain["mode"],
) {
  if (recordType === "cname") {
    return "CNAME";
  }

  if (recordType === "apex_supported_targets") {
    return "A/AAAA ou ALIAS/ANAME";
  }

  return mode === "apex" ? "A/AAAA ou ALIAS/ANAME" : "CNAME";
}

function getEffectiveDnsGuidance(
  customDomain: AdminCustomDomain,
  publicAppOrigin: string,
): AdminCustomDomain["dnsGuidance"] {
  if (
    customDomain.dnsGuidance.recordType !== "none" ||
    customDomain.dnsGuidance.primaryInstruction
  ) {
    return customDomain.dnsGuidance;
  }

  if (!customDomain.desiredDomain) {
    return customDomain.dnsGuidance;
  }

  return buildLocalDnsGuidance(customDomain.desiredDomain, publicAppOrigin);
}

function getEffectiveCustomDomain(
  profile: AdminPublicProfile,
  desiredCustomDomain: string | null,
): AdminCustomDomain {
  if (desiredCustomDomain === profile.customDomain.desiredDomain) {
    return profile.customDomain;
  }

  if (desiredCustomDomain) {
    const analysis = analyzeCustomDomain(desiredCustomDomain);

    return {
      ...createEmptyCustomDomain(),
      desiredDomain: desiredCustomDomain,
      mode: analysis.mode,
      dnsGuidance: createEmptyDnsGuidance(analysis.mode),
      status: "pending_setup",
      dnsStatus: "pending_setup",
    };
  }

  return createEmptyCustomDomain();
}

function getDomainOnboardingState(
  customDomain: AdminCustomDomain,
  dnsGuidance: AdminCustomDomain["dnsGuidance"],
  fallbackStorefrontLink: string | null,
): DomainOnboardingState {
  const dnsExpectationCopy =
    dnsGuidance.recordType === "apex_supported_targets"
      ? "os destinos apex suportados"
      : "a configuração CNAME esperada";

  switch (customDomain.status) {
    case "active":
      if (!customDomain.activeDomain && customDomain.revertedToFallback) {
        return {
          badge: { tone: "danger", label: "Degradado" },
          title: "Domínio estava ativo mas perdeu prontidão",
          description:
            customDomain.lastDegradedMonitoringReason ??
            "O monitoramento pós-ativação detectou que o domínio não está mais totalmente pronto. O DNS pode ter mudado, o HTTPS pode ter expirado, ou a plataforma não consegue mais servir esse hostname com segurança.",
          guidance: fallbackStorefrontLink
            ? "O link hospedado pela petcenter voltou a ser o endereço canônico até a recuperação automática restaurar o domínio próprio."
            : "Defina um slug válido para manter um fallback compartilhável enquanto o domínio está sendo recuperado.",
          latestOutcome:
            customDomain.lastHealthyMonitoringAt && customDomain.lastDegradedMonitoringAt
              ? `Última checagem saudável em ${formatDateTimeLabel(customDomain.lastHealthyMonitoringAt, "instante não informado")}. Degradação detectada em ${formatDateTimeLabel(customDomain.lastDegradedMonitoringAt, "instante não informado")}.`
              : customDomain.lastDegradedMonitoringAt
                ? `Degradação detectada em ${formatDateTimeLabel(customDomain.lastDegradedMonitoringAt, "instante não informado")}.`
                : "O domínio estava ativo mas o monitoramento detectou regressão na prontidão.",
          retryGuidance:
            "A plataforma continua monitorando automaticamente. Quando o DNS e o HTTPS voltarem a estar totalmente prontos, o domínio próprio volta a ser canônico sem necessidade de configuração manual.",
        };
      }

      return {
        badge: { tone: "success", label: "Ativo" },
        title: "Domínio personalizado ativo",
        description:
          "O DNS e o HTTPS já foram concluídos. O domínio próprio assumiu a entrada canônica da vitrine.",
        guidance:
          "A partir de agora, o petshop deve compartilhar o domínio próprio como link principal.",
        latestOutcome: customDomain.httpsReadyAt
          ? `HTTPS liberado em ${formatDateTimeLabel(customDomain.httpsReadyAt, "instante não informado")}.`
          : "HTTPS pronto e domínio liberado para uso.",
        retryGuidance: customDomain.activatedAt
          ? `Ativação registrada em ${formatDateTimeLabel(customDomain.activatedAt, "instante não informado")}.`
          : "Não há novas tentativas agendadas porque o domínio já está ativo.",
      };
    case "provisioning_tls":
      return {
        badge: { tone: "warning", label: "TLS em andamento" },
        title: "DNS concluído, aguardando certificado",
        description:
          "O DNS já foi validado, mas o domínio ainda espera a conclusão do certificado e da prontidão HTTPS antes da troca canônica.",
        guidance: fallbackStorefrontLink
          ? "Continue compartilhando o link hospedado pela petcenter até o HTTPS ficar pronto."
          : "Finalize o slug da vitrine para manter um fallback compartilhável enquanto o certificado é emitido.",
        latestOutcome: customDomain.dnsVerifiedAt
          ? `DNS validado em ${formatDateTimeLabel(customDomain.dnsVerifiedAt, "instante não informado")}.`
          : "O DNS já foi reconhecido e o HTTPS entrou na fila de liberação.",
        retryGuidance: customDomain.tlsNextRetryAt
          ? `Se o certificado ainda não estiver pronto, a próxima checagem HTTPS está prevista para ${formatDateTimeLabel(customDomain.tlsNextRetryAt, "instante não informado")}.`
          : "A plataforma continua acompanhando automaticamente a prontidão HTTPS.",
      };
    case "tls_failed":
      return {
        badge: { tone: "danger", label: "Bloqueado pelo certificado" },
        title: "O certificado ainda não ficou pronto",
        description:
          customDomain.tlsFailureMessage ??
          "O DNS já está correto, mas a última checagem HTTPS ainda não conseguiu liberar o domínio com segurança.",
        guidance: fallbackStorefrontLink
          ? "O host compartilhado continua como endereço canônico até a recuperação automática do certificado."
          : "Defina um slug válido para restaurar o fallback compartilhável enquanto o certificado é recuperado.",
        latestOutcome: customDomain.tlsLastAttemptAt
          ? `Última tentativa HTTPS em ${formatDateTimeLabel(customDomain.tlsLastAttemptAt, "instante não informado")}.`
          : "A plataforma registrou uma falha recuperável na etapa de certificado.",
        retryGuidance: customDomain.tlsNextRetryAt
          ? `Depois de corrigir o bloqueio, aguarde a próxima checagem HTTPS em ${formatDateTimeLabel(customDomain.tlsNextRetryAt, "instante não informado")}.`
          : "Depois de corrigir o bloqueio, aguarde uma nova checagem automática ou salve o domínio novamente.",
      };
    case "verifying_dns":
      return {
        badge: { tone: "warning", label: "Verificando DNS" },
        title: "Verificação automática do DNS em andamento",
        description:
          "A plataforma já está executando checagens automáticas e só libera o domínio quando o DNS resolver para a configuração esperada.",
        guidance: fallbackStorefrontLink
          ? "Enquanto a automação não conclui o DNS, continue compartilhando o link hospedado pela petcenter."
          : "Finalize o slug da vitrine para manter um fallback compartilhável durante a verificação do DNS.",
        latestOutcome: customDomain.dnsLastAttemptAt
          ? `Última checagem DNS em ${formatDateTimeLabel(customDomain.dnsLastAttemptAt, "instante não informado")}.`
          : "A primeira checagem DNS será executada assim que o domínio estiver elegível.",
        retryGuidance: customDomain.dnsNextRetryAt
          ? `Se o DNS ainda não estiver pronto, a próxima tentativa automática está prevista para ${formatDateTimeLabel(customDomain.dnsNextRetryAt, "instante não informado")}.`
          : "A automação continua tentando em novas janelas de verificação.",
      };
    case "dns_failed":
      return {
        badge: { tone: "danger", label: "Falha de DNS" },
        title: "A última checagem DNS não conseguiu liberar o domínio",
        description:
          customDomain.dnsFailureMessage ??
          `A checagem automática ainda não encontrou ${dnsExpectationCopy}. Revise o DNS e aguarde a propagação.`,
        guidance: fallbackStorefrontLink
          ? "O link hospedado pela petcenter continua como endereço canônico até a automação recuperar o DNS."
          : "Defina um slug válido para restaurar o fallback compartilhável enquanto o DNS é corrigido.",
        latestOutcome: customDomain.dnsLastAttemptAt
          ? `Última tentativa DNS em ${formatDateTimeLabel(customDomain.dnsLastAttemptAt, "instante não informado")}.`
          : "A plataforma registrou uma falha recente na etapa de DNS.",
        retryGuidance: customDomain.dnsNextRetryAt
          ? `Depois de corrigir o DNS, aguarde a próxima tentativa automática em ${formatDateTimeLabel(customDomain.dnsNextRetryAt, "instante não informado")}.`
          : "Depois de corrigir o DNS, aguarde uma nova tentativa automática ou salve o domínio novamente.",
      };
    case "pending_setup":
      return {
        badge: { tone: "warning", label: "DNS pendente" },
        title: "Aguardando configuração inicial do DNS",
        description:
          dnsGuidance.recordType === "apex_supported_targets"
            ? "O domínio raiz já foi salvo, mas a automação só consegue ativá-lo quando ele resolver para um dos destinos apex suportados."
            : "O domínio desejado já foi salvo, mas a automação só consegue ativá-lo quando o CNAME apontar para o destino esperado.",
        guidance: fallbackStorefrontLink
          ? "Compartilhe o link hospedado pela petcenter até o domínio personalizado ficar pronto."
          : "Defina um slug para manter um link fallback enquanto o domínio ainda está em preparação.",
        latestOutcome: customDomain.dnsLastAttemptAt
          ? `Última checagem DNS em ${formatDateTimeLabel(customDomain.dnsLastAttemptAt, "instante não informado")}.`
          : "Ainda não existe uma verificação concluída para este domínio.",
        retryGuidance: customDomain.dnsNextRetryAt
          ? `A próxima tentativa automática está prevista para ${formatDateTimeLabel(customDomain.dnsNextRetryAt, "instante não informado")}.`
          : "Assim que o DNS estiver correto, a plataforma continua o fluxo automaticamente.",
      };
    default:
      return {
        badge: { tone: "neutral", label: "Fallback compartilhado" },
        title: "Nenhum domínio personalizado cadastrado",
        description:
          "A vitrine continua usando o host compartilhado da petcenter como entrada pública padrão.",
        guidance:
          "Cadastre um domínio ou subdomínio quando quiser migrar a vitrine para uma URL própria.",
        latestOutcome: "Sem automação de domínio ativa no momento.",
        retryGuidance: "Quando um domínio for salvo, a plataforma agenda as verificações automaticamente.",
      };
  }
}

function getDomainStageStates(
  customDomain: AdminCustomDomain,
  dnsGuidance: AdminCustomDomain["dnsGuidance"],
): DomainStageState[] {
  const dnsStage: DomainStageState = (() => {
    const dnsValidatedDescription =
      dnsGuidance.recordType === "apex_supported_targets"
        ? "O domínio raiz já resolve para um dos destinos apex suportados. A etapa de certificado pode seguir."
        : "O CNAME já aponta corretamente para a petcenter. A etapa de certificado pode seguir.";
    const dnsFailedDescription =
      customDomain.dnsFailureMessage ??
      (dnsGuidance.recordType === "apex_supported_targets"
        ? "Ainda não encontramos um destino apex suportado para liberar a próxima etapa."
        : "Ainda não encontramos o CNAME esperado para liberar a próxima etapa.");
    const dnsVerifyingDescription =
      dnsGuidance.recordType === "apex_supported_targets"
        ? "A plataforma está checando automaticamente se o domínio raiz já resolve para um destino apex suportado."
        : "A plataforma está checando automaticamente se o CNAME já aponta para o destino esperado.";
    const dnsPendingDescription =
      dnsGuidance.recordType === "apex_supported_targets"
        ? "Configure o domínio raiz com um destino apex suportado para que a plataforma consiga iniciar a validação automática."
        : "Configure o registro CNAME para que a plataforma consiga iniciar a validação automática.";

    switch (customDomain.dnsStatus) {
      case "verified":
        return {
          key: "dns",
          eyebrow: "Etapa 1 · DNS",
          title: "DNS validado",
          description: dnsValidatedDescription,
          badge: { tone: "success", label: "Concluído" },
          metadata: [
            {
              label: "Verificado em",
              value: formatDateTimeLabel(
                customDomain.dnsVerifiedAt,
                "Instante não informado",
              ),
            },
            {
              label: "Última checagem",
              value: formatDateTimeLabel(
                customDomain.dnsLastAttemptAt,
                "Instante não informado",
              ),
            },
          ],
        };
      case "failed":
        return {
          key: "dns",
          eyebrow: "Etapa 1 · DNS",
          title: "DNS com falha recuperável",
          description: dnsFailedDescription,
          badge: { tone: "danger", label: "Falha recuperável" },
          metadata: [
            {
              label: "Última tentativa",
              value: formatDateTimeLabel(
                customDomain.dnsLastAttemptAt,
                "Ainda não executada",
              ),
            },
            {
              label: "Próxima tentativa",
              value: formatDateTimeLabel(
                customDomain.dnsNextRetryAt,
                "Aguardando nova janela automática",
              ),
            },
          ],
        };
      case "verifying":
        return {
          key: "dns",
          eyebrow: "Etapa 1 · DNS",
          title: "Verificação DNS em andamento",
          description: dnsVerifyingDescription,
          badge: { tone: "warning", label: "Em andamento" },
          metadata: [
            {
              label: "Última checagem",
              value: formatDateTimeLabel(
                customDomain.dnsLastAttemptAt,
                "Ainda não executada",
              ),
            },
            {
              label: "Próxima tentativa",
              value: formatDateTimeLabel(
                customDomain.dnsNextRetryAt,
                "Aguardando nova janela automática",
              ),
            },
          ],
        };
      default:
        return {
          key: "dns",
          eyebrow: "Etapa 1 · DNS",
          title: "Aguardando configuração do DNS",
          description: dnsPendingDescription,
          badge: { tone: "warning", label: "Pendente" },
          metadata: [
            {
              label: "Última checagem",
              value: formatDateTimeLabel(
                customDomain.dnsLastAttemptAt,
                "Ainda não executada",
              ),
            },
            {
              label: "Próxima tentativa",
              value: formatDateTimeLabel(
                customDomain.dnsNextRetryAt,
                "Será exibida após a primeira checagem",
              ),
            },
          ],
        };
    }
  })();

  const tlsStage: DomainStageState = (() => {
    if (customDomain.dnsStatus !== "verified") {
      return {
        key: "tls",
        eyebrow: "Etapa 2 · HTTPS/TLS",
        title: "TLS aguardando conclusão do DNS",
        description:
          "A emissão do certificado só começa depois que o DNS da etapa anterior for validado.",
        badge: { tone: "neutral", label: "Aguardando DNS" },
        metadata: [
          {
            label: "Provisionamento iniciado em",
            value: formatDateTimeLabel(
              customDomain.tlsProvisioningStartedAt,
              "Ainda não iniciado",
            ),
          },
          {
            label: "HTTPS pronto em",
            value: formatDateTimeLabel(customDomain.httpsReadyAt, "Ainda não liberado"),
          },
        ],
      };
    }

    switch (customDomain.tlsStatus) {
      case "ready":
        return {
          key: "tls",
          eyebrow: "Etapa 2 · HTTPS/TLS",
          title: "Certificado pronto",
          description:
            "O domínio já responde com HTTPS e pode assumir a URL canônica quando a ativação for aplicada.",
          badge: { tone: "success", label: "Concluído" },
          metadata: [
            {
              label: "Provisionamento iniciado em",
              value: formatDateTimeLabel(
                customDomain.tlsProvisioningStartedAt,
                "Instante não informado",
              ),
            },
            {
              label: "HTTPS pronto em",
              value: formatDateTimeLabel(
                customDomain.httpsReadyAt,
                "Instante não informado",
              ),
            },
          ],
        };
      case "failed":
        return {
          key: "tls",
          eyebrow: "Etapa 2 · HTTPS/TLS",
          title: "Bloqueado pelo certificado",
          description:
            customDomain.tlsFailureMessage ??
            "A última checagem HTTPS não conseguiu confirmar o certificado do domínio.",
          badge: { tone: "danger", label: "Falha recuperável" },
          metadata: [
            {
              label: "Última tentativa",
              value: formatDateTimeLabel(
                customDomain.tlsLastAttemptAt,
                "Ainda não executada",
              ),
            },
            {
              label: "Próxima tentativa",
              value: formatDateTimeLabel(
                customDomain.tlsNextRetryAt,
                "Aguardando nova janela automática",
              ),
            },
          ],
        };
      case "provisioning":
        return {
          key: "tls",
          eyebrow: "Etapa 2 · HTTPS/TLS",
          title: "Certificado em provisão",
          description:
            "O DNS já passou. Agora a plataforma acompanha a emissão do certificado e só troca o link canônico quando o HTTPS estiver pronto.",
          badge: { tone: "warning", label: "Em andamento" },
          metadata: [
            {
              label: "Provisionamento iniciado em",
              value: formatDateTimeLabel(
                customDomain.tlsProvisioningStartedAt,
                "Instante não informado",
              ),
            },
            {
              label: "Próxima checagem HTTPS",
              value: formatDateTimeLabel(
                customDomain.tlsNextRetryAt,
                "Aguardando nova janela automática",
              ),
            },
          ],
        };
      default:
        return {
          key: "tls",
          eyebrow: "Etapa 2 · HTTPS/TLS",
          title: "TLS aguardando início",
          description:
            "O DNS já foi validado. A próxima etapa é liberar o certificado e a prontidão HTTPS.",
          badge: { tone: "warning", label: "Pendente" },
          metadata: [
            {
              label: "Provisionamento iniciado em",
              value: formatDateTimeLabel(
                customDomain.tlsProvisioningStartedAt,
                "Ainda não iniciado",
              ),
            },
            {
              label: "Última checagem HTTPS",
              value: formatDateTimeLabel(
                customDomain.tlsLastAttemptAt,
                "Ainda não executada",
              ),
            },
          ],
        };
    }
  })();

  return [dnsStage, tlsStage];
}

function getStorefrontLinkState(args: {
  canonicalStorefrontLink: string | null;
  fallbackStorefrontLink: string | null;
  customDomain: AdminCustomDomain;
  isPublished: boolean;
  missingRequirementsCount: number;
}): StorefrontLinkState {
  const {
    canonicalStorefrontLink,
    fallbackStorefrontLink,
    customDomain,
    isPublished,
    missingRequirementsCount,
  } = args;

  if (!canonicalStorefrontLink) {
    return {
      kind: "unavailable",
      badge: { tone: "neutral", label: "Indisponível" },
      title: "Defina um slug ou ative um domínio para gerar o link canônico",
      description:
        "A vitrine precisa de um slug compartilhado ou de um domínio personalizado ativo para exibir a URL principal.",
    };
  }

  if (isPublished && missingRequirementsCount === 0) {
    if (customDomain.status === "active" && customDomain.activeDomain) {
      return {
        kind: "active",
        badge: { tone: "success", label: "Domínio canônico ativo" },
        title: "Compartilhe o domínio personalizado",
        description:
          "O domínio próprio já substituiu o host compartilhado e é o endereço oficial da vitrine neste momento.",
      };
    }

    return {
      kind: "active",
      badge: { tone: "success", label: "Fallback ativo para compartilhamento" },
      title: "Compartilhe o link atual da vitrine",
      description: fallbackStorefrontLink
        ? customDomain.status === "active" && !customDomain.activeDomain && customDomain.revertedToFallback
          ? "O domínio estava ativo mas perdeu prontidão. O host compartilhado voltou a ser canônico e está sendo monitorado para recuperação automática."
          : customDomain.status === "tls_failed"
            ? "O DNS já foi validado, mas o certificado ainda falhou. O host compartilhado segue como URL canônica até a recuperação do HTTPS."
            : customDomain.status === "provisioning_tls"
              ? "O DNS já está pronto, mas o certificado ainda está sendo provisionado. O host compartilhado segue como URL canônica até o HTTPS ficar pronto."
              : customDomain.status === "dns_failed"
                ? "A última checagem DNS falhou. O host compartilhado segue como URL canônica até a próxima verificação bem-sucedida."
                : customDomain.status === "verifying_dns"
                  ? "A verificação automática do DNS está em andamento. O host compartilhado segue como URL canônica até a ativação do domínio."
                  : customDomain.status === "pending_setup"
                    ? "O domínio desejado foi salvo, mas o host compartilhado continua canônico até o DNS ficar pronto."
                    : "O host compartilhado continua sendo a URL canônica enquanto nenhum domínio próprio ativo estiver disponível."
        : "A vitrine já está pública e o link canônico atual pode ser compartilhado com os clientes.",
    };
  }

  if (customDomain.status === "active" && customDomain.activeDomain) {
    return {
      kind: "preview",
      badge: { tone: "warning", label: "Preview do domínio ativo" },
      title: "O domínio já é canônico, mas a vitrine ainda não está pronta",
      description: isPublished
        ? "Conclua os campos obrigatórios para liberar o domínio personalizado ao público."
        : "A loja continua oculta. Publique a vitrine quando quiser liberar o domínio personalizado.",
    };
  }

  return {
    kind: "preview",
    badge: { tone: "warning", label: "Fallback em preview" },
    title: "O fallback continua sendo a referência atual",
    description: isPublished
      ? "O link compartilhado já está definido, mas a vitrine ainda precisa concluir os requisitos obrigatórios antes de ficar acessível."
      : "O link compartilhado já está definido, mas a vitrine continua oculta até a publicação.",
  };
}

export function PublicProfilePageClient({
  profile,
  updatePublicProfileAction,
}: PublicProfilePageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const {
    control,
    register,
    reset,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminPublicProfileValues>({
    resolver: zodResolver(adminPublicProfileSchema),
    defaultValues: toDefaultValues(profile),
  });

  useEffect(() => {
    reset(toDefaultValues(profile));
  }, [profile, reset]);

  const values = watch();
  const normalizedSlug = values.slug.trim().toLowerCase();
  const normalizedDesiredCustomDomain = values.desiredCustomDomain
    ? normalizeHost(values.desiredCustomDomain)
    : null;
  const publicAppOrigin = useMemo(() => {
    const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (configuredOrigin) {
      return configuredOrigin.replace(/\/$/, "");
    }

    if (typeof window !== "undefined") {
      return window.location.origin;
    }

    return "";
  }, []);
  const missingRequirements = useMemo(
    () =>
      publicationRequirements.filter(({ field }) => !values[field].trim()).map(({ label }) => label),
    [values],
  );
  const effectiveCustomDomain = getEffectiveCustomDomain(profile, normalizedDesiredCustomDomain);
  const effectiveDnsGuidance = useMemo(
    () => getEffectiveDnsGuidance(effectiveCustomDomain, publicAppOrigin),
    [effectiveCustomDomain, publicAppOrigin],
  );
  const canonicalStorefrontLink = buildCanonicalStorefrontUrl(publicAppOrigin, {
    slug: normalizedSlug,
    customDomain: effectiveCustomDomain,
  });
  const fallbackStorefrontLink = buildFallbackStorefrontUrl(publicAppOrigin, {
    slug: normalizedSlug,
  });
  const pendingCustomDomainLink = buildPendingCustomDomainUrl(publicAppOrigin, {
    customDomain: effectiveCustomDomain,
  });
  const domainOnboardingState = getDomainOnboardingState(
    effectiveCustomDomain,
    effectiveDnsGuidance,
    fallbackStorefrontLink,
  );
  const domainStageStates = useMemo(
    () => getDomainStageStates(effectiveCustomDomain, effectiveDnsGuidance),
    [effectiveCustomDomain, effectiveDnsGuidance],
  );
  const storefrontLinkState = getStorefrontLinkState({
    canonicalStorefrontLink,
    fallbackStorefrontLink,
    customDomain: effectiveCustomDomain,
    isPublished: values.isPublished,
    missingRequirementsCount: missingRequirements.length,
  });

  const publicationState = values.isPublished
    ? missingRequirements.length === 0
      ? {
          badge: { tone: "success" as const, label: "Publicada" },
          notice: {
            tone: "success" as const,
            title: "Vitrine pronta para acesso publico",
            description:
              "Com os campos obrigatorios preenchidos, o petshop ja pode compartilhar o link canonico atual da propria vitrine com seus clientes.",
          },
        }
      : {
          badge: { tone: "warning" as const, label: "Publicação pendente" },
          notice: {
            tone: "warning" as const,
            title: "Faltam campos para liberar a vitrine",
            description:
              "Preencha os campos marcados para publicar a loja e habilitar o acesso direto pela vitrine escolhida como fallback ou pelo dominio proprio quando ele estiver ativo.",
          },
        }
    : {
        badge: { tone: "neutral" as const, label: "Oculta" },
        notice: {
          tone: "info" as const,
          title: "Vitrine fora da experiencia publica principal",
          description:
            "Enquanto estiver oculta, a loja nao pode compartilhar a propria pagina publica com clientes. Voce pode preparar o fallback e o dominio proprio com calma antes de publicar.",
        },
      };

  async function handleCopyStorefrontLink() {
    if (storefrontLinkState.kind !== "active" || !canonicalStorefrontLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(canonicalStorefrontLink);
      setCopyFeedback("Link copiado para compartilhar com clientes.");
    } catch {
      setCopyFeedback("Nao foi possivel copiar o link automaticamente.");
    }
  }

  async function handleFormSubmit(formValues: AdminPublicProfileValues) {
    setFeedback(null);
    const result = await updatePublicProfileAction(formValues);

    if (!result.success) {
      setFeedback({ tone: "danger", message: result.message });

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) {
          setError(field as keyof AdminPublicProfileValues, { message });
        }
      }

      return;
    }

    setFeedback({ tone: "success", message: result.message });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <SetupNotice
          title={publicationState.notice.title}
          description={publicationState.notice.description}
          tone={publicationState.notice.tone}
        />

        {feedback ? (
          <SetupNotice
            title={
              feedback.tone === "success"
                ? "Perfil público atualizado"
                : "Não foi possível salvar o perfil público"
            }
            description={feedback.message}
            tone={feedback.tone}
          />
        ) : null}

        <Card className="p-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-content-primary">
                Dados da vitrine pública
              </h2>
              <p className="text-sm text-content-secondary">
                Ajuste como o petshop aparece na propria vitrine publica, mantenha o
                fallback compartilhado pronto e acompanhe a migracao para o dominio
                personalizado no mesmo fluxo.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-content-secondary">
                  Estado da vitrine
                </p>
                <p className="text-sm text-content-muted">
                  Escolha se a loja fica disponivel para acesso publico pelo link
                  canonico atual agora ou se continua oculta enquanto voce prepara os
                  textos e o onboarding do dominio.
                </p>
              </div>

              <Controller
                control={control}
                name="isPublished"
                render={({ field }) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    <button
                      type="button"
                      aria-pressed={!field.value}
                      className={`rounded-2xl border p-5 text-left transition ${
                        !field.value
                          ? "border-stroke-brand bg-surface-brand-soft"
                          : "border-stroke-soft bg-surface-card hover:border-stroke-strong"
                      }`}
                      onClick={() => field.onChange(false)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-muted text-content-secondary">
                          <EyeOff className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-content-primary">
                            Manter oculta
                          </p>
                          <p className="text-sm text-content-secondary">
                            Use esta opcao para salvar rascunhos sem liberar a vitrine
                            publica da loja.
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      aria-pressed={field.value}
                      className={`rounded-2xl border p-5 text-left transition ${
                        field.value
                          ? "border-stroke-brand bg-surface-brand-soft"
                          : "border-stroke-soft bg-surface-card hover:border-stroke-strong"
                      }`}
                      onClick={() => field.onChange(true)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-muted text-content-secondary">
                          <Eye className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-content-primary">
                            Publicar vitrine
                          </p>
                          <p className="text-sm text-content-secondary">
                            A loja passa a ter uma pagina publica propria pelo fallback
                            compartilhado ou pelo dominio ativo, se ele ja estiver
                            verificado.
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              />
              {errors.isPublished?.message ? (
                <p className="text-xs text-content-danger">{errors.isPublished.message}</p>
              ) : null}
            </div>

            <FormField
              label="Slug"
              error={errors.slug?.message}
              hint="Use apenas letras minúsculas, números e hífens. Ex.: banho-da-vila."
            >
              <Input placeholder="meu-petshop" {...register("slug")} />
            </FormField>

            <FormField
              label="Domínio personalizado desejado"
              error={errors.desiredCustomDomain?.message}
              hint="Opcional. Use um subdomínio como agenda.petshop.com.br ou um domínio raiz como petshop.com.br. Deixe vazio para voltar ao fallback compartilhado."
            >
              <Input placeholder="agenda.petshop.com.br ou petshop.com.br" {...register("desiredCustomDomain")} />
            </FormField>

            <FormField
              label="Descrição"
              error={errors.description?.message}
              hint="Resumo principal da experiência, serviços ou diferenciais da loja."
            >
              <Textarea
                placeholder="Descreva em poucas linhas o que torna seu petshop especial."
                {...register("description")}
              />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Cidade"
                error={errors.city?.message}
                hint="Aparece nos filtros e ajuda clientes a encontrar sua região."
              >
                <Input placeholder="São Paulo" {...register("city")} />
              </FormField>

              <FormField
                label="Bairro"
                error={errors.neighborhood?.message}
                hint="Use o bairro principal para refinar a descoberta local."
              >
                <Input placeholder="Vila Mariana" {...register("neighborhood")} />
              </FormField>
            </div>

            <FormField
              label="Resumo de contato"
              error={errors.contactSummary?.message}
              hint="Ex.: WhatsApp, telefone principal e melhor canal de resposta."
            >
              <Textarea
                placeholder="WhatsApp (11) 99999-9999 • atendimento de segunda a sábado"
                {...register("contactSummary")}
              />
            </FormField>

            <FormField
              label="Resumo de endereço"
              error={errors.addressSummary?.message}
              hint="Inclua os detalhes que ajudam o tutor a reconhecer o local."
            >
              <Textarea
                placeholder="Rua Exemplo, 123 • próximo ao metrô • estacionamento conveniado"
                {...register("addressSummary")}
              />
            </FormField>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" loading={isSubmitting || isPending}>
                Salvar perfil público
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-content-secondary">
                <Store className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-content-secondary">Resumo da vitrine</p>
                <h2 className="text-lg font-semibold text-content-primary">{profile.name}</h2>
              </div>
            </div>

            <Badge tone={publicationState.badge.tone}>{publicationState.badge.label}</Badge>

            <div className="space-y-3 text-sm text-content-secondary">
              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                  Slug atual
                </p>
                <p className="mt-2 font-medium text-content-primary">
                  {normalizedSlug ? normalizedSlug : "Ainda não definido"}
                </p>
              </div>

              <div className="rounded-2xl bg-surface-muted p-4">
                <div className="flex items-center gap-2 text-content-secondary">
                  <Link2 className="h-4 w-4" />
                  <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                    Link canônico da vitrine
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Badge tone={storefrontLinkState.badge.tone}>
                    {storefrontLinkState.badge.label}
                  </Badge>
                  <p className="text-sm font-medium text-content-primary">
                    {storefrontLinkState.title}
                  </p>
                </div>
                <p className="mt-2 break-all font-medium text-content-primary">
                  {canonicalStorefrontLink ??
                    "Defina um slug ou ative um domínio para montar o link público completo."}
                </p>
                <p className="mt-2 text-sm text-content-secondary">
                  {storefrontLinkState.description}
                </p>

                {effectiveCustomDomain.desiredDomain ? (
                  <div className="mt-4 space-y-4 rounded-2xl bg-surface-muted p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 text-content-secondary">
                        <Clock3 className="h-4 w-4" />
                        <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                          Automação do domínio personalizado
                        </p>
                      </div>
                      <Badge tone={domainOnboardingState.badge.tone}>
                        {domainOnboardingState.badge.label}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-content-primary">
                        {domainOnboardingState.latestOutcome}
                      </p>
                      <p className="text-sm text-content-secondary">
                        {domainOnboardingState.retryGuidance}
                      </p>
                      <p className="text-sm text-content-secondary">
                        {domainOnboardingState.guidance}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {domainStageStates.map((stage) => (
                        <div
                          key={stage.key}
                          className="rounded-2xl border border-stroke-soft bg-surface-card p-4 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                                {stage.eyebrow}
                              </p>
                              <p className="text-sm font-semibold text-content-primary">
                                {stage.title}
                              </p>
                            </div>
                            <Badge tone={stage.badge.tone}>{stage.badge.label}</Badge>
                          </div>
                          <p className="mt-3 text-sm text-content-secondary">
                            {stage.description}
                          </p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {stage.metadata.map((detail) => (
                              <div
                                key={`${stage.key}-${detail.label}`}
                                className="rounded-2xl bg-surface-muted p-4"
                              >
                                <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                                  {detail.label}
                                </p>
                                <p className="mt-2 text-sm font-medium text-content-primary">
                                  {detail.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {storefrontLinkState.kind === "active" && canonicalStorefrontLink ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button type="button" size="sm" onClick={handleCopyStorefrontLink}>
                      <Copy className="h-4 w-4" />
                      Copiar link
                    </Button>
                    <Button href={canonicalStorefrontLink} variant="secondary" size="sm">
                      <ExternalLink className="h-4 w-4" />
                      Abrir vitrine
                    </Button>
                  </div>
                ) : null}

                {copyFeedback ? (
                  <p className="mt-3 text-sm text-content-secondary">{copyFeedback}</p>
                ) : null}
              </div>

              {effectiveCustomDomain.desiredDomain &&
              effectiveCustomDomain.status !== "active" &&
              fallbackStorefrontLink ? (
                <div className="rounded-2xl border border-dashed border-stroke-soft p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                    Compartilhe agora
                  </p>
                  <p className="mt-2 break-all font-medium text-content-primary">
                    {fallbackStorefrontLink}
                  </p>
                  <p className="mt-2 text-sm text-content-secondary">
                    Enquanto o domínio personalizado não fica ativo, este link hospedado pela
                    petcenter continua sendo o fallback oficial para clientes.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-content-secondary">
                <Globe className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-content-secondary">
                  Onboarding de domínio
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-content-primary">
                    {effectiveCustomDomain.desiredDomain ?? "Use o host compartilhado"}
                  </h2>
                  {effectiveCustomDomain.desiredDomain ? (
                    <Badge tone="neutral">
                      {getDomainModeLabel(
                        effectiveDnsGuidance.mode === "none"
                          ? effectiveCustomDomain.mode
                          : effectiveDnsGuidance.mode,
                      )}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <Badge tone={domainOnboardingState.badge.tone}>
              {domainOnboardingState.badge.label}
            </Badge>

            <div className="space-y-3 text-sm text-content-secondary">
              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-sm font-medium text-content-primary">
                  {domainOnboardingState.title}
                </p>
                <p className="mt-2">{domainOnboardingState.description}</p>
                <p className="mt-3 text-sm font-medium text-content-primary">
                  {domainOnboardingState.latestOutcome}
                </p>
                <p className="mt-2 text-sm text-content-secondary">
                  {domainOnboardingState.retryGuidance}
                </p>
                <p className="mt-3 text-sm text-content-secondary">
                  {domainOnboardingState.guidance}
                </p>
              </div>

              {effectiveCustomDomain.desiredDomain ? (
                <>
                  <div className="rounded-2xl bg-surface-muted p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                      Próxima URL desejada
                    </p>
                    <p className="mt-2 break-all font-medium text-content-primary">
                      {pendingCustomDomainLink}
                    </p>
                  </div>

                  <div className="grid gap-3 rounded-2xl bg-surface-muted p-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                        Estratégia de onboarding
                      </p>
                      <p className="mt-2 font-medium text-content-primary">
                        {getDomainModeLabel(
                          effectiveDnsGuidance.mode === "none"
                            ? effectiveCustomDomain.mode
                            : effectiveDnsGuidance.mode,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                        Tipo de registro DNS
                      </p>
                      <p className="mt-2 font-medium text-content-primary">
                        {getRecordTypeLabel(
                          effectiveDnsGuidance.recordType,
                          effectiveCustomDomain.mode,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                        Host a configurar
                      </p>
                      <p className="mt-2 break-all font-medium text-content-primary">
                        {effectiveDnsGuidance.recordName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                        Zona DNS
                      </p>
                      <p className="mt-2 break-all font-medium text-content-primary">
                        {effectiveDnsGuidance.zoneDns || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stroke-soft bg-surface-card p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                      Instrução principal
                    </p>
                    <p className="mt-2 text-sm font-medium text-content-primary">
                      {effectiveDnsGuidance.primaryInstruction ||
                        "Salve o domínio para carregar as instruções de DNS específicas deste onboarding."}
                    </p>
                    {effectiveDnsGuidance.secondaryInstruction ? (
                      <p className="mt-3 text-sm text-content-secondary">
                        {effectiveDnsGuidance.secondaryInstruction}
                      </p>
                    ) : null}
                  </div>

                  {effectiveDnsGuidance.expectedHostnames.length > 0 ? (
                    <div className="rounded-2xl border border-stroke-soft bg-surface-card p-4 shadow-sm">
                      <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                        Hostnames suportados
                      </p>
                      <div className="mt-3 space-y-2">
                        {effectiveDnsGuidance.expectedHostnames.map((hostname) => (
                          <p
                            key={hostname}
                            className="break-all text-sm font-medium text-content-primary"
                          >
                            {hostname}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {effectiveDnsGuidance.expectedIps.length > 0 ? (
                    <div className="rounded-2xl border border-stroke-soft bg-surface-card p-4 shadow-sm">
                      <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                        IPs suportados para A/AAAA
                      </p>
                      <div className="mt-3 space-y-2">
                        {effectiveDnsGuidance.expectedIps.map((ip) => (
                          <p key={ip} className="break-all text-sm font-medium text-content-primary">
                            {ip}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {effectiveDnsGuidance.expectedValues.length > 0 &&
                  effectiveDnsGuidance.expectedHostnames.length === 0 &&
                  effectiveDnsGuidance.expectedIps.length === 0 ? (
                    <div className="rounded-2xl border border-stroke-soft bg-surface-card p-4 shadow-sm">
                      <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                        Valores esperados
                      </p>
                      <div className="mt-3 space-y-2">
                        {effectiveDnsGuidance.expectedValues.map((value) => (
                          <p
                            key={value}
                            className="break-all text-sm font-medium text-content-primary"
                          >
                            {value}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {effectiveDnsGuidance.optionalWwwRedirectInstruction ? (
                    <div className="rounded-2xl bg-surface-brand-soft p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-content-primary">
                        Recomendação opcional de www
                      </p>
                      <p className="mt-2 text-sm text-content-primary">
                        {effectiveDnsGuidance.optionalWwwRedirectInstruction}
                      </p>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-content-primary">
                Checklist de publicação
              </h2>
              <p className="text-sm text-content-secondary">
                O backend exige estes campos quando a vitrine fica pública.
              </p>
            </div>

            <div className="space-y-3">
              {publicationRequirements.map((requirement) => {
                const isComplete = values[requirement.field].trim().length > 0;
                const Icon = isComplete ? CheckCircle2 : CircleAlert;

                return (
                  <div
                    key={requirement.field}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                      isComplete
                        ? "bg-surface-success-soft text-content-success"
                        : "bg-surface-warning-soft text-content-warning"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{requirement.label}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-content-secondary">
              {missingRequirements.length === 0
                ? "Todos os campos obrigatórios já estão prontos para publicação."
                : `Ainda faltam ${missingRequirements.length} campo(s) obrigatório(s) para liberar a vitrine.`}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
