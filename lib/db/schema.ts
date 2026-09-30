import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: text("created_at").notNull(),
});

export const clients = sqliteTable("clients", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().default(""),
  country: text("country").notNull().default(""),
  city: text("city").notNull().default(""),
  notes: text("notes").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imagePath: text("image_path"),
  duration: text("duration"),
  priceCents: integer("price_cents"),
  pricePublic: integer("price_public").notNull().default(0),
  availability: text("availability").notNull().default("Tarif sur demande"),
  active: integer("active").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const serviceRequests = sqliteTable("service_requests", {
  id: text("id").primaryKey(),
  publicRef: text("public_ref").notNull().unique(),
  clientId: text("client_id").notNull(),
  serviceId: text("service_id"),
  serviceLabel: text("service_label").notNull(),
  desiredDate: text("desired_date"),
  location: text("location").notNull().default(""),
  peopleCount: integer("people_count"),
  budget: text("budget"),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("NOUVELLE"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const quotes = sqliteTable("quotes", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull(),
  amountCents: integer("amount_cents"),
  currency: text("currency").notNull().default("EUR"),
  note: text("note").notNull().default(""),
  status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull(),
});

export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(),
  requestId: text("request_id"),
  clientId: text("client_id").notNull(),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at"),
  location: text("location").notNull().default(""),
  status: text("status").notNull().default("planned"),
  notes: text("notes").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const portfolioItems = sqliteTable("portfolio_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull(),
  imagePath: text("image_path").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published").notNull().default(0),
  sourceNote: text("source_note").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const workshops = sqliteTable("workshops", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  kind: text("kind").notNull(),
  capacity: integer("capacity"),
  eventDate: text("event_date"),
  location: text("location").notNull().default(""),
  priceCents: integer("price_cents"),
  pricePublic: integer("price_public").notNull().default(0),
  status: text("status").notNull().default("draft"),
  imagePath: text("image_path"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const instagramPosts = sqliteTable("instagram_posts", {
  id: text("id").primaryKey(),
  imagePath: text("image_path").notNull(),
  permalink: text("permalink").notNull().default(""),
  caption: text("caption").notNull().default(""),
  postedAt: text("posted_at"),
  published: integer("published").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  requestId: text("request_id"),
  direction: text("direction").notNull(),
  toEmail: text("to_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull(),
  createdAt: text("created_at").notNull(),
});

export const adminNotes = sqliteTable("admin_notes", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  authorEmail: text("author_email").notNull().default(""),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const REQUEST_STATUSES = [
  "NOUVELLE",
  "EN_ETUDE",
  "DEVIS_ENVOYE",
  "CONFIRMEE",
  "TERMINEE",
  "ANNULEE",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  NOUVELLE: "Nouvelle",
  EN_ETUDE: "En étude",
  DEVIS_ENVOYE: "Devis envoyé",
  CONFIRMEE: "Confirmée",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export const PORTFOLIO_CATEGORIES = [
  { id: "makeup", label: "Make Up" },
  { id: "beauty", label: "Beauty" },
  { id: "events", label: "Events" },
  { id: "editorial", label: "Editorial" },
] as const;

export const WORKSHOP_KINDS = [
  { id: "individual", label: "Individuel" },
  { id: "group", label: "Groupe" },
  { id: "event", label: "Événement" },
  { id: "experience", label: "Expérience personnalisée" },
] as const;
