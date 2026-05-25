"use client";

import { CalendarClock, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDayLabel, formatTimeRange } from "@/lib/format";
import type { PublicBookingSlot } from "@/types";

interface SlotListProps {
  slots: PublicBookingSlot[];
  selectedSlotId: string | null;
  professionalLookup: Record<string, string>;
  onSelect: (slot: PublicBookingSlot) => void;
}

export function SlotList({
  slots,
  selectedSlotId,
  professionalLookup,
  onSelect,
}: SlotListProps) {
  if (slots.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Nenhum horário disponível"
        description="Tente mudar o serviço, ajustar o profissional ou consultar outro intervalo de datas."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {slots.map((slot) => {
        const slotId = `${slot.professionalId}-${slot.slotStart}`;
        const isSelected = slotId === selectedSlotId;

        return (
          <button
            key={slotId}
            type="button"
            onClick={() => onSelect(slot)}
            className="text-left"
          >
            <Card
              className={
                isSelected
                  ? "border-stroke-brand bg-surface-brand-soft p-5"
                  : "p-5 hover:border-stroke-strong"
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-content-primary">
                      {formatDayLabel(slot.slotStart)}
                    </p>
                    <p className="text-sm text-content-secondary">
                      {formatTimeRange(slot.slotStart, slot.slotEnd)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-content-secondary">
                    <UserRound className="h-4 w-4 text-content-subtle" />
                    <span>
                      {professionalLookup[slot.professionalId] || "Profissional disponível"}
                    </span>
                  </div>
                </div>

                <Badge tone={isSelected ? "brand" : "neutral"}>
                  {isSelected ? "Horário selecionado" : "Disponível"}
                </Badge>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
