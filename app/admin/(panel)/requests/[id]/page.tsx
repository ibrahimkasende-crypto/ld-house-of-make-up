import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { notFound } from "next/navigation";
import { addAppointment, addQuote, updateRequestStatus } from "@/actions/admin";
import { REQUEST_STATUSES, STATUS_LABELS, type RequestStatus } from "@/lib/db/schema";
import { getRequest } from "@/lib/queries";
import { clientName, formatDateTime, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRequest(id);
  if (!data) notFound();
  const { request, client, quotes, appointments, messages } = data;
  return (
    <>
      <AdminHeader kicker={request.publicRef} title={request.serviceLabel} icon="requests" />
      <p><Link href={`/admin/clients/${client.id}`}>{clientName(client)}</Link> · {client.email} · {client.phone}</p>
      <div className="panel">
        <p>Date souhaitée : {request.desiredDate || "—"}</p>
        <p>Lieu : {request.location || "—"} · Ville : {client.city} · Pays : {client.country}</p>
        <p>Personnes : {request.peopleCount ?? "—"} · Budget indicatif : {request.budget || "—"}</p>
        <p>{request.message || "Pas de message."}</p>
        <form action={updateRequestStatus} style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input type="hidden" name="id" value={request.id} />
          <label htmlFor="status">Statut</label>
          <select id="status" name="status" defaultValue={request.status}>
            {REQUEST_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status as RequestStatus]}</option>)}
          </select>
          <button className="btn btn-primary" type="submit">Mettre à jour</button>
        </form>
      </div>
      <section className="panel">
        <h2 className="serif" style={{ marginTop: 0, fontWeight: 450 }}>Devis</h2>
        {quotes.length === 0 ? <p>Aucun devis.</p> : quotes.map((quote) => (
          <p key={quote.id}>{quote.status} · {formatMoney(quote.amountCents, quote.currency)} · {quote.note}</p>
        ))}
        <form action={addQuote} className="form-grid" style={{ marginTop: 12 }}>
          <input type="hidden" name="requestId" value={request.id} />
          <div><label htmlFor="amount">Montant EUR</label><input id="amount" name="amount" /></div>
          <div>
            <label htmlFor="quoteStatus">Statut du devis</label>
            <select id="quoteStatus" name="status" defaultValue="draft">
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyé</option>
              <option value="accepted">Accepté</option>
              <option value="refused">Refusé</option>
            </select>
          </div>
          <div className="full"><label htmlFor="note">Note</label><textarea id="note" name="note" /></div>
          <button className="btn btn-primary" type="submit">Enregistrer le devis</button>
        </form>
      </section>
      <section className="panel">
        <h2 className="serif" style={{ marginTop: 0, fontWeight: 450 }}>Rendez-vous</h2>
        {appointments.map((item) => <p key={item.id}>{formatDateTime(item.startsAt)} · {item.location || "Lieu à préciser"} · {item.notes}</p>)}
        <form action={addAppointment} className="form-grid">
          <input type="hidden" name="requestId" value={request.id} />
          <input type="hidden" name="clientId" value={client.id} />
          <div><label htmlFor="startsAt">Début</label><input id="startsAt" name="startsAt" type="datetime-local" required /></div>
          <div><label htmlFor="apptLocation">Lieu</label><input id="apptLocation" name="location" /></div>
          <div className="full"><label htmlFor="apptNotes">Notes</label><textarea id="apptNotes" name="notes" /></div>
          <button className="btn btn-primary" type="submit">Créer le rendez-vous</button>
        </form>
      </section>
      <section className="panel">
        <h2 className="serif" style={{ marginTop: 0, fontWeight: 450 }}>Messages</h2>
        {messages.map((message) => (
          <article key={message.id}>
            <strong>{message.subject}</strong>
            <p>{message.toEmail || "Administration"} · {message.status} · {formatDateTime(message.createdAt)}</p>
          </article>
        ))}
      </section>
    </>
  );
}
