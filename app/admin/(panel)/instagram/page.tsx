import { AdminHeader } from "@/components/admin/header";
import { desc } from "drizzle-orm";
import { deleteInstagram, saveInstagram, toggleInstagram } from "@/actions/admin";
import { getDb } from "@/lib/db";
import { instagramPosts } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function InstagramAdminPage() {
  const db = await getDb();
  const rows = await db.select().from(instagramPosts).orderBy(desc(instagramPosts.createdAt));
  return (
    <>
      <AdminHeader kicker="Offre" title="Instagram" icon="instagram" text="Cette galerie est contrôlée ici. Elle ne reprend pas automatiquement le fil du compte." />
      <form action={saveInstagram} className="panel form-grid">
        <div className="full"><label>Image</label><input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></div>
        <div><label>Lien du post</label><input name="permalink" placeholder="https://www.instagram.com/p/..." /></div>
        <div><label>Date</label><input name="postedAt" type="date" /></div>
        <div className="full"><label>Légende</label><textarea name="caption" /></div>
        <div><label>Ordre</label><input name="sortOrder" type="number" defaultValue={0} /></div>
        <label><input type="checkbox" name="published" defaultChecked /> Publier</label>
        <button className="btn btn-primary" type="submit">Ajouter</button>
      </form>
      {rows.map((post) => (
        <article key={post.id} className="panel" style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16 }}>
          <img src={post.imagePath} alt="" width={120} height={120} style={{ width: 120, height: 120, objectFit: "cover" }} />
          <div>
            <p>{post.caption || "Sans légende"}</p>
            <p>{post.published ? "Publié" : "Masqué"} {post.permalink ? `· ${post.permalink}` : ""}</p>
            <form action={toggleInstagram} style={{ display: "inline" }}>
              <input type="hidden" name="id" value={post.id} />
              <button className="btn btn-ghost" type="submit">{post.published ? "Masquer" : "Publier"}</button>
            </form>
            <form action={deleteInstagram} style={{ display: "inline", marginLeft: 8 }}>
              <input type="hidden" name="id" value={post.id} />
              <button className="btn btn-ghost" type="submit">Supprimer</button>
            </form>
          </div>
        </article>
      ))}
    </>
  );
}
