import Link from "next/link";
import { loginAction } from "@/actions/admin";
import { Icon } from "@/components/admin/icons";
import { DEMO_ADMIN } from "@/lib/demo-account";

export const dynamic = "force-dynamic";

const points = [
  { icon: "requests" as const, title: "Demandes", text: "Devis, statuts et suivi des projets." },
  { icon: "services" as const, title: "Offre", text: "Prestations, ateliers et tarifs." },
  { icon: "portfolio" as const, title: "Maison", text: "Portfolio, messages et réglages." },
];

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="login-screen">
      <aside className="login-aside">
        <Link href="/" className="login-back">Retour au site</Link>
        <div className="login-aside-body">
          <span className="login-mark"><Icon name="mark" size={22} /></span>
          <p className="eyebrow">LD HOUSE · GESTION</p>
          <h1>Votre maison, depuis un seul écran.</h1>
          <p>Demandes, clients, prestations et portfolio. L’espace de Laura, entre la France et la RDC.</p>
          <ul>
            {points.map((point) => (
              <li key={point.title}>
                <span><Icon name={point.icon} size={18} /></span>
                <div>
                  <strong>{point.title}</strong>
                  <small>{point.text}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="login-panel">
        <form className="login-card" action={loginAction}>
          <p className="eyebrow">Connexion</p>
          <h2>Entrer dans l’espace</h2>
          <p className="note">Démo sans base de données. Le compte de test est déjà rempli.</p>
          <div className="login-field">
            <label htmlFor="email">E-mail</label>
            <div className="login-control">
              <Icon name="mail" size={18} />
              <input id="email" name="email" type="text" inputMode="email" autoComplete="username" required defaultValue={DEMO_ADMIN.email} />
            </div>
          </div>
          <div className="login-field">
            <label htmlFor="password">Mot de passe</label>
            <div className="login-control">
              <Icon name="lock" size={18} />
              <input id="password" name="password" type="password" autoComplete="current-password" required defaultValue={DEMO_ADMIN.password} />
            </div>
          </div>
          {params.error ? <p className="form-error">E-mail ou mot de passe incorrect.</p> : null}
          <button className="btn btn-primary form-submit" type="submit">Entrer</button>
        </form>
      </main>
    </div>
  );
}
