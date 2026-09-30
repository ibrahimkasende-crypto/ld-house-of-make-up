import Link from "next/link";
import { AdminHeader, EmptyState } from "@/components/admin/header";
import { listRequests } from "@/lib/queries";
import { STATUS_LABELS, type RequestStatus } from "@/lib/db/schema";
import { clientName, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const rows = await listRequests();
  return (
    <>
      <AdminHeader kicker="Activité" title="Demandes" icon="requests" text="Chaque demande reçue depuis le site apparaît ici, avec son statut." />
      <div className="panel" style={{ overflowX: "auto" }}>
        {rows.length === 0 ? <EmptyState icon="requests" title="Aucune demande reçue" text="Les formulaires de devis du site créeront les premières fiches ici." /> : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Client</th><th>Service</th><th>Date souhaitée</th><th>Lieu</th><th>Budget</th><th>Statut</th><th>Reçue le</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ request, client }) => (
                <tr key={request.id}>
                  <td><Link href={`/admin/requests/${request.id}`}>{request.publicRef}</Link></td>
                  <td><Link href={`/admin/clients/${client.id}`}>{clientName(client)}</Link></td>
                  <td>{request.serviceLabel}</td>
                  <td>{request.desiredDate || "—"}</td>
                  <td>{request.location || "—"}</td>
                  <td>{request.budget || "—"}</td>
                  <td><span className={`badge status-${request.status}`}>{STATUS_LABELS[request.status as RequestStatus] ?? request.status}</span></td>
                  <td>{formatDate(request.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
