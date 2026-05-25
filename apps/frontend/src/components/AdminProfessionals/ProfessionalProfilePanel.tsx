"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SetupNotice } from "@/components/AdminSetup/SetupNotice";
import { ProfessionalForm } from "@/components/AdminProfessionals/ProfessionalForm";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { AdminMutationResult, AdminProfessional } from "@/types";
import type { AdminProfessionalFieldsValues } from "@/lib/validations/adminProfessional";

interface ProfessionalProfilePanelProps {
  professional: AdminProfessional;
  updateProfessionalAction: (
    professionalId: string,
    values: AdminProfessionalFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminProfessionalFieldsValues, string>>>;
}

export function ProfessionalProfilePanel({
  professional,
  updateProfessionalAction,
}: ProfessionalProfilePanelProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    tone: "success" | "danger";
    message: string;
  } | null>(null);

  async function handleSubmit(values: AdminProfessionalFieldsValues) {
    const result = await updateProfessionalAction(professional.id, values);

    if (result.success) {
      setFeedback({ tone: "success", message: result.message });
      startTransition(() => {
        router.refresh();
      });
    } else {
      setFeedback({ tone: "danger", message: result.message });
    }

    return result;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-content-primary">
              Perfil operacional
            </h2>
            <Badge tone={professional.isActive ? "success" : "warning"}>
              {professional.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <p className="text-sm text-content-secondary">
            Atualize os dados base antes de ajustar vínculos e agenda recorrente.
          </p>
        </div>

        {!professional.isActive ? (
          <SetupNotice
            title="Profissional fora da vitrine pública"
            description="Reative o profissional na lista principal quando quiser voltar a disponibilizá-lo no catálogo público e nas configurações operacionais dependentes."
            tone="warning"
          />
        ) : null}

        {feedback ? (
          <SetupNotice
            title={feedback.tone === "success" ? "Perfil atualizado" : "Não foi possível atualizar o perfil"}
            description={feedback.message}
            tone={feedback.tone === "success" ? "success" : "danger"}
          />
        ) : null}

        <div className="rounded-2xl bg-surface-muted p-5">
          <ProfessionalForm
            title="Editar perfil"
            description="Nome e especialidade ajudam a equipe a identificar rapidamente quem atende cada frente do petshop."
            submitLabel="Salvar perfil"
            defaultValues={{
              name: professional.name,
              specialty: professional.specialty ?? "",
            }}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Card>
  );
}
