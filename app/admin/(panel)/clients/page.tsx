import Link from "next/link";
import { AdminHeader, EmptyState } from "@/components/admin/header";
import { desc, like, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { clientName } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string; country?: string }> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const country = (params.country ?? "").trim();
  const db = await getDb();
  const term = `%${q}%`;
  const search = q
    ? or(like(clients.firstName, term), like(clients.lastName, term), like(clients.email, term), like(clients.city, term))
    : undefined;
  const countryFilter = country ? like(clients.country, `%${country}%`) : undefined;
  const query = db.select().from(clients).orderBy(desc(clients.updatedAt));
  const rows = search && countryFilter
    ? (await query).filter((row) => {
        const blob = `${row.firstName} ${row.lastName} ${row.email} ${row.city}`.toLowerCase();
        return blob.includes(q.toLowerCase()) && row.country.toLowerCase().includes(country.toLowerCase());
      })
    : search
      ? await db.select().from(clients).where(search).orderBy(desc(clients.updatedAt))
      : countryFilter
        ? await db.select().from(clients).where(countryFilter).orderBy(desc(clients.updatedAt))
        : await query;
  const filtered = rows;

  return (
    <>
      <AdminHeader kicker="Activité" title="Clients" icon="clients" text="Une fiche est créée dès la première demande, à partir de l'e-mail." />
      <form className="panel" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="q">Recherche</label>
          <input id="q" name="q" defaultValue={q} placeholder="Nom, e-mail, ville" />
        </div>
        <div style={{ minWidth: 160 }}>
          <label htmlFor="country">Pays</label>
          <input id="country" name="country" defaultValue={country} />
        </div>
        <button className="btn btn-primary" type="submit" style={{ alignSelf: "end" }}>Filtrer</button>
      </form>
      <div className="panel" style={{ overflowX: "auto" }}>
        {filtered.length === 0 ? <EmptyState icon="clients" title="Aucun client pour le moment" text="Un client est créé à la première demande." /> : (
          <table>
            <thead><tr><th>Nom</th><th>E-mail</th><th>Téléphone</th><th>Ville</th><th>Pays</th></tr></thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id}>
                  <td><Link href={`/admin/clients/${client.id}`}>{clientName(client)}</Link></td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.city}</td>
                  <td>{client.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
