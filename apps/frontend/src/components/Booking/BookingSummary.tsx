"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export function BookingSummary({
  total = 0,
  onConfirm,
  children,
}: {
  total?: number;
  onConfirm?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="booking-summary p-4 lg:sticky lg:top-[6rem]">
      <div className="space-y-2">
        <p className="text-sm text-content-secondary">Dados para a solicitação</p>
        <h2 className="text-2xl font-semibold text-content-primary">Resumo do Agendamento</h2>
      </div>

      <div className="mt-6 rounded-2xl bg-surface-card p-6 shadow-card">
        {children}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-content-secondary">Total estimado</p>
            <p className="text-2xl font-bold text-content-primary">R$ {total}</p>
          </div>

          <Button type="button" className="w-48 bg-accent text-on-accent" onClick={onConfirm}>Confirmar Agendamento</Button>
        </div>

        <div className="rounded-2xl border border-stroke-soft bg-surface-muted p-4 text-sm text-content-secondary">
          <strong className="text-content-primary">DICA PRO</strong>
          <p className="mt-2">Adicione hidratação de pelagem por apenas R$ 25,00 extras no checkout.</p>
        </div>
      </div>
    </div>
  );
}
