export function formatDate(input: Date | string | number): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";

  // day month year, e.g. "1 Jan 2025"
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(input: Date | string | number): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const period = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const minStr = minutes.toString().padStart(2, "0"); // "03", "00", "12"
  return `${hours}:${minStr}${period}`; // e.g. "3:12pm", "5:00am"
}
