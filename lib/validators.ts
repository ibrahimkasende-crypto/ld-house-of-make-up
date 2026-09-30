import { z } from "zod";
import { PORTFOLIO_CATEGORIES, REQUEST_STATUSES, WORKSHOP_KINDS } from "@/lib/db/schema";

export const quoteSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis.").max(80),
  lastName: z.string().trim().min(1, "Le nom est requis.").max(80),
  email: z.string().trim().email("L'adresse e-mail n'est pas valide.").max(160),
  phone: z.string().trim().min(6, "Le téléphone est requis.").max(40),
  country: z.string().trim().min(2, "Le pays est requis.").max(80),
  city: z.string().trim().min(1, "La ville est requise.").max(80),
  serviceId: z.string().trim().min(1, "Choisissez une prestation."),
  desiredDate: z.string().trim().max(20).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  peopleCount: z.string().trim().optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  duration: z.string().trim().max(80).optional().or(z.literal("")),
  availability: z.string().trim().max(160).optional().or(z.literal("")),
  price: z.string().trim().optional().or(z.literal("")),
  pricePublic: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export const portfolioSchema = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  category: z.enum(PORTFOLIO_CATEGORIES.map((item) => item.id) as [string, ...string[]]),
  sourceNote: z.string().trim().max(500).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(999),
  published: z.boolean().optional(),
});

export const workshopSchema = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(4).max(2000),
  kind: z.enum(WORKSHOP_KINDS.map((item) => item.id) as [string, ...string[]]),
  capacity: z.string().trim().optional().or(z.literal("")),
  eventDate: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  price: z.string().trim().optional().or(z.literal("")),
  pricePublic: z.boolean().optional(),
  status: z.enum(["draft", "published", "full", "past", "cancelled"]),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export const statusSchema = z.enum(REQUEST_STATUSES);

export function parsePriceToCents(value: string | undefined) {
  if (!value || !value.trim()) return null;
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

export function parseOptionalInt(value: string | undefined) {
  if (!value || !value.trim()) return null;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) return null;
  return number;
}
