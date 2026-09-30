import Link from "next/link";

export const metadata = { title: "Confidentialité" };

export default function PrivacyPage() {
  return (
    <article className="legal">
      <p className="eyebrow">Données</p>
      <h1>Politique de confidentialité</h1>
      <p className="todo">TODO — À VALIDER avec Laura avant publication définitive.</p>
      <p>Le formulaire de devis enregistre le nom, le prénom, l&apos;e-mail, le téléphone, le pays, la ville, la prestation, la date, le lieu, le nombre de personnes, le budget indicatif et le message. Ces informations servent uniquement à répondre à la demande et à suivre la relation client.</p>
      <p>Elles sont accessibles dans l&apos;espace d&apos;administration protégé. Aucune revente de fichier n&apos;est prévue par cet outil.</p>
      <p>La base juridique, la durée de conservation, l&apos;identité du responsable de traitement et les modalités d&apos;exercice des droits (accès, rectification, effacement) seront précisées dès que les informations légales seront transmises.</p>
      <p><Link href="/">Retour au site</Link></p>
    </article>
  );
}
