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
            <div className="h-14 w-14 rounded-xl bg-surface-muted flex items-center justify-center">
          {/* icon placeholder */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="4" fill="rgba(99,14,212,0.08)"/></svg>
        </div>
        <div className="flex-1">
          <p className="headline-sm font-medium text-content-primary">{service.name}</p>
          <p className="label-md text-content-secondary mt-1">{(service as any).descricao ?? ''}</p>
        </div>
        <div className="text-right">
          <p className="body-md text-content-secondary">{formatCurrency((service as any).basePrice ?? (service as any).precoBase ?? 0)}</p>
          <p className="headline-sm font-semibold text-content-primary mt-2">{(service as any).durationMinutes ?? (service as any).duracaoMinutos ?? 0} min</p>
        </div>
      </div>
    </button>
  );
}
