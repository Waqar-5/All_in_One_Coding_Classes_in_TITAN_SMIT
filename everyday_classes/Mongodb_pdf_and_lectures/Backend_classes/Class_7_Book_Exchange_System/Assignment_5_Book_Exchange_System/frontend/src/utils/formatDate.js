export function formatDate(dateString) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDueStamp(dateString) {
  if (!dateString) return "— — —";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "— — —";
  return date
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}
