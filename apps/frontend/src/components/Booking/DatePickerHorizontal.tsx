"use client";

import React from "react";
import { format } from "date-fns";

export function DatePickerHorizontal({
  days = 7,
  selected,
  onSelect,
}: {
  days?: number;
  selected?: string; // ISO date
  onSelect?: (iso: string) => void;
}) {
  const today = new Date();
  const dates = Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="overflow-x-auto hide-scrollbar">
      <div className="flex gap-3">
        {dates.map((d) => {
          const iso = d.toISOString().slice(0, 10);
          const isSelected = selected === iso;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect?.(iso)}
              className={"px-4 py-2 rounded-full min-w-[72px] text-center " + (isSelected ? "bg-primary text-on-primary" : "bg-surface-muted text-content-primary hover:shadow-soft")}
              aria-pressed={isSelected}
            >
              <div className="text-xs text-content-secondary">{format(d, 'EEE')}</div>
              <div className="text-sm font-medium">{format(d, 'dd/MM')}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
