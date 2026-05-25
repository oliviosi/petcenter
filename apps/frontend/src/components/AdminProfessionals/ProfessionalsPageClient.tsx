"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseMedical, CalendarClock, UserCog, UserMinus, UserRoundPlus } from "lucide-react";
import { ProfessionalForm } from "@/components/AdminProfessionals/ProfessionalForm";
import { SetupNotice } from "@/components/AdminSetup/SetupNotice";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTimeValue } from "@/lib/format";
import type { AdminProfessional, AdminMutationResult } from "@/types";
import type { AdminProfessionalFieldsValues } from "@/lib/validations/adminProfessional";

interface ProfessionalsPageClientProps {
  professionals: AdminProfessional[];
  createProfessionalAction: (
    values: AdminProfessionalFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminProfessionalFieldsValues, string>>>;
  updateProfessionalAction: (
    professionalId: string,
    values: AdminProfessionalFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminProfessionalFieldsValues, string>>>;
  activateProfessionalAction: (professionalId: string) => Promise<AdminMutationResult>;
  deactivateProfessionalAction: (professionalId: string) => Promise<AdminMutationResult>;
}

interface FeedbackState {
  tone: "success" | "danger";
  message: string;
}

export function ProfessionalsPageClient({
  professionals,
  createProfessionalAction,
  updateProfessionalAction,
  activateProfessionalAction,
  deactivateProfessionalAction,
}: ProfessionalsPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingProfessionalId, setEditingProfessionalId] = useState<string | null>(null);
  const [confirmingDeactivateId, setConfirmingDeactivateId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  async function handleCreate(values: AdminProfessionalFieldsValues) {
    const result = await createProfessionalAction(values);

    if (result.success) {
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
    }

    return result;
  }

  async function handleUpdate(
    professionalId: string,
    values: AdminProfessionalFieldsValues,
  ) {
    const result = await updateProfessionalAction(professionalId, values);

    if (result.success) {
      setEditingProfessionalId(null);
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
    }

    return result;
  }

  async function handleActivate(professionalId: string) {
    const result = await activateProfessionalAction(professionalId);

    if (result.success) {
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
      return;
    }

    setFeedback({ tone: "danger", message: result.message });
  }

  async function handleDeactivate(professionalId: string) {
    const result = await deactivateProfessionalAction(professionalId);

    if (result.success) {
      setConfirmingDeactivateId(null);
      setEditingProfessionalId(null);
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
        title="Ativação afeta a agenda pública"
        description="Profissionais inativos saem da vitrine pública do petshop e não devem receber novas atribuições de serviços até serem reativados."
        tone="warning"
      />

      {feedback ? (
        <SetupNotice
          title={feedback.tone === "success" ? "Atualização concluída" : "Não foi possível concluir a ação"}
          description={feedback.message}
          tone={feedback.tone === "success" ? "success" : "danger"}
        />
      ) : null}

      <Card className="p-6" id="new-professional">
        <ProfessionalForm
          title="Cadastrar profissional"
          description="Cadastre quem atende no petshop agora para liberar configurações de serviços e disponibilidade."
          submitLabel="Salvar profissional"
          onSubmit={handleCreate}
        />
      </Card>

      {professionals.length === 0 ? (
        <EmptyState
          icon={UserRoundPlus}
          title="Nenhum profissional cadastrado"
          description="Comece cadastrando o primeiro profissional para configurar serviços, agenda semanal e participação na vitrine pública."
          action={
            <Button href="#new-professional">
              Cadastrar profissional
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {professionals.map((professional) => {
            const isEditing = editingProfessionalId === professional.id;
            const isConfirmingDeactivate = confirmingDeactivateId === professional.id;

            return (
              <Card key={professional.id} className="p-6">
                <div className="space-y-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-content-primary">
                          {professional.name}
                        </h2>
                        <Badge tone={professional.isActive ? "success" : "warning"}>
                          {professional.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-content-secondary">
                        <p>
                          {professional.specialty
                            ? professional.specialty
                            : "Especialidade opcional ainda não informada."}
                        </p>
                        <p>Cadastrado em {formatDateTimeValue(professional.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button href={`/admin/professionals/${professional.id}`}>
                        <CalendarClock className="h-4 w-4" />
                        Configurar agenda
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          setEditingProfessionalId((currentValue) =>
                            currentValue === professional.id ? null : professional.id,
                          )
                        }
                      >
                        <UserCog className="h-4 w-4" />
                        {isEditing ? "Fechar edição" : "Editar perfil"}
                      </Button>
                      {professional.isActive ? (
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => setConfirmingDeactivateId(professional.id)}
                        >
                          <UserMinus className="h-4 w-4" />
                          Desativar
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={isPending}
                          onClick={() => void handleActivate(professional.id)}
                        >
                          Reativar
                        </Button>
                      )}
                    </div>
                  </div>

                  {!professional.isActive ? (
                    <SetupNotice
                      title="Profissional fora da vitrine pública"
                      description="Enquanto estiver inativo, este profissional deixa de aparecer na descoberta pública e pode ficar indisponível para novas atribuições de serviço."
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
                          Desativar este profissional remove sua participação da vitrine pública e pode bloquear novas atribuições de serviço.
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="danger"
                          loading={isPending}
                          onClick={() => void handleDeactivate(professional.id)}
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
                      <ProfessionalForm
                        title="Editar perfil"
                        description="Atualize os dados principais antes de seguir para a configuração detalhada do profissional."
                        submitLabel="Salvar alterações"
                        defaultValues={{
                          name: professional.name,
                          specialty: professional.specialty ?? "",
                        }}
                        onSubmit={(values) => handleUpdate(professional.id, values)}
                        onCancel={() => setEditingProfessionalId(null)}
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
            <BriefcaseMedical className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-content-primary">
              Próximo passo recomendado
            </h2>
            <p className="text-sm text-content-secondary">
              Depois de cadastrar o profissional, abra a configuração detalhada para vincular serviços ativos e definir a disponibilidade semanal recorrente.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
