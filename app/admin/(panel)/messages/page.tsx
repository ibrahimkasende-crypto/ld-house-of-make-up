import { AdminHeader, EmptyState } from "@/components/admin/header";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const db = await getDb();
  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));
  return (
    <>
      <AdminHeader kicker="Activité" title="Messages" icon="messages" text="Avec le fournisseur « log », les e-mails sont enregistrés ici et ne partent pas." />
      {rows.length === 0 ? <div className="panel"><EmptyState icon="messages" title="Aucun message" text="Les accusés de réception et les alertes admin s'afficheront ici." /></div> : rows.map((message) => (
        <article key={message.id} className="panel">
          <p className="eyebrow">{message.status} · {message.direction}</p>
          <h2 className="serif" style={{ fontWeight: 450, margin: "6px 0" }}>{message.subject}</h2>
          <p>{message.toEmail || "Destinataire non configuré"} · {formatDateTime(message.createdAt)}</p>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{message.body}</pre>
        </article>
      ))}
    </>
  );
}
