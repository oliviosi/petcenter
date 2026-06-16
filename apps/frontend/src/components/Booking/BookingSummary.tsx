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
    <div className="booking-summary p-4 lg:sticky lg:top-[var(--booking-summary-top-offset)] lg:self-start w-full">
      <div className="space-y-2">
        <p className="label-md text-content-secondary">Dados para a solicitação</p>
        <h2 className="headline-md text-content-primary">Resumo do Agendamento</h2>
      </div>

      <div className="mt-6">
        <div className="booking-panel w-full text-white">
          <div className="space-y-4">
            {children}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="label-md text-white/80">Total estimado</p>
                <p className="headline-sm font-bold text-white">R$ {total}</p>
              </div>

              <Button type="button" className="w-48 rounded-full bg-white text-purple-600 font-button shadow-lg" onClick={onConfirm}>Confirmar</Button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 label-md text-white/90">
              <strong className="text-white">DICA PRO</strong>
              <p className="mt-2 body-md">Adicione hidratação de pelagem por apenas R$ 25,00 extras no checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
