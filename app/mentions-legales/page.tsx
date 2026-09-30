import Link from "next/link";

export const metadata = { title: "Mentions légales" };

export default function MentionsPage() {
  return (
    <article className="legal">
      <p className="eyebrow">Informations légales</p>
      <h1>Mentions légales</h1>
      <p className="todo">TODO — À VALIDER. Les champs ci-dessous ne sont pas remplis tant que Laura n&apos;a pas transmis les informations d&apos;éditeur.</p>
      <h2>Éditeur</h2>
      <p>LD House of Make Up — Laura Dineka.</p>
      <p>Forme juridique : à compléter. Adresse professionnelle : à compléter. E-mail : à compléter. Téléphone : à compléter. SIRET ou identifiant équivalent : à compléter.</p>
      <h2>Hébergement</h2>
      <p>À compléter au moment de la mise en ligne.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les textes de présentation et l&apos;identité visuelle du site sont destinés à LD House of Make Up. Les photographies ne sont publiées qu&apos;après validation des droits.</p>
      <p><Link href="/">Retour au site</Link></p>
    </article>
  );
}
