"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, Eye, EyeOff, ExternalLink, Store } from "lucide-react";
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
import type { AdminMutationResult, AdminPublicProfile } from "@/types";

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

function toDefaultValues(profile: AdminPublicProfile): AdminPublicProfileValues {
  return {
    slug: profile.slug,
    description: profile.description,
    city: profile.city,
    neighborhood: profile.neighborhood,
    contactSummary: profile.contactSummary,
    addressSummary: profile.addressSummary,
    isPublished: profile.isPublished,
  };
}

export function PublicProfilePageClient({
  profile,
  updatePublicProfileAction,
}: PublicProfilePageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
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
  const storefrontPath = normalizedSlug ? `/petshops/${normalizedSlug}` : "/petshops/[slug]";
  const missingRequirements = useMemo(
    () =>
      publicationRequirements.filter(({ field }) => !values[field].trim()).map(({ label }) => label),
    [values],
  );

  const publicationState = values.isPublished
    ? missingRequirements.length === 0
      ? {
          badge: { tone: "success" as const, label: "Publicada" },
          notice: {
            tone: "success" as const,
            title: "Vitrine pronta para descoberta",
            description:
              "Com os campos obrigatórios preenchidos, o catálogo público já consegue usar seu slug e os resumos da loja.",
          },
        }
      : {
          badge: { tone: "warning" as const, label: "Publicação pendente" },
          notice: {
            tone: "warning" as const,
            title: "Faltam campos para liberar a vitrine",
            description:
              "Preencha os campos marcados para publicar a loja no catálogo e habilitar a página pública pelo slug escolhido.",
          },
        }
    : {
        badge: { tone: "neutral" as const, label: "Oculta" },
        notice: {
          tone: "info" as const,
          title: "Vitrine fora do catálogo público",
          description:
            "Enquanto estiver oculta, a loja não aparece na descoberta pública. Você pode preparar os dados com calma antes de publicar.",
        },
      };

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
                Ajuste como o petshop aparece no catálogo público e na página da loja. A
                publicação usa exatamente estes campos.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-content-secondary">
                  Estado da vitrine
                </p>
                <p className="text-sm text-content-muted">
                  Escolha se a loja fica disponível no catálogo público agora ou se continua
                  oculta enquanto você prepara os textos.
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
                            Use esta opção para salvar rascunhos sem colocar o petshop na
                            descoberta pública.
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
                            A loja pode aparecer em <span className="font-medium">/petshops</span>{" "}
                            e usar o slug salvo na página pública.
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
                  <ExternalLink className="h-4 w-4" />
                  <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                    Caminho público
                  </p>
                </div>
                <p className="mt-2 break-all font-medium text-content-primary">
                  {storefrontPath}
                </p>
                <p className="mt-2 text-sm text-content-secondary">
                  Este caminho ajuda a equipe a validar como a loja será descoberta sem montar um
                  preview completo.
                </p>
              </div>

              <p>
                Quando a vitrine estiver publicada, slug, cidade, bairro e resumos passam a
                orientar a descoberta do petshop no catálogo público.
              </p>
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
