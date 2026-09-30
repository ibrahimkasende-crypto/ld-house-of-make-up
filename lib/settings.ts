import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { LAURA_WHATSAPP_DIGITS } from "@/lib/contact";
import { whatsappHref } from "@/lib/utils";

export async function getSetting(key: string) {
  const db = await getDb();
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? null;
}

export async function getWhatsappLink() {
  const stored = await getSetting("whatsapp_number");
  return whatsappHref(stored || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || LAURA_WHATSAPP_DIGITS);
}

export async function getInstagramUrl() {
  return (await getSetting("instagram_url")) || "";
}
