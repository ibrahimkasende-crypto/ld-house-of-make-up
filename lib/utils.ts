export function nowIso() {
  return new Date().toISOString();
}

export function parisToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeZone: "Europe/Paris",
  }).format(date);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(date);
}

export function formatMoney(cents: number | null | undefined, currency = "EUR") {
  if (cents == null) return "Tarif sur demande";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function whatsappHref(raw: string | null | undefined) {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}

export async function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  const { headers } = await import("next/headers");
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") || incoming.get("host");
  if (host && !host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
    const proto = incoming.get("x-forwarded-proto") || "https";
    return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

export function clientName(client: { firstName: string; lastName: string }) {
  return `${client.firstName} ${client.lastName}`.trim();
}
