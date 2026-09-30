# LD House of Make Up

Plateforme web de la maison de maquillage de Laura Dineka : site public, demandes de devis et administration.

La démo HTML d'origine est conservée : `LD House of Make Up — Démo.html`.

## Lancer

```bash
npm install
npm run dev
```

Le site est sur http://localhost:3000. L'administration est sur http://localhost:3000/admin/login.

La démo ne crée pas de fichier de base de données. Le compte admin de test est écrit dans `lib/demo-account.ts` et affiché sur la page de connexion.

## Ce qui est volontairement vide

- WhatsApp, tant que `NEXT_PUBLIC_WHATSAPP_NUMBER` ou le champ admin est vide
- Portfolio et Instagram, tant qu'aucune image autorisée n'est ajoutée
- Tarifs, affichés « Tarif sur demande »
- Mentions légales, avec les champs encore à compléter

La liste de validation est dans `CONTENT-VALIDATION.md`. Les sources sont dans `docs/SOURCES.md`.
