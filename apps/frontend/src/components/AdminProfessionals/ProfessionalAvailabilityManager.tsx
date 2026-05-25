"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Trash2 } from "lucide-react";
import { AvailabilityForm } from "@/components/AdminProfessionals/AvailabilityForm";
import { SetupNotice } from "@/components/AdminSetup/SetupNotice";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  formatAvailabilityRange,
  getWeekdayLabel,
  normalizeTimeValue,
} from "@/lib/adminScheduling";
import type { AdminMutationResult, AdminProfessional, AdminProfessionalAvailability } from "@/types";
import type { AdminAvailabilityFieldsValues } from "@/lib/validations/adminAvailability";

interface ProfessionalAvailabilityManagerProps {
  professional: AdminProfessional;
  availability: AdminProfessionalAvailability[];
  createAvailabilityAction: (
    professionalId: string,
    values: AdminAvailabilityFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminAvailabilityFieldsValues, string>>>;
  updateAvailabilityAction: (
    professionalId: string,
    availabilityId: string,
    values: AdminAvailabilityFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminAvailabilityFieldsValues, string>>>;
  deleteAvailabilityAction: (
    professionalId: string,
    availabilityId: string,
  ) => Promise<AdminMutationResult>;
}

interface FeedbackState {
  tone: "success" | "danger";
  message: string;
}

export function ProfessionalAvailabilityManager({
  professional,
  availability,
  createAvailabilityAction,
  updateAvailabilityAction,
  deleteAvailabilityAction,
}: ProfessionalAvailabilityManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingAvailabilityId, setEditingAvailabilityId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  async function handleCreate(values: AdminAvailabilityFieldsValues) {
    const result = await createAvailabilityAction(professional.id, values);

    if (result.success) {
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
    }

    return result;
  }

  async function handleUpdate(
    availabilityId: string,
    values: AdminAvailabilityFieldsValues,
  ) {
    const result = await updateAvailabilityAction(professional.id, availabilityId, values);

    if (result.success) {
      setEditingAvailabilityId(null);
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
    }

    return result;
  }

  async function handleDelete(availabilityId: string) {
    const result = await deleteAvailabilityAction(professional.id, availabilityId);

    if (!result.success) {
      setFeedback({ tone: "danger", message: result.message });
      return;
    }

    setConfirmingDeleteId(null);
    setFeedback({ tone: "success", message: result.message });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-content-primary">
            Disponibilidade semanal
          </h2>
          <p className="text-sm text-content-secondary">
            Cadastre janelas recorrentes por dia da semana para orientar a geração futura de horários.
          </p>
        </div>

        {!professional.isActive ? (
          <SetupNotice
            title="Agenda preservada, mas fora da vitrine"
            description="As janelas continuam salvas mesmo com o profissional inativo, porém não devem gerar oferta pública até a reativação."
            tone="warning"
          />
        ) : null}

        {feedback ? (
          <SetupNotice
            title={feedback.tone === "success" ? "Disponibilidade atualizada" : "Não foi possível atualizar a disponibilidade"}
            description={feedback.message}
            tone={feedback.tone === "success" ? "success" : "danger"}
          />
        ) : null}

        <div className="rounded-2xl bg-surface-muted p-5">
          <AvailabilityForm
            title="Adicionar janela recorrente"
            description="Mantenha a primeira versão simples: um dia da semana e uma faixa contínua por registro."
            submitLabel="Salvar disponibilidade"
            onSubmit={handleCreate}
          />
        </div>

        {availability.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nenhuma disponibilidade cadastrada"
            description="Cadastre a primeira janela semanal para começar a estruturar a agenda deste profissional."
          />
        ) : (
          <div className="grid gap-4">
            {availability.map((item) => {
              const isEditing = editingAvailabilityId === item.id;
              const isConfirmingDelete = confirmingDeleteId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stroke-soft bg-surface-card p-5"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-base font-semibold text-content-primary">
                            {getWeekdayLabel(item.weekday)}
                          </p>
                          <Badge tone="brand">
                            {formatAvailabilityRange(item.startTime, item.endTime)}
                          </Badge>
                        </div>
                        <p className="text-sm text-content-secondary">
                          Faixa salva como recorrente para toda semana.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setEditingAvailabilityId((currentValue) =>
                              currentValue === item.id ? null : item.id,
                            )
                          }
                        >
                          {isEditing ? "Fechar edição" : "Editar janela"}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => setConfirmingDeleteId(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
                    </div>

                    {isConfirmingDelete ? (
                      <div className="rounded-2xl border border-content-danger/20 bg-surface-danger-soft p-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-content-danger">
                            Confirmar exclusão
                          </p>
                          <p className="text-sm text-content-danger">
                            Esta janela deixará de compor a agenda recorrente do profissional nas próximas consultas operacionais.
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Button
                            type="button"
                            variant="danger"
                            loading={isPending}
                            onClick={() => void handleDelete(item.id)}
                          >
                            Confirmar exclusão
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setConfirmingDeleteId(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {isEditing ? (
                      <div className="rounded-2xl bg-surface-muted p-5">
                        <AvailabilityForm
                          title="Editar janela recorrente"
                          description="Ajuste o dia e o intervalo conforme a operação atual do petshop."
                          submitLabel="Salvar ajustes"
                          defaultValues={{
                            weekday: String(item.weekday),
                            startTime: normalizeTimeValue(item.startTime),
                            endTime: normalizeTimeValue(item.endTime),
                          }}
                          onSubmit={(values) => handleUpdate(item.id, values)}
                          onCancel={() => setEditingAvailabilityId(null)}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
