import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import * as schema from "@/lib/db/schema";
import { nowIso, slugify } from "@/lib/utils";

const dataDir = path.join(process.cwd(), "data");

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, "ldhouse.db").replace(/\\/g, "/");
  return `file:${file}`;
}

const client = createClient({ url: databaseUrl() });
export const db = drizzle(client, { schema });

let ready: Promise<void> | null = null;

export async function getDb() {
  if (!ready) ready = init();
  await ready;
  return db;
}

const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_path TEXT,
    duration TEXT,
    price_cents INTEGER,
    price_public INTEGER NOT NULL DEFAULT 0,
    availability TEXT NOT NULL DEFAULT 'Tarif sur demande',
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS service_requests (
    id TEXT PRIMARY KEY,
    public_ref TEXT NOT NULL UNIQUE,
    client_id TEXT NOT NULL,
    service_id TEXT,
    service_label TEXT NOT NULL,
    desired_date TEXT,
    location TEXT NOT NULL DEFAULT '',
    people_count INTEGER,
    budget TEXT,
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'NOUVELLE',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL,
    amount_cents INTEGER,
    currency TEXT NOT NULL DEFAULT 'EUR',
    note TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    request_id TEXT,
    client_id TEXT NOT NULL,
    starts_at TEXT NOT NULL,
    ends_at TEXT,
    location TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'planned',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS portfolio_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL,
    image_path TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 0,
    source_note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS workshops (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    kind TEXT NOT NULL,
    capacity INTEGER,
    event_date TEXT,
    location TEXT NOT NULL DEFAULT '',
    price_cents INTEGER,
    price_public INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft',
    image_path TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS instagram_posts (
    id TEXT PRIMARY KEY,
    image_path TEXT NOT NULL,
    permalink TEXT NOT NULL DEFAULT '',
    caption TEXT NOT NULL DEFAULT '',
    posted_at TEXT,
    published INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    request_id TEXT,
    direction TEXT NOT NULL,
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS admin_notes (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    author_email TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`,
];

async function init() {
  for (const statement of TABLES) {
    await client.execute(statement);
  }

  const seeded = await db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, "seeded"))
    .limit(1);
  if (seeded.length === 0) {
    const stamp = nowIso();
    const catalog: Array<[string, string]> = [
      ["Maquillage", "Une mise en beauté adaptée à votre événement, votre style et votre image."],
      ["Événements", "Une expérience beauté pensée pour les occasions spéciales et événements."],
      ["Shooting", "Mise en beauté pensée pour les séances photo et projets visuels."],
      ["Editorial", "Mise en beauté pensée pour les projets d'image et les collaborations visuelles."],
      ["Ateliers", "Ateliers et expériences autour du maquillage et de la mise en beauté."],
      ["Collaborations", "Projets avec marques, entreprises, créateurs et événements."],
    ];
    for (const [index, [title, description]] of catalog.entries()) {
      await db.insert(schema.services).values({
        id: crypto.randomUUID(),
        slug: slugify(title),
        title,
        description,
        imagePath: null,
        duration: null,
        priceCents: null,
        pricePublic: 0,
        availability: "Tarif sur demande",
        active: 1,
        sortOrder: index + 1,
        createdAt: stamp,
        updatedAt: stamp,
      });
    }

    const formats: Array<[string, string, string]> = [
      ["individual", "Individuels", "Accompagnement en face à face. Durée et déroulé communiqués sur demande."],
      ["group", "Groupe", "Atelier en petit groupe. Le nombre de personnes est communiqué sur demande."],
      ["event", "Événements", "Présence beauté selon le projet."],
      ["experience", "Expériences beauté", "Format sur mesure. Les disponibilités sont communiquées sur demande."],
    ];
    for (const [index, [kind, title, description]] of formats.entries()) {
      await db.insert(schema.workshops).values({
        id: crypto.randomUUID(),
        title,
        description,
        kind,
        capacity: null,
        eventDate: null,
        location: "",
        priceCents: null,
        pricePublic: 0,
        status: "published",
        imagePath: null,
        sortOrder: index + 1,
        createdAt: stamp,
      });
    }

    await db.insert(schema.settings).values({ key: "seeded", value: stamp });
    await db.insert(schema.settings).values({
      key: "instagram_url",
      value: "https://instagram.com/lauradineka",
    });
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (existing.length === 0) {
      const admins = await db.select().from(schema.users).where(eq(schema.users.role, "admin")).limit(1);
      const passwordHash = await bcrypt.hash(password, 12);
      if (admins[0]) {
        await db.update(schema.users).set({ email, passwordHash }).where(eq(schema.users.id, admins[0].id));
      } else {
        await db.insert(schema.users).values({
          id: crypto.randomUUID(),
          email,
          name: "Administration",
          passwordHash,
          role: "admin",
          createdAt: nowIso(),
        });
      }
    }
  }
}
