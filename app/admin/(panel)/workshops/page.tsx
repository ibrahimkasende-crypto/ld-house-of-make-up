import { AdminHeader } from "@/components/admin/header";
import { asc } from "drizzle-orm";
import { saveWorkshop } from "@/actions/admin";
import { getDb } from "@/lib/db";
import { WORKSHOP_KINDS, workshops } from "@/lib/db/schema";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
  const db = await getDb();
  const rows = await db.select().from(workshops).orderBy(asc(workshops.sortOrder));
  return (
    <>
      <AdminHeader kicker="Offre" title="Ateliers" icon="workshops" text="Formats proposés, places et statut de publication." />
      {rows.map((workshop) => (
        <form key={workshop.id} action={saveWorkshop} className="panel form-grid">
          <input type="hidden" name="id" value={workshop.id} />
          <div><label>Titre</label><input name="title" defaultValue={workshop.title} required /></div>
          <div>
            <label>Type</label>
            <select name="kind" defaultValue={workshop.kind}>
              {WORKSHOP_KINDS.map((kind) => <option key={kind.id} value={kind.id}>{kind.label}</option>)}
            </select>
          </div>
          <div className="full"><label>Description</label><textarea name="description" defaultValue={workshop.description} required /></div>
          <div><label>Personnes</label><input name="capacity" defaultValue={workshop.capacity ?? ""} /></div>
          <div><label>Date</label><input name="eventDate" type="date" defaultValue={workshop.eventDate ?? ""} /></div>
          <div><label>Lieu</label><input name="location" defaultValue={workshop.location} /></div>
          <div><label>Prix ({workshop.pricePublic ? formatMoney(workshop.priceCents) : "sur demande"})</label><input name="price" /></div>
          <div>
            <label>Statut</label>
            <select name="status" defaultValue={workshop.status}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="full">Complet</option>
              <option value="past">Passé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          <div><label>Ordre</label><input name="sortOrder" type="number" defaultValue={workshop.sortOrder} /></div>
          <div><label>Image</label><input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /></div>
          <label><input type="checkbox" name="pricePublic" defaultChecked={workshop.pricePublic === 1} /> Afficher le tarif</label>
          <button className="btn btn-primary" type="submit">Enregistrer</button>
        </form>
      ))}
      <form action={saveWorkshop} className="panel form-grid">
        <h2 className="serif full" style={{ margin: 0, fontWeight: 450 }}>Nouvel atelier</h2>
        <div><label>Titre</label><input name="title" required /></div>
        <div>
          <label>Type</label>
          <select name="kind" defaultValue="individual">
            {WORKSHOP_KINDS.map((kind) => <option key={kind.id} value={kind.id}>{kind.label}</option>)}
          </select>
        </div>
        <div className="full"><label>Description</label><textarea name="description" required /></div>
        <div><label>Personnes</label><input name="capacity" /></div>
        <div><label>Date</label><input name="eventDate" type="date" /></div>
        <div><label>Lieu</label><input name="location" /></div>
        <div><label>Prix</label><input name="price" /></div>
        <div>
          <label>Statut</label>
          <select name="status" defaultValue="draft">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="full">Complet</option>
            <option value="past">Passé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
        <div><label>Ordre</label><input name="sortOrder" type="number" defaultValue={rows.length + 1} /></div>
        <div><label>Image</label><input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /></div>
        <label><input type="checkbox" name="pricePublic" /> Afficher le tarif</label>
        <button className="btn btn-primary" type="submit">Créer</button>
      </form>
    </>
  );
}
