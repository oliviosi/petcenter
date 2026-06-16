"use client";

import React from "react";

export function TimePill({ time, selected, onClick }: { time: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={"px-3 py-2 rounded-full text-sm font-medium min-w-[88px] " + (selected ? "bg-primary text-on-primary" : "bg-surface-muted text-content-primary hover:shadow-soft")}
    >
      {time}
    </button>
  );
}
