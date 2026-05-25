export function addDays(value: Date, amount: number) {
  const nextValue = new Date(value);
  nextValue.setDate(nextValue.getDate() + amount);
  return nextValue;
}

export function formatISODate(value: Date) {
  return value.toISOString().slice(0, 10);
}
