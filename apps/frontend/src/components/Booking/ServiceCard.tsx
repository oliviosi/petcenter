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
      className={`service-card ${selected ? 'selected' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-surface-muted flex items-center justify-center">
          {/* icon placeholder */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="3" fill="rgba(124,58,237,0.08)"/></svg>
        </div>
        <div className="flex-1">
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
