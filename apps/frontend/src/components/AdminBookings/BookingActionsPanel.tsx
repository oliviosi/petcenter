"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Ban, CheckCircle2, UserX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  canCancelBooking,
  canCompleteBooking,
  canNoShowBooking,
} from "@/lib/adminBooking";
import {
  cancelAdminBookingSchema,
  completeAdminBookingSchema,
  noShowAdminBookingSchema,
  type CancelAdminBookingValues,
  type CompleteAdminBookingValues,
  type NoShowAdminBookingValues,
} from "@/lib/validations/adminBookingAction";
import type {
  AdminBookingState,
  SubmitAdminCancelBookingAction,
  SubmitAdminCompleteBookingAction,
  SubmitAdminNoShowBookingAction,
} from "@/types";

type BookingActionKind = "complete" | "cancel" | "no-show";

interface BookingActionsPanelProps {
  bookingId: string;
  state: AdminBookingState;
  completeBookingAction: SubmitAdminCompleteBookingAction;
  cancelBookingAction: SubmitAdminCancelBookingAction;
  noShowBookingAction: SubmitAdminNoShowBookingAction;
}

const actionContent: Record<
  BookingActionKind,
  {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    buttonLabel: string;
  }
> = {
  complete: {
    title: "Concluir atendimento",
    description:
      "Registre o preço final cobrado para encerrar o atendimento e liberar o fluxo posterior de feedback.",
    icon: CheckCircle2,
    buttonLabel: "Confirmar conclusão",
  },
  cancel: {
    title: "Cancelar reserva",
    description:
      "Use esta ação apenas quando a reserva não puder mais acontecer. O backend valida a elegibilidade pelo estado atual.",
    icon: Ban,
    buttonLabel: "Confirmar cancelamento",
  },
  "no-show": {
    title: "Registrar não comparecimento",
    description:
      "Marque o não comparecimento somente para reservas confirmadas em que o cliente não compareceu ao horário.",
    icon: UserX,
    buttonLabel: "Confirmar não comparecimento",
  },
};

