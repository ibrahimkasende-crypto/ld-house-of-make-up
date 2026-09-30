"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  adminNotes,
  appointments,
  instagramPosts,
  portfolioItems,
  quotes,
  serviceRequests,
  services,
  settings,
  users,
  workshops,
  type RequestStatus,
} from "@/lib/db/schema";
import { saveImage } from "@/lib/uploads";
import { nowIso, slugify } from "@/lib/utils";
import {
  parseOptionalInt,
  parsePriceToCents,
  portfolioSchema,
  serviceSchema,
  statusSchema,
  workshopSchema,
} from "@/lib/validators";

async function guard() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Non autorisé.");
  return session.user.email;
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const { redirect } = await import("next/navigation");
      redirect("/admin/login?error=1");
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function updateRequestStatus(formData: FormData) {
  await guard();
  const id = String(formData.get("id"));
  const status = statusSchema.parse(formData.get("status")) as RequestStatus;
  const db = await getDb();
  await db.update(serviceRequests).set({ status, updatedAt: nowIso() }).where(eq(serviceRequests.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
}

export async function addQuote(formData: FormData) {
  await guard();
  const requestId = String(formData.get("requestId"));
  const db = await getDb();
  await db.insert(quotes).values({
    id: crypto.randomUUID(),
    requestId,
    amountCents: parsePriceToCents(String(formData.get("amount") ?? "")),
    currency: "EUR",
    note: String(formData.get("note") ?? "").slice(0, 2000),
    status: String(formData.get("status") ?? "draft"),
    createdAt: nowIso(),
  });
  if (String(formData.get("status")) === "sent") {
    await db.update(serviceRequests).set({ status: "DEVIS_ENVOYE", updatedAt: nowIso() }).where(eq(serviceRequests.id, requestId));
  }
  revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath("/admin");
}

export async function addAppointment(formData: FormData) {
  await guard();
  const requestId = String(formData.get("requestId") || "") || null;
  const clientId = String(formData.get("clientId"));
  const db = await getDb();
  await db.insert(appointments).values({
    id: crypto.randomUUID(),
    requestId,
    clientId,
    startsAt: new Date(String(formData.get("startsAt"))).toISOString(),
    endsAt: null,
    location: String(formData.get("location") ?? "").slice(0, 160),
    status: "planned",
    notes: String(formData.get("notes") ?? "").slice(0, 2000),
    createdAt: nowIso(),
  });
  revalidatePath("/admin");
  if (requestId) revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function saveClientNotes(formData: FormData) {
  const email = await guard();
  const clientId = String(formData.get("clientId"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  const db = await getDb();
  await db.insert(adminNotes).values({
    id: crypto.randomUUID(),
    clientId,
    authorEmail: email,
    body: body.slice(0, 4000),
    createdAt: nowIso(),
  });
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function saveService(formData: FormData) {
  await guard();
  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    duration: formData.get("duration") || "",
    availability: formData.get("availability") || "",
    price: formData.get("price") || "",
    pricePublic: formData.get("pricePublic") === "on",
    active: formData.get("active") === "on",
    sortOrder: formData.get("sortOrder") || 0,
  });
  if (!parsed.success) return;
  const db = await getDb();
  const id = String(formData.get("id") || "");
  const file = formData.get("image");
  const imagePath = file instanceof File ? await saveImage(file, "services") : null;
  const stamp = nowIso();
  const values = {
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    description: parsed.data.description,
    duration: parsed.data.duration || null,
    availability: parsed.data.availability || "Tarif sur demande",
    priceCents: parsed.data.pricePublic ? parsePriceToCents(parsed.data.price) : null,
    pricePublic: parsed.data.pricePublic ? 1 : 0,
    active: parsed.data.active ? 1 : 0,
    sortOrder: parsed.data.sortOrder,
    updatedAt: stamp,
  };
  if (id) {
    await db
      .update(services)
      .set({ ...values, ...(imagePath ? { imagePath } : {}) })
      .where(eq(services.id, id));
  } else {
    await db.insert(services).values({
      id: crypto.randomUUID(),
      imagePath,
      createdAt: stamp,
      ...values,
    });
  }
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function deleteService(formData: FormData) {
  await guard();
  const db = await getDb();
  await db.update(services).set({ active: 0, updatedAt: nowIso() }).where(eq(services.id, String(formData.get("id"))));
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function savePortfolio(formData: FormData) {
  await guard();
  const parsed = portfolioSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || "",
    category: formData.get("category"),
    sourceNote: formData.get("sourceNote") || "",
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return;
  const file = formData.get("image");
  const imagePath = file instanceof File ? await saveImage(file, "portfolio") : null;
  const id = String(formData.get("id") || "");
  if (!id && !imagePath) return;
  const db = await getDb();
  if (id) {
    await db
      .update(portfolioItems)
      .set({
        title: parsed.data.title,
        description: parsed.data.description || "",
        category: parsed.data.category,
        sourceNote: parsed.data.sourceNote || "",
        sortOrder: parsed.data.sortOrder,
        published: parsed.data.published ? 1 : 0,
        ...(imagePath ? { imagePath } : {}),
      })
      .where(eq(portfolioItems.id, id));
  } else if (imagePath) {
    const current = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.sortOrder)).limit(1);
    await db.insert(portfolioItems).values({
      id: crypto.randomUUID(),
      title: parsed.data.title,
      description: parsed.data.description || "",
      category: parsed.data.category,
      imagePath,
      sortOrder: parsed.data.sortOrder || (current[0]?.sortOrder ?? 0) + 1,
      published: parsed.data.published ? 1 : 0,
      sourceNote: parsed.data.sourceNote || "",
      createdAt: nowIso(),
    });
  }
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
}

export async function deletePortfolio(formData: FormData) {
  await guard();
  const db = await getDb();
  await db.delete(portfolioItems).where(eq(portfolioItems.id, String(formData.get("id"))));
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
}

export async function saveWorkshop(formData: FormData) {
  await guard();
  const parsed = workshopSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    kind: formData.get("kind"),
    capacity: formData.get("capacity") || "",
    eventDate: formData.get("eventDate") || "",
    location: formData.get("location") || "",
    price: formData.get("price") || "",
    pricePublic: formData.get("pricePublic") === "on",
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  if (!parsed.success) return;
  const file = formData.get("image");
  const imagePath = file instanceof File ? await saveImage(file, "workshops") : null;
  const db = await getDb();
  const id = String(formData.get("id") || "");
  const values = {
    title: parsed.data.title,
    description: parsed.data.description,
    kind: parsed.data.kind,
    capacity: parseOptionalInt(parsed.data.capacity),
    eventDate: parsed.data.eventDate || null,
    location: parsed.data.location || "",
    priceCents: parsed.data.pricePublic ? parsePriceToCents(parsed.data.price) : null,
    pricePublic: parsed.data.pricePublic ? 1 : 0,
    status: parsed.data.status,
    sortOrder: parsed.data.sortOrder,
    ...(imagePath ? { imagePath } : {}),
  };
  if (id) {
    await db.update(workshops).set(values).where(eq(workshops.id, id));
  } else {
    await db.insert(workshops).values({ id: crypto.randomUUID(), createdAt: nowIso(), imagePath: imagePath ?? null, ...values });
  }
  revalidatePath("/admin/workshops");
  revalidatePath("/");
}

export async function saveInstagram(formData: FormData) {
  await guard();
  const file = formData.get("image");
  const imagePath = file instanceof File ? await saveImage(file, "instagram") : null;
  if (!imagePath) return;
  const db = await getDb();
  await db.insert(instagramPosts).values({
    id: crypto.randomUUID(),
    imagePath,
    permalink: String(formData.get("permalink") ?? "").slice(0, 300),
    caption: String(formData.get("caption") ?? "").slice(0, 500),
    postedAt: String(formData.get("postedAt") || "") || null,
    published: formData.get("published") === "on" ? 1 : 0,
    sortOrder: Number(formData.get("sortOrder") || 0),
    createdAt: nowIso(),
  });
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}

export async function toggleInstagram(formData: FormData) {
  await guard();
  const db = await getDb();
  const id = String(formData.get("id"));
  const rows = await db.select().from(instagramPosts).where(eq(instagramPosts.id, id)).limit(1);
  if (!rows[0]) return;
  await db.update(instagramPosts).set({ published: rows[0].published ? 0 : 1 }).where(eq(instagramPosts.id, id));
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}

export async function deleteInstagram(formData: FormData) {
  await guard();
  const db = await getDb();
  await db.delete(instagramPosts).where(eq(instagramPosts.id, String(formData.get("id"))));
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}

export async function saveSettings(formData: FormData) {
  await guard();
  const db = await getDb();
  const pairs = [
    ["whatsapp_number", String(formData.get("whatsapp") ?? "").replace(/[^\d]/g, "")],
    ["instagram_url", String(formData.get("instagram") ?? "").trim()],
    ["professional_email", String(formData.get("email") ?? "").trim()],
  ];
  for (const [key, value] of pairs) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
  }
  const password = String(formData.get("password") ?? "");
  const email = (await auth())?.user?.email;
  if (password.length >= 10 && email) {
    await db.update(users).set({ passwordHash: await bcrypt.hash(password, 12) }).where(eq(users.email, email));
  }
  revalidatePath("/admin/settings");
  revalidatePath("/");
}
