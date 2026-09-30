"use server";

import { createQuoteRequest } from "@/lib/crm";

export type QuoteState = { ok: boolean; error: string; reference: string };

export async function submitQuote(_state: QuoteState, formData: FormData): Promise<QuoteState> {
  const result = await createQuoteRequest({
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    country: String(formData.get("country") ?? ""),
    city: String(formData.get("city") ?? ""),
    serviceId: String(formData.get("serviceId") ?? ""),
    desiredDate: String(formData.get("desiredDate") ?? ""),
    location: String(formData.get("location") ?? ""),
    peopleCount: String(formData.get("peopleCount") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    message: String(formData.get("message") ?? ""),
  });
  return { ok: result.ok, error: result.error, reference: result.ok ? result.reference : "" };
}