export function BookingActionsPanel({
  bookingId,
  state,
  completeBookingAction,
  cancelBookingAction,
  noShowBookingAction,
}: BookingActionsPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<BookingActionKind | null>(
    canCompleteBooking(state)
      ? "complete"
      : canCancelBooking(state)
        ? "cancel"
        : canNoShowBooking(state)
          ? "no-show"
          : null,
  );
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [noShowError, setNoShowError] = useState<string | null>(null);
  const completeForm = useForm<CompleteAdminBookingValues>({
    resolver: zodResolver(completeAdminBookingSchema),
    defaultValues: {
      bookingId,
      finalChargedPrice: "",
      confirm: false,
    },
  });
  const cancelForm = useForm<CancelAdminBookingValues>({
    resolver: zodResolver(cancelAdminBookingSchema),
    defaultValues: {
      bookingId,
      reason: "",
      confirm: false,
    },
  });
  const noShowForm = useForm<NoShowAdminBookingValues>({
    resolver: zodResolver(noShowAdminBookingSchema),
    defaultValues: {
      bookingId,
      reason: "",
      confirm: false,
    },
  });
  const actionButtons = [
    canCompleteBooking(state) ? ("complete" as const) : null,
    canCancelBooking(state) ? ("cancel" as const) : null,
    canNoShowBooking(state) ? ("no-show" as const) : null,
  ].filter(Boolean) as BookingActionKind[];

  async function handleCompleteSubmit(values: CompleteAdminBookingValues) {
    setCompleteError(null);
    const result = await completeBookingAction(values);

    if (!result.success) {
      setCompleteError(result.message);

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) {
          completeForm.setError(field as keyof CompleteAdminBookingValues, { message });
        }
      }

      return;
    }

    startTransition(() => {
      router.replace(result.redirectTo);
    });
  }

  async function handleCancelSubmit(values: CancelAdminBookingValues) {
    setCancelError(null);
    const result = await cancelBookingAction(values);

    if (!result.success) {
      setCancelError(result.message);

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) {
          cancelForm.setError(field as keyof CancelAdminBookingValues, { message });
        }
      }

      return;
    }

    startTransition(() => {
      router.replace(result.redirectTo);
    });
  }

  async function handleNoShowSubmit(values: NoShowAdminBookingValues) {
    setNoShowError(null);
    const result = await noShowBookingAction(values);

    if (!result.success) {
      setNoShowError(result.message);

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) {
          noShowForm.setError(field as keyof NoShowAdminBookingValues, { message });
        }
      }

      return;
    }

    startTransition(() => {
      router.replace(result.redirectTo);
    });
  }

  if (actionButtons.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm font-medium text-content-primary">
          Nenhuma ação operacional disponível
        </p>
        <p className="mt-2 text-sm text-content-secondary">
          O estado atual da reserva já é terminal ou não permite ajustes adicionais neste dashboard.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-content-primary">
            Ações operacionais
          </h2>
          <p className="text-sm text-content-secondary">
            Toda mutação usa o JWT da sessão atual. O backend mantém o escopo da empresa e valida a transição.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {actionButtons.map((action) => {
            const Icon = actionContent[action].icon;

            return (
              <Button
                key={action}
                type="button"
                variant={activeAction === action ? "primary" : "secondary"}
                onClick={() => setActiveAction(action)}
              >
                <Icon className="h-4 w-4" />
                {actionContent[action].title}
              </Button>
            );
          })}
        </div>

        {activeAction === "complete" ? (
          <form
            onSubmit={completeForm.handleSubmit(handleCompleteSubmit)}
            className="space-y-5 rounded-2xl bg-surface-muted p-5"
          >
            <input type="hidden" {...completeForm.register("bookingId")} />
            <div className="space-y-2">
              <p className="text-sm font-medium text-content-primary">
                {actionContent.complete.title}
              </p>
              <p className="text-sm text-content-secondary">
                {actionContent.complete.description}
              </p>
            </div>

            {completeError ? (
              <div className="rounded-2xl border border-content-danger/20 bg-surface-danger-soft px-4 py-3 text-sm text-content-danger">
                {completeError}
              </div>
            ) : null}

            <FormField
              label="Preço final cobrado"
              error={completeForm.formState.errors.finalChargedPrice?.message}
              hint="Use ponto ou vírgula para centavos."
            >
              <Input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0,00"
                {...completeForm.register("finalChargedPrice")}
              />
            </FormField>

            <label className="flex items-start gap-3 rounded-2xl border border-stroke-soft bg-surface-card px-4 py-3 text-sm text-content-secondary">
              <input type="checkbox" className="mt-1" {...completeForm.register("confirm")} />
              <span>
                Confirmo que o atendimento foi realizado e que o preço final informado deve encerrar a reserva.
              </span>
            </label>
            {completeForm.formState.errors.confirm?.message ? (
              <p className="text-xs text-content-danger">
                {completeForm.formState.errors.confirm.message}
              </p>
            ) : null}

            <Button
              type="submit"
              loading={completeForm.formState.isSubmitting || isPending}
            >
              {actionContent.complete.buttonLabel}
            </Button>
          </form>
        ) : null}

        {activeAction === "cancel" ? (
          <form
            onSubmit={cancelForm.handleSubmit(handleCancelSubmit)}
            className="space-y-5 rounded-2xl bg-surface-muted p-5"
          >
            <input type="hidden" {...cancelForm.register("bookingId")} />
            <div className="space-y-2">
              <p className="text-sm font-medium text-content-primary">
                {actionContent.cancel.title}
              </p>
              <p className="text-sm text-content-secondary">
                {actionContent.cancel.description}
              </p>
            </div>

            {cancelError ? (
              <div className="rounded-2xl border border-content-danger/20 bg-surface-danger-soft px-4 py-3 text-sm text-content-danger">
                {cancelError}
              </div>
            ) : null}

            <FormField
              label="Motivo do cancelamento"
              error={cancelForm.formState.errors.reason?.message}
            >
              <Textarea
                placeholder="Explique por que a reserva precisa ser cancelada."
                {...cancelForm.register("reason")}
              />
            </FormField>

            <label className="flex items-start gap-3 rounded-2xl border border-stroke-soft bg-surface-card px-4 py-3 text-sm text-content-secondary">
              <input type="checkbox" className="mt-1" {...cancelForm.register("confirm")} />
              <span>
                Confirmo que a reserva não deve mais acontecer e que o motivo acima está correto.
              </span>
            </label>
            {cancelForm.formState.errors.confirm?.message ? (
              <p className="text-xs text-content-danger">
                {cancelForm.formState.errors.confirm.message}
              </p>
            ) : null}

            <Button type="submit" loading={cancelForm.formState.isSubmitting || isPending}>
              {actionContent.cancel.buttonLabel}
            </Button>
          </form>
        ) : null}

        {activeAction === "no-show" ? (
          <form
            onSubmit={noShowForm.handleSubmit(handleNoShowSubmit)}
            className="space-y-5 rounded-2xl bg-surface-muted p-5"
          >
            <input type="hidden" {...noShowForm.register("bookingId")} />
            <div className="space-y-2">
              <p className="text-sm font-medium text-content-primary">
                {actionContent["no-show"].title}
              </p>
              <p className="text-sm text-content-secondary">
                {actionContent["no-show"].description}
              </p>
            </div>

            {noShowError ? (
              <div className="rounded-2xl border border-content-danger/20 bg-surface-danger-soft px-4 py-3 text-sm text-content-danger">
                {noShowError}
              </div>
            ) : null}

            <FormField
              label="Motivo do não comparecimento"
              error={noShowForm.formState.errors.reason?.message}
            >
              <Textarea
                placeholder="Descreva o contexto do não comparecimento."
                {...noShowForm.register("reason")}
              />
            </FormField>

            <label className="flex items-start gap-3 rounded-2xl border border-stroke-soft bg-surface-card px-4 py-3 text-sm text-content-secondary">
              <input type="checkbox" className="mt-1" {...noShowForm.register("confirm")} />
              <span>
                Confirmo que o cliente não compareceu ao horário e que o registro acima pode encerrar a reserva.
              </span>
            </label>
            {noShowForm.formState.errors.confirm?.message ? (
              <p className="text-xs text-content-danger">
                {noShowForm.formState.errors.confirm.message}
              </p>
            ) : null}

            <Button type="submit" loading={noShowForm.formState.isSubmitting || isPending}>
              {actionContent["no-show"].buttonLabel}
            </Button>
          </form>
        ) : null}
      </div>
    </Card>
  );
}
