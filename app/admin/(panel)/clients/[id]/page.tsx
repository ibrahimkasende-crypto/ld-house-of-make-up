import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { saveClientNotes } from "@/actions/admin";
import { getDb } from "@/lib/db";
import { adminNotes, appointments, clients, quotes, serviceRequests } from "@/lib/db/schema";
import { STATUS_LABELS, type RequestStatus } from "@/lib/db/schema";
import { clientName, formatDateTime, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const row = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  if (!row[0]) notFound();
  const client = row[0];
  const requests = await db.select().from(serviceRequests).where(eq(serviceRequests.clientId, id)).orderBy(desc(serviceRequests.createdAt));
  const notes = await db.select().from(adminNotes).where(eq(adminNotes.clientId, id)).orderBy(desc(adminNotes.createdAt));
  const meetings = await db.select().from(appointments).where(eq(appointments.clientId, id)).orderBy(desc(appointments.startsAt));
  const requestIds = requests.map((request) => request.id);
  const allQuotes = requestIds.length
    ? (await db.select().from(quotes)).filter((quote) => requestIds.includes(quote.requestId))
    : [];

  return (
    <>
      <AdminHeader kicker="Fiche client" title={clientName(client)} icon="clients" />
      <div className="panel">
        <p>{client.email}</p>
        <p>{client.phone}</p>
        <p>{client.city}{client.country ? `, ${client.country}` : ""}</p>
      </div>
      <section className="panel">
        <h2 className="serif" style={{ marginTop: 0, fontWeight: 450 }}>Demandes</h2>
        {requests.length === 0 ? <p>Aucune demande.</p> : requests.map((request) => (
          <p key={request.id}>
            <Link href={`/admin/requests/${request.id}`}>{request.publicRef}</Link>
            {" · "}{request.serviceLabel}{" · "}
            {STATUS_LABELS[request.status as RequestStatus] ?? request.status}
          </p>
        ))}
      </section>
      <section className="panel">
        <h2 className="serif" style={{ marginTop: 0, fontWeight: 450 }}>Devis</h2>
        {allQuotes.length === 0 ? <p>Aucun devis.</p> : allQuotes.map((quote) => (
          <p key={quote.id}>{quote.status} · {formatMoney(quote.amountCents, quote.currency)}</p>
        ))}
      </section>
      <section className="panel">
        <h2 className="serif" style={{ marginTop: 0, fontWeight: 450 }}>Rendez-vous</h2>
        {meetings.length === 0 ? <p>Aucun rendez-vous.</p> : meetings.map((item) => (
          <p key={item.id}>{formatDateTime(item.startsAt)} · {item.location || "Lieu à préciser"} · {item.status}</p>
        ))}
      </section>
      <section className="panel">
        <h2 className="serif" style={{ marginTop: 0, fontWeight: 450 }}>Notes internes</h2>
        {notes.map((note) => <article key={note.id}><p>{note.body}</p><small>{formatDateTime(note.createdAt)} · {note.authorEmail}</small></article>)}
        <form action={saveClientNotes}>
          <input type="hidden" name="clientId" value={client.id} />
          <label htmlFor="body">Nouvelle note</label>
          <textarea id="body" name="body" required />
          <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>Ajouter</button>
        </form>
      </section>
    </>
  );
}
