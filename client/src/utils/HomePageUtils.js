export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long", // "short" for Mar, "numeric" for 03
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
