"use client";

import React from "react";
import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/Card";

import type { PublicPetshopService } from "@/types";

export function ServiceCard({
  service,
  selected,
  onClick,
}: {
  service: PublicPetshopService & { descricao?: string };
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={"service-card w-full text-left " + (selected ? "selected" : "hover:-translate-y-0.5 hover:shadow-soft")}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-content-primary">{service.name}</p>
          <p className="text-xs text-content-secondary mt-1">{(service as any).descricao ?? ''}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-content-secondary">{formatCurrency((service as any).basePrice ?? (service as any).precoBase ?? 0)}</p>
          <p className="text-lg font-semibold text-content-primary mt-2">{(service as any).durationMinutes ?? (service as any).duracaoMinutos ?? 0} min</p>
        </div>
      </div>
    </button>
  );
}
