export const weekdayOptions = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" },
] as const;

export function getWeekdayLabel(value: number) {
  return weekdayOptions.find((option) => Number(option.value) === value)?.label ?? "Dia inválido";
}

export function normalizeTimeValue(value: string) {
  return value.slice(0, 5);
}

export function formatAvailabilityRange(startTime: string, endTime: string) {
  return `${normalizeTimeValue(startTime)} às ${normalizeTimeValue(endTime)}`;
}
