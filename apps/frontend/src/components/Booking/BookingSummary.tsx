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
    <div className="booking-summary p-4 lg:sticky lg:top-[6rem] lg:self-start w-full">
      <div className="space-y-2">
        <p className="text-sm text-white/80">Dados para a solicitação</p>
        <h2 className="text-2xl font-semibold text-white">Resumo do Agendamento</h2>
      </div>

      <div className="mt-6">
        <div className="rounded-3xl bg-purple-600 p-8 shadow-lg text-white flex flex-col justify-between w-full min-h-[460px]">
          <div>
            {children}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total estimado</p>
                <p className="text-2xl font-bold text-white">R$ {total}</p>
              </div>

              <Button type="button" className="w-44 rounded-full bg-white text-purple-600" onClick={onConfirm}>Confirmar</Button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm text-white/90">
              <strong className="text-white">DICA PRO</strong>
              <p className="mt-2">Adicione hidratação de pelagem por apenas R$ 25,00 extras no checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
