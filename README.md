# Imkon

Telegram-first platform for discovering verified jobs, internships, grants and free courses in Uzbekistan.

## MVP
- Opportunity discovery with search and filters
- Transparent profile-based matching
- Saved opportunities
- Opportunity detail pages
- Supabase schema with RLS
- Deadline reminder subscriptions
- Telegram webhook foundation
- PWA and SEO metadata
- GitHub Actions production build check

## Zero-cost deployment
The project targets free tiers only. No paid service is required for the MVP. A Vercel project must be created/imported by the account owner before deployment can be managed through the connected Vercel tools.

## Environment
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `TELEGRAM_BOT_TOKEN`

## Supabase
Run the SQL files in `supabase/` in order. Keep service-role credentials server-side only.
