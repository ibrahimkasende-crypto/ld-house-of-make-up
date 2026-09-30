import { AdminHeader } from "@/components/admin/header";
import { saveSettings } from "@/actions/admin";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [whatsapp, instagram, email] = await Promise.all([
    getSetting("whatsapp_number"),
    getSetting("instagram_url"),
    getSetting("professional_email"),
  ]);
  return (
    <>
      <AdminHeader kicker="Maison" title="Paramètres" icon="settings" text="Coordonnées publiques et accès à cet espace." />
      <form action={saveSettings} className="panel">
        <label htmlFor="whatsapp">WhatsApp (chiffres internationaux, sans +)</label>
        <input id="whatsapp" name="whatsapp" defaultValue={whatsapp ?? ""} placeholder="TODO — À VALIDER" />
        <p className="note">La variable NEXT_PUBLIC_WHATSAPP_NUMBER sert de repli si ce champ est vide. Aucun numéro n&apos;est inventé.</p>
        <label htmlFor="instagram">URL Instagram</label>
        <input id="instagram" name="instagram" defaultValue={instagram ?? ""} />
        <label htmlFor="email">E-mail professionnel affiché plus tard</label>
        <input id="email" name="email" type="email" defaultValue={email ?? ""} placeholder="TODO — À VALIDER" />
        <label htmlFor="password">Nouveau mot de passe (10 caractères minimum, laisser vide pour ne pas changer)</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={10} />
        <button className="btn btn-primary" type="submit" style={{ marginTop: 16 }}>Enregistrer</button>
      </form>
    </>
  );
}
