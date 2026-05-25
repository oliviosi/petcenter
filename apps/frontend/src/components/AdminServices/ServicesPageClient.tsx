"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Scissors, Tag, TagIcon } from "lucide-react";
import { SetupNotice } from "@/components/AdminSetup/SetupNotice";
import { ServiceForm } from "@/components/AdminServices/ServiceForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDateTimeValue } from "@/lib/format";
import type { AdminMutationResult, AdminService } from "@/types";
import type { AdminServiceFieldsValues } from "@/lib/validations/adminService";

interface ServicesPageClientProps {
  services: AdminService[];
  createServiceAction: (
    values: AdminServiceFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminServiceFieldsValues, string>>>;
  updateServiceAction: (
    serviceId: string,
    values: AdminServiceFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminServiceFieldsValues, string>>>;
  activateServiceAction: (serviceId: string) => Promise<AdminMutationResult>;
  deactivateServiceAction: (serviceId: string) => Promise<AdminMutationResult>;
}

interface FeedbackState {
  tone: "success" | "danger";
  message: string;
}

export function ServicesPageClient({
  services,
  createServiceAction,
  updateServiceAction,
  activateServiceAction,
  deactivateServiceAction,
}: ServicesPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [confirmingDeactivateId, setConfirmingDeactivateId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  async function handleCreate(values: AdminServiceFieldsValues) {
    const result = await createServiceAction(values);

    if (result.success) {
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
    }

    return result;
  }

  async function handleUpdate(serviceId: string, values: AdminServiceFieldsValues) {
    const result = await updateServiceAction(serviceId, values);

    if (result.success) {
      setEditingServiceId(null);
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
    }

    return result;
  }

  async function handleActivate(serviceId: string) {
    const result = await activateServiceAction(serviceId);

    if (result.success) {
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
      return;
    }

    setFeedback({ tone: "danger", message: result.message });
  }

  async function handleDeactivate(serviceId: string) {
    const result = await deactivateServiceAction(serviceId);

    if (result.success) {
      setConfirmingDeactivateId(null);
      setEditingServiceId(null);
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
      return;
    }

    setFeedback({ tone: "danger", message: result.message });
  }

  return (
    <div className="space-y-6">
      <SetupNotice
        title="Ativação controla descoberta e atribuições"
        description="Serviços inativos deixam de aparecer no catálogo público e também saem das opções para atribuição dentro da configuração dos profissionais."
        tone="warning"
      />

      {feedback ? (
        <SetupNotice
          title={feedback.tone === "success" ? "Atualização concluída" : "Não foi possível concluir a ação"}
          description={feedback.message}
          tone={feedback.tone === "success" ? "success" : "danger"}
        />
      ) : null}

      <Card className="p-6" id="new-service">
        <ServiceForm
          title="Cadastrar serviço"
          description="Mantenha aqui o catálogo operacional que alimenta o catálogo público e as atribuições dos profissionais."
          submitLabel="Salvar serviço"
          onSubmit={handleCreate}
        />
      </Card>

      {services.length === 0 ? (
        <EmptyState
          icon={TagIcon}
          title="Nenhum serviço cadastrado"
          description="Cadastre o primeiro serviço para montar o catálogo do petshop e liberar atribuições na configuração dos profissionais."
          action={<Button href="#new-service">Cadastrar serviço</Button>}
        />
      ) : (
        <div className="grid gap-4">
          {services.map((service) => {
            const isEditing = editingServiceId === service.id;
            const isConfirmingDeactivate = confirmingDeactivateId === service.id;

            return (
              <Card key={service.id} className="p-6">
                <div className="space-y-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-content-primary">
                          {service.name}
                        </h2>
                        <Badge tone={service.isActive ? "success" : "warning"}>
                          {service.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="grid gap-1 text-sm text-content-secondary">
                        <p>
                          {service.durationMinutes} minutos • {formatCurrency(service.basePrice)}
                        </p>
                        <p>Cadastrado em {formatDateTimeValue(service.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          setEditingServiceId((currentValue) =>
                            currentValue === service.id ? null : service.id,
                          )
                        }
                      >
                        <Scissors className="h-4 w-4" />
                        {isEditing ? "Fechar edição" : "Editar serviço"}
                      </Button>

                      {service.isActive ? (
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => setConfirmingDeactivateId(service.id)}
                        >
                          Desativar
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={isPending}
                          onClick={() => void handleActivate(service.id)}
                        >
                          Reativar
                        </Button>
                      )}
                    </div>
                  </div>

                  {!service.isActive ? (
                    <SetupNotice
                      title="Serviço fora do catálogo ativo"
                      description="Enquanto estiver inativo, este serviço não participa da descoberta pública nem pode ser usado em novas atribuições dentro do setup dos profissionais."
                      tone="warning"
                    />
                  ) : null}

                  {isConfirmingDeactivate ? (
                    <div className="rounded-2xl border border-content-danger/20 bg-surface-danger-soft p-5">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-content-danger">
                          Confirmar desativação
                        </p>
                        <p className="text-sm text-content-danger">
                          Desativar este serviço remove sua visibilidade pública e bloqueia novas atribuições nos profissionais até a reativação.
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="danger"
                          loading={isPending}
                          onClick={() => void handleDeactivate(service.id)}
                        >
                          Confirmar desativação
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setConfirmingDeactivateId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {isEditing ? (
                    <div className="rounded-2xl bg-surface-muted p-5">
                      <ServiceForm
                        title="Editar serviço"
                        description="Atualize nome, duração e preço base para manter o catálogo operacional consistente."
                        submitLabel="Salvar alterações"
                        defaultValues={{
                          name: service.name,
                          durationMinutes: String(service.durationMinutes),
                          basePrice: String(service.basePrice),
                        }}
                        onSubmit={(values) => handleUpdate(service.id, values)}
                        onCancel={() => setEditingServiceId(null)}
                      />
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="p-6">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-muted text-content-secondary">
            <Tag className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-content-primary">
              Catálogo pronto para atribuição
            </h2>
            <p className="text-sm text-content-secondary">
              Mantenha somente serviços ativos e atualizados. Eles são a base do catálogo público e da configuração individual de cada profissional.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
