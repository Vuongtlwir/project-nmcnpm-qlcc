export function formatDate(value, options = {}) {
  if (!value) return "";

  const date = typeof value === "string" || typeof value === "number" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(date);
}

export function formatCurrency(value) {
  if (value == null || value === "") return "";
  const amount = Number(String(value).replace(/[^0-9.-]+/g, ""));
  if (Number.isNaN(amount)) return "";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}
