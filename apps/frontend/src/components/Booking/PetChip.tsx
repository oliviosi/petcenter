"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export function PetChip({ name, species, avatar, selected, onClick }: {
  name: string;
  species?: string;
  avatar?: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`pet-chip group cursor-pointer bg-surface-container-lowest p-3 rounded-xl shadow-sm border-2 transition-all ${selected ? "border-stroke-brand" : "border-transparent hover:scale-[1.02]"}`}
    >
      <div className="flex flex-col items-center">
        <div className="h-24 w-24 rounded-xl bg-surface-muted overflow-hidden mb-3">
          {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-surface-muted" />}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-content-primary">{name}</p>
          {species ? <p className="text-xs text-content-secondary mt-1">{species}</p> : null}
        </div>
      </div>
    </button>
  );
}
