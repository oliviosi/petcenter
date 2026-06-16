"use client";

import React from "react";

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
              className={"date-pill text-center " + (isSelected ? "selected" : "")}
              aria-pressed={isSelected}
            >
              <div className="text-xs text-content-secondary">{d.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
              <div className="text-sm font-medium">{d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
