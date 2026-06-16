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
      className={`service-card group cursor-pointer p-md rounded-xl ${selected ? 'selected' : ''}`}>
      <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-surface-muted flex items-center justify-center shadow-soft">
                {/* icon selection based on service name */}
                {service.name.toLowerCase().includes('banho') ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M3 12c0-3.866 3.582-7 8-7s8 3.134 8 7v5H3v-5z" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 12v-2" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : service.name.toLowerCase().includes('corte') || service.name.toLowerCase().includes('unha') ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M21 15.5l-6.6-6.6" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 21s4-4 8.5-4 8.5 4 8.5 4" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-[20px] text-content-subtle">pets</span>
                )}
              </div>
        <div className="flex-1">
          <p className="headline-sm font-medium text-content-primary">{service.name}</p>
          <p className="label-md text-content-secondary mt-1">{(service as any).descricao ?? ''}</p>
        </div>
        <div className="text-right">
          <p className="headline-sm text-content-primary">{formatCurrency((service as any).basePrice ?? (service as any).precoBase ?? 0)}</p>
          <p className="body-md text-content-secondary mt-2">{(service as any).durationMinutes ?? (service as any).duracaoMinutos ?? 0} min</p>
        </div>
      </div>
    </button>
  );
}
