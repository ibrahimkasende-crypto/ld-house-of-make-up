import { loginAction } from "@/actions/admin";
import { Icon } from "@/components/admin/icons";
import { DEMO_ADMIN } from "@/lib/demo-account";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="login-screen">
      <form className="login-card" action={loginAction}>
        <span className="login-mark"><Icon name="mark" size={20} /></span>
        <p className="eyebrow">LD HOUSE · GESTION</p>
        <h1 className="serif" style={{ fontWeight: 450, fontSize: "2rem", margin: "8px 0 18px" }}>Connexion</h1>
        <p className="note">Démo sans base de données. Compte de test déjà rempli.</p>
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="text" inputMode="email" autoComplete="username" required defaultValue={DEMO_ADMIN.email} />
        <div style={{ height: 12 }} />
        <label htmlFor="password">Mot de passe</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required defaultValue={DEMO_ADMIN.password} />
        {params.error ? <p className="form-error">E-mail ou mot de passe incorrect.</p> : null}
        <button className="btn btn-primary form-submit" type="submit">Entrer</button>
      </form>
    </div>
  );
}
