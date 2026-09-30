import { AdminHeader } from "@/components/admin/header";
import { asc } from "drizzle-orm";
import { deletePortfolio, savePortfolio } from "@/actions/admin";
import { getDb } from "@/lib/db";
import { PORTFOLIO_CATEGORIES, portfolioItems } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const db = await getDb();
  const rows = await db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder));
  return (
    <>
      <AdminHeader kicker="Offre" title="Portfolio" icon="portfolio" text="N'ajoutez que des visuels dont l'utilisation est autorisée. Indiquez la source." />
      <form action={savePortfolio} className="panel form-grid">
        <h2 className="serif full" style={{ margin: 0, fontWeight: 450 }}>Ajouter une réalisation</h2>
        <div><label>Titre</label><input name="title" required /></div>
        <div>
          <label>Catégorie</label>
          <select name="category" defaultValue="makeup">
            {PORTFOLIO_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
        <div className="full"><label>Description</label><textarea name="description" /></div>
        <div className="full"><label>Source / droits</label><input name="sourceNote" placeholder="Ex. photo transmise par Laura, mars 2026" /></div>
        <div><label>Ordre</label><input name="sortOrder" type="number" defaultValue={rows.length + 1} /></div>
        <div><label>Image</label><input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></div>
        <label><input type="checkbox" name="published" defaultChecked /> Publier</label>
        <button className="btn btn-primary" type="submit">Ajouter</button>
      </form>
      {rows.map((item) => (
        <article key={item.id} className="panel" style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16 }}>
          <img src={item.imagePath} alt="" width={140} height={175} style={{ width: 140, height: 175, objectFit: "cover" }} />
          <div>
            <strong>{item.title}</strong>
            <p>{PORTFOLIO_CATEGORIES.find((category) => category.id === item.category)?.label} · {item.published ? "Publié" : "Masqué"}</p>
            <p>{item.sourceNote || "Source non renseignée"}</p>
            <form action={deletePortfolio}>
              <input type="hidden" name="id" value={item.id} />
              <button className="btn btn-ghost" type="submit">Supprimer</button>
            </form>
          </div>
        </article>
      ))}
    </>
  );
}
