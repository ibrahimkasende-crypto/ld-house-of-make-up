import { eq } from "drizzle-orm";
import { getEmailProvider } from "@/lib/email";
import { getDb } from "@/lib/db";
import { clients, messages, serviceRequests, services } from "@/lib/db/schema";
import { parseOptionalInt, quoteSchema } from "@/lib/validators";
import { nowIso } from "@/lib/utils";

const attempts = new Map<string, number[]>();

export type QuoteInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  serviceId: string;
  desiredDate?: string;
  location?: string;
  peopleCount?: string;
  budget?: string;
  message?: string;
};

export async function createQuoteRequest(input: QuoteInput) {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Vérifiez le formulaire." };
  }
  const data = parsed.data;
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false as const, error: "L'adresse e-mail n'est pas valide." };
  }
  const email = data.email?.trim()
    ? data.email.trim().toLowerCase()
    : `demande.${data.phone.replace(/[^\d]/g, "") || "sans-numero"}@clients.ldhouse`;
  const canEmailClient = !email.endsWith("@clients.ldhouse");
  if (limited(email)) {
    return { ok: false as const, error: "Trop de demandes pour cette adresse. Réessayez dans un moment." };
  }

  const db = await getDb();
  const service = await db.select().from(services).where(eq(services.id, data.serviceId)).limit(1);
  if (!service[0] || service[0].active !== 1) {
    return { ok: false as const, error: "Cette prestation n'est pas disponible." };
  }

  const stamp = nowIso();
  const existing = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
  let clientId = existing[0]?.id ?? crypto.randomUUID();
  if (existing[0]) {
    await db
      .update(clients)
      .set({
        firstName: data.firstName,
        lastName: data.lastName || "",
        phone: data.phone,
        country: data.country,
        city: data.city,
        updatedAt: stamp,
      })
      .where(eq(clients.id, clientId));
  } else {
    await db.insert(clients).values({
      id: clientId,
      firstName: data.firstName,
      lastName: data.lastName || "",
      email,
      phone: data.phone,
      country: data.country,
      city: data.city,
      notes: "",
      createdAt: stamp,
      updatedAt: stamp,
    });
  }

  const count = await db.select({ id: serviceRequests.id }).from(serviceRequests);
  const publicRef = `LD-${new Date().getFullYear()}-${String(count.length + 1).padStart(4, "0")}`;
  const requestId = crypto.randomUUID();
  await db.insert(serviceRequests).values({
    id: requestId,
    publicRef,
    clientId,
    serviceId: service[0].id,
    serviceLabel: service[0].title,
    desiredDate: data.desiredDate || null,
    location: data.location || "",
    peopleCount: parseOptionalInt(data.peopleCount),
    budget: data.budget || null,
    message: data.message || "",
    status: "NOUVELLE",
    createdAt: stamp,
    updatedAt: stamp,
  });

  const clientText = `Bonjour ${data.firstName},\n\nNous avons bien reçu votre demande (${publicRef}) concernant : ${service[0].title}.\nLaura ou son équipe reviendra vers vous rapidement.\n\nLD House of Make Up`;
  if (!canEmailClient) {
    await db.insert(messages).values({
      id: crypto.randomUUID(),
      requestId,
      direction: "system",
      toEmail: "",
      subject: `Demande ${publicRef} sans e-mail`,
      body: "Aucun e-mail client : la demande part vers WhatsApp.",
      status: "logged",
      createdAt: stamp,
    });
  }
  const adminText = `Nouvelle demande ${publicRef}\n${data.firstName} ${data.lastName}\n${email}\n${data.phone}\n${data.city}, ${data.country}\nPrestation : ${service[0].title}\nDate souhaitée : ${data.desiredDate || "non précisée"}\nLieu : ${data.location || "non précisé"}\nPersonnes : ${data.peopleCount || "non précisé"}\nBudget indicatif : ${data.budget || "non précisé"}\n\n${data.message || ""}`;

  if (canEmailClient) await deliver(requestId, "outbound", email, "Nous avons bien reçu votre demande", clientText);
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminEmail) {
    await deliver(requestId, "inbound", adminEmail, `Nouvelle demande de prestation ${publicRef}`, adminText);
  } else {
    await db.insert(messages).values({
      id: crypto.randomUUID(),
      requestId,
      direction: "system",
      toEmail: "",
      subject: `Nouvelle demande ${publicRef}`,
      body: `${adminText}\n\nADMIN_NOTIFY_EMAIL n'est pas configuré. La notification est enregistrée, pas envoyée.`,
      status: "logged",
      createdAt: stamp,
    });
  }

  return { ok: true as const, error: "", reference: publicRef };
}

async function deliver(requestId: string, direction: string, to: string, subject: string, body: string) {
  const db = await getDb();
  let status = "logged";
  let stored = body;
  try {
    const result = await getEmailProvider().send({ to, subject, text: body });
    status = result.status;
    if (result.status !== "sent") stored = `${body}\n\n[${result.detail}]`;
  } catch (error) {
    status = "failed";
    stored = `${body}\n\n[${error instanceof Error ? error.message : "Échec d'envoi"}]`;
  }
  await db.insert(messages).values({
    id: crypto.randomUUID(),
    requestId,
    direction,
    toEmail: to,
    subject,
    body: stored,
    status,
    createdAt: nowIso(),
  });
}

function limited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < 60 * 60 * 1000);
  if (recent.length >= 5) return true;
  recent.push(now);
  attempts.set(key, recent);
  return false;
}
