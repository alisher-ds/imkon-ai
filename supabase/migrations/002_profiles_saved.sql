create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  location text,
  category text,
  experience text,
  preferred_mode text,
  preferred_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_opportunities (
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

alter table public.profiles enable row level security;
alter table public.saved_opportunities enable row level security;

create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users manage own saves" on public.saved_opportunities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists saved_opportunities_user_idx on public.saved_opportunities(user_id);
