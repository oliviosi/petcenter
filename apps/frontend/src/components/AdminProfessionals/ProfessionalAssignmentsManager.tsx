"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link2Off, Puzzle, Plus } from "lucide-react";
import { SetupNotice } from "@/components/AdminSetup/SetupNotice";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { formatCurrency } from "@/lib/format";
import {
  createAdminProfessionalAssignmentSchema,
  type CreateAdminProfessionalAssignmentValues,
} from "@/lib/validations/adminAssignment";
import type {
  AdminMutationResult,
  AdminProfessional,
  AdminProfessionalServiceAssignment,
  AdminService,
} from "@/types";

interface ProfessionalAssignmentsManagerProps {
  professional: AdminProfessional;
  services: AdminService[];
  assignments: AdminProfessionalServiceAssignment[];
  createAssignmentAction: (
    values: CreateAdminProfessionalAssignmentValues,
  ) => Promise<AdminMutationResult<Extract<keyof CreateAdminProfessionalAssignmentValues, string>>>;
  deleteAssignmentAction: (
    professionalId: string,
    serviceId: string,
  ) => Promise<AdminMutationResult>;
}

interface FeedbackState {
  tone: "success" | "danger";
  message: string;
}

export function ProfessionalAssignmentsManager({
  professional,
  services,
  assignments,
  createAssignmentAction,
  deleteAssignmentAction,
}: ProfessionalAssignmentsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [confirmingRemovalId, setConfirmingRemovalId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminProfessionalAssignmentValues>({
    resolver: zodResolver(createAdminProfessionalAssignmentSchema),
    defaultValues: {
      professionalId: professional.id,
      serviceId: "",
    },
  });

  const availableServices = useMemo(() => {
    const assignedIds = new Set(assignments.map((assignment) => assignment.serviceId));

    return services.filter((service) => service.isActive && !assignedIds.has(service.id));
  }, [assignments, services]);

  async function handleCreate(values: CreateAdminProfessionalAssignmentValues) {
    setFeedback(null);
    const result = await createAssignmentAction(values);

    if (!result.success) {
      setFeedback({ tone: "danger", message: result.message });

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) {
          setError(field as keyof CreateAdminProfessionalAssignmentValues, { message });
        }
      }

      return;
    }

    setFeedback({ tone: "success", message: result.message });
    reset({ professionalId: professional.id, serviceId: "" });
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleDelete(serviceId: string) {
    const result = await deleteAssignmentAction(professional.id, serviceId);

    if (!result.success) {
      setFeedback({ tone: "danger", message: result.message });
      return;
    }

    setConfirmingRemovalId(null);
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
            Serviços atribuídos
          </h2>
          <p className="text-sm text-content-secondary">
            Use esta seção para definir quais serviços ativos este profissional pode executar.
          </p>
        </div>

        {!professional.isActive ? (
          <SetupNotice
            title="Profissional inativo"
            description="Ative o profissional antes de criar novas atribuições. Enquanto isso, os vínculos atuais permanecem visíveis apenas para manutenção."
            tone="warning"
          />
        ) : null}

        {feedback ? (
          <SetupNotice
            title={feedback.tone === "success" ? "Atribuição atualizada" : "Não foi possível atualizar as atribuições"}
            description={feedback.message}
            tone={feedback.tone === "success" ? "success" : "danger"}
          />
        ) : null}

        <form
          onSubmit={handleSubmit(handleCreate)}
          className="space-y-4 rounded-2xl bg-surface-muted p-5"
        >
          <input type="hidden" {...register("professionalId")} />
          <FormField
            label="Adicionar serviço ativo"
            error={errors.serviceId?.message}
            hint={
              professional.isActive
                ? "Somente serviços ativos e ainda não atribuídos aparecem na lista."
                : "Reative o profissional para liberar novas atribuições."
            }
          >
            <Select
              defaultValue=""
              disabled={!professional.isActive || availableServices.length === 0}
              {...register("serviceId")}
            >
              <option value="">Selecione um serviço</option>
              {availableServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} • {service.durationMinutes} min
                </option>
              ))}
            </Select>
          </FormField>

          <Button
            type="submit"
            loading={isSubmitting || isPending}
            disabled={!professional.isActive || availableServices.length === 0}
          >
            <Plus className="h-4 w-4" />
            Adicionar serviço
          </Button>
        </form>

        {assignments.length === 0 ? (
          availableServices.length === 0 ? (
            <EmptyState
              icon={Puzzle}
              title="Nenhuma atribuição disponível no momento"
              description="Cadastre e ative serviços na seção de serviços para depois vinculá-los a este profissional."
              action={<Button href="/admin/services">Abrir serviços</Button>}
            />
          ) : (
            <EmptyState
              icon={Puzzle}
              title="Nenhum serviço atribuído"
              description="Escolha um serviço ativo acima para começar a montar a capacidade operacional deste profissional."
            />
          )
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <div
                key={assignment.assignmentId}
                className="rounded-2xl border border-stroke-soft bg-surface-card p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-content-primary">
                        {assignment.serviceName}
                      </p>
                      <Badge tone={assignment.active ? "success" : "warning"}>
                        {assignment.active ? "Serviço ativo" : "Serviço inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-content-secondary">
                      {assignment.serviceDurationMinutes} minutos •{" "}
                      {formatCurrency(assignment.basePrice)}
                    </p>
                    {!assignment.active ? (
                      <p className="text-sm text-content-warning">
                        Este serviço está inativo e não participa de novas descobertas públicas.
                      </p>
                    ) : null}
                  </div>

                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setConfirmingRemovalId(assignment.assignmentId)}
                  >
                    <Link2Off className="h-4 w-4" />
                    Remover vínculo
                  </Button>
                </div>

                {confirmingRemovalId === assignment.assignmentId ? (
                  <div className="mt-4 rounded-2xl border border-content-danger/20 bg-surface-danger-soft p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-content-danger">
                        Confirmar remoção
                      </p>
                      <p className="text-sm text-content-danger">
                        O profissional perderá a capacidade de atender este serviço em novas reservas assim que o vínculo for removido.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="danger"
                        loading={isPending}
                        onClick={() => void handleDelete(assignment.serviceId)}
                      >
                        Confirmar remoção
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setConfirmingRemovalId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
