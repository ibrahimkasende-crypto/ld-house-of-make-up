import { and, desc, eq, gte } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  appointments,
  clients,
  instagramPosts,
  messages,
  portfolioItems,
  quotes,
  serviceRequests,
  services,
  workshops,
} from "@/lib/db/schema";
import { clientName, parisToday } from "@/lib/utils";

export async function getActiveServices() {
  const db = await getDb();
  return db.select().from(services).where(eq(services.active, 1)).orderBy(services.sortOrder);
}

export async function getPublishedPortfolio() {
  const db = await getDb();
  return db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.published, 1))
    .orderBy(portfolioItems.sortOrder);
}

export async function getPublishedWorkshops() {
  const db = await getDb();
  return db.select().from(workshops).where(eq(workshops.status, "published")).orderBy(workshops.sortOrder);
}

export async function getPublishedInstagram() {
  const db = await getDb();
  return db
    .select()
    .from(instagramPosts)
    .where(eq(instagramPosts.published, 1))
    .orderBy(instagramPosts.sortOrder);
}

export async function dashboardStats() {
  const db = await getDb();
  const today = parisToday();
  const all = await db.select().from(serviceRequests);
  const clientRows = await db.select().from(clients);
  const upcoming = await db
    .select()
    .from(appointments)
    .where(and(eq(appointments.status, "planned"), gte(appointments.startsAt, new Date().toISOString())));
  const accepted = await db.select().from(quotes).where(eq(quotes.status, "accepted"));
  const revenueCents = accepted.reduce((sum, quote) => sum + (quote.amountCents ?? 0), 0);

  const byService = new Map<string, number>();
  for (const request of all) {
    byService.set(request.serviceLabel, (byService.get(request.serviceLabel) ?? 0) + 1);
  }
  const topServices = [...byService.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const months = lastMonths(6);
  const monthCounts = months.map((month) => ({
    month,
    count: all.filter((request) => request.createdAt.startsWith(month)).length,
  }));

  const [activeServices, publishedWorkshops, publishedPortfolio, recentRows] = await Promise.all([
    db.select().from(services).where(eq(services.active, 1)),
    db.select().from(workshops).where(eq(workshops.status, "published")),
    db.select().from(portfolioItems).where(eq(portfolioItems.published, 1)),
    db
      .select({ request: serviceRequests, client: clients })
      .from(serviceRequests)
      .innerJoin(clients, eq(serviceRequests.clientId, clients.id))
      .orderBy(desc(serviceRequests.createdAt))
      .limit(4),
  ]);

  return {
    today: all.filter((request) => request.createdAt.startsWith(today)).length,
    pending: all.filter((request) => request.status === "NOUVELLE" || request.status === "EN_ETUDE").length,
    confirmed: all.filter((request) => request.status === "CONFIRMEE").length,
    clients: clientRows.length,
    upcoming: upcoming.length,
    revenueCents: accepted.length ? revenueCents : null,
    topServices,
    monthCounts,
    total: all.length,
    catalog: {
      services: activeServices.length,
      workshops: publishedWorkshops.length,
      portfolio: publishedPortfolio.length,
    },
    recent: recentRows.map(({ request, client }) => ({
      id: request.id,
      publicRef: request.publicRef,
      serviceLabel: request.serviceLabel,
      status: request.status,
      createdAt: request.createdAt,
      name: clientName(client),
    })),
  };
}

function lastMonths(count: number) {
  const months: string[] = [];
  const cursor = new Date();
  cursor.setDate(1);
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth() - i, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

export async function listRequests() {
  const db = await getDb();
  return db
    .select({
      request: serviceRequests,
      client: clients,
    })
    .from(serviceRequests)
    .innerJoin(clients, eq(serviceRequests.clientId, clients.id))
    .orderBy(desc(serviceRequests.createdAt));
}

export async function getRequest(id: string) {
  const db = await getDb();
  const rows = await db
    .select({ request: serviceRequests, client: clients })
    .from(serviceRequests)
    .innerJoin(clients, eq(serviceRequests.clientId, clients.id))
    .where(eq(serviceRequests.id, id))
    .limit(1);
  if (!rows[0]) return null;
  const relatedQuotes = await db.select().from(quotes).where(eq(quotes.requestId, id)).orderBy(desc(quotes.createdAt));
  const relatedAppointments = await db
    .select()
    .from(appointments)
    .where(eq(appointments.requestId, id))
    .orderBy(desc(appointments.startsAt));
  const relatedMessages = await db.select().from(messages).where(eq(messages.requestId, id)).orderBy(desc(messages.createdAt));
  return { ...rows[0], quotes: relatedQuotes, appointments: relatedAppointments, messages: relatedMessages };
}
