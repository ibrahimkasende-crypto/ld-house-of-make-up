# Architecture

Le site public et l'administration lisent la même base.

```text
Site public (/)
Admin (/admin, session requise)
API /api/v1
Base SQLite locale (fichier data/ldhouse.db)
```

La base est ouverte avec Drizzle et libSQL. Le schéma est pensé pour un passage ultérieur à PostgreSQL ou Supabase : mêmes entités, pas de logique métier dans les pages.

## Tables

- `users` — comptes admin
- `clients`
- `services`
- `service_requests`
- `quotes`
- `appointments`
- `portfolio_items`
- `workshops`
- `instagram_posts`
- `messages`
- `admin_notes`
- `settings`

Relation principale : un client a des demandes, chaque demande pointe vers une prestation.

## API prête pour plus tard

- `GET /api/v1/health`
- `GET /api/v1/services`
- `POST /api/v1/public/quotes`
- `GET /api/v1/requests` — session admin ou `Authorization: Bearer ADMIN_API_TOKEN`

L'application mobile n'est pas développée dans cette phase.

## E-mails

`EMAIL_PROVIDER` vaut `log` (défaut), `resend`, `sendgrid`, `brevo` ou `smtp`. Le texte des messages ne change pas quand le fournisseur change.

## Images

Dossier prévu : `public/images/`. Les envois de l'admin vont dans `public/uploads/`. Aucune image tierce n'est incluse.
