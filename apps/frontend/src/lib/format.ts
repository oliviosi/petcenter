const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatRating(value: number) {
  return `${value.toFixed(1)} ★`;
}

export function formatDayLabel(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatTimeRange(start: string, end: string) {
  return `${timeFormatter.format(new Date(start))} às ${timeFormatter.format(
    new Date(end),
  )}`;
}

export function formatDateTimeValue(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDateTimeRange(start: string, end: string) {
  return `${formatDateTimeValue(start)} • ${timeFormatter.format(new Date(end))}`;
}
