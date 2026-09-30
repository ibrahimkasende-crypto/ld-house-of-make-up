"use server";

import { createQuoteRequest } from "@/lib/crm";

export async function submitQuote(_state: { ok: boolean; error: string }, formData: FormData) {
  return createQuoteRequest({
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
}
