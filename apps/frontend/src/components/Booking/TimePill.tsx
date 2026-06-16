"use client";

import React from "react";

export function TimePill({ time, selected, onClick }: { time: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={"time-pill " + (selected ? "selected" : "")}
    >
      {time}
    </button>
  );
}
