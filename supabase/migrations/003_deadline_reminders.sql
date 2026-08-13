create table if not exists public.reminder_subscriptions (
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  reminder_days smallint not null check (reminder_days in (30,14,3)),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, opportunity_id, reminder_days)
);

alter table public.reminder_subscriptions enable row level security;
create policy "Users manage own reminders" on public.reminder_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
