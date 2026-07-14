export function formatDate(input?: string | number | Date | null): string {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return String(input);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function formatDateTime(input?: string | number | Date | null): string {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return String(input);
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export function timeAgo(input?: string | number | Date | null): string {
  if (!input) return "";
  const d = new Date(input);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (isNaN(diff)) return String(input);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(input);
}
