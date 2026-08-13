# Imkon

Telegram-first opportunity discovery platform for Uzbekistan: find relevant jobs, internships, grants and free courses without digging through dozens of channels.

## MVP principles

- $0 infrastructure target
- Mobile-first experience
- Explainable matching instead of opaque AI
- Verified opportunity data as the core trust layer
- Fast path from profile to relevant opportunities

## Stack

Next.js · TypeScript · Tailwind CSS · Supabase · Telegram Bot API

## Local development

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` when connecting the database.

## Product flow

Profile → filters → relevant opportunities → save → apply → deadline reminders.
