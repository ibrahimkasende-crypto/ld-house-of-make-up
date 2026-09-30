import { AdminHeader } from "@/components/admin/header";
import { asc } from "drizzle-orm";
import { saveService } from "@/actions/admin";
import { getDb } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const db = await getDb();
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder));
  return (
    <>
      <AdminHeader kicker="Offre" title="Prestations" icon="services" text="Ce qui est visible sur le site, avec la durée et le tarif." />
      {rows.map((service) => (
        <form key={service.id} action={saveService} className="panel form-grid">
          <input type="hidden" name="id" value={service.id} />
          <div><label>Titre</label><input name="title" defaultValue={service.title} required /></div>
          <div><label>Ordre</label><input name="sortOrder" type="number" defaultValue={service.sortOrder} /></div>
          <div className="full"><label>Description</label><textarea name="description" defaultValue={service.description} required /></div>
          <div><label>Durée</label><input name="duration" defaultValue={service.duration ?? ""} /></div>
          <div><label>Disponibilité</label><input name="availability" defaultValue={service.availability} /></div>
          <div><label>Prix public ({service.pricePublic ? formatMoney(service.priceCents) : "masqué"})</label><input name="price" placeholder="Laisser vide = sur demande" /></div>
          <div><label>Image</label><input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /></div>
          <label><input type="checkbox" name="pricePublic" defaultChecked={service.pricePublic === 1} /> Afficher le tarif</label>
          <label><input type="checkbox" name="active" defaultChecked={service.active === 1} /> Visible sur le site</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" type="submit">Enregistrer</button>
          </div>
        </form>
      ))}
      <form action={saveService} className="panel form-grid">
        <h2 className="serif full" style={{ fontWeight: 450, margin: 0 }}>Nouvelle prestation</h2>
        <div><label>Titre</label><input name="title" required /></div>
        <div><label>Ordre</label><input name="sortOrder" type="number" defaultValue={rows.length + 1} /></div>
        <div className="full"><label>Description</label><textarea name="description" required /></div>
        <div><label>Durée</label><input name="duration" /></div>
        <div><label>Disponibilité</label><input name="availability" defaultValue="Tarif sur demande" /></div>
        <div><label>Prix</label><input name="price" /></div>
        <div><label>Image</label><input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /></div>
        <label><input type="checkbox" name="pricePublic" /> Afficher le tarif</label>
        <label><input type="checkbox" name="active" defaultChecked /> Visible sur le site</label>
        <button className="btn btn-primary" type="submit">Créer</button>
      </form>
    </>
  );
}
