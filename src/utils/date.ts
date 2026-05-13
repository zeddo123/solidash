export function formatDateIntl(date: Date): string {
  const datePart = new Intl.DateTimeFormat(navigator.language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const timePart = date.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return `${datePart} ${timePart}`;
}
