# Imkon

> **Archived MVP / learning project**
>
> Imkon is a Telegram-first concept for discovering verified jobs, internships, grants and free courses in Uzbekistan. Development of this MVP is currently paused.

## Current status

- Development: **paused**
- Production hosting: **disconnected from Vercel**
- Repository: **kept for reference and reuse**
- Automatic Vercel deployment: **disabled**
- Database: Supabase project retained separately; this repository should not be assumed to be actively maintained

## MVP features

- Opportunity discovery with search and filters
- Alias-aware search, including terms such as `ML`, `Machine Learning`, `AI` and related concepts
- Profile-based opportunity matching
- Saved opportunities
- Opportunity detail and source links
- Supabase-backed opportunity data with RLS
- Deadline reminder subscription foundation
- Telegram webhook foundation
- PWA and SEO metadata
- GitHub Actions production build checks

## Architecture

- **Application:** Next.js, React, TypeScript
- **Database:** Supabase / PostgreSQL
- **Source control:** GitHub
- **Former deployment:** Vercel; the repository's Git integration has been disconnected
- **Bot integration:** Telegram webhook foundation

## Security

This repository is retained for reference rather than deleted. Because the repository is public, everything committed to it should be treated as public information.

- Never commit API keys, passwords, service-role keys, bot tokens, or other secrets.
- Keep secrets in environment variables or an appropriate secret manager.
- Supabase service-role credentials must remain server-side only.
- If a secret is ever committed, revoke/rotate it immediately; deleting the file alone is not sufficient.
- Review project-specific configuration before reusing any code in another application.

## Environment variables

The application may use:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `TELEGRAM_BOT_TOKEN`

Only values intended for browser exposure should use `NEXT_PUBLIC_*`. Never expose Supabase service-role credentials or Telegram bot tokens to the client.

## Supabase

SQL schema and migration files are stored under `supabase/`. Review them before connecting this codebase to a new database.

If the project is revived, verify RLS policies, authentication settings, database credentials and current Supabase security advisories before using it in production.

## Deployment

Vercel was previously used to deploy this application. The GitHub repository has since been disconnected from Vercel, so commits to `main` should no longer trigger Vercel deployments for Imkon.

If this project is revived, configure a new deployment deliberately rather than relying on the old integration.

## Reusing the codebase

Before using Imkon code in a future project:

1. Review and remove project-specific environment variables and configuration.
2. Use a separate Supabase project/database when appropriate.
3. Review Telegram webhook configuration and bot credentials.
4. Replace project-specific branding, URLs, metadata and API endpoints.
5. Run the application locally and verify security and RLS policies before deployment.

## License

No open-source license is currently declared. Unless a license is added, reuse and redistribution are subject to the repository owner's rights.
