-- Imkon production schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  region text,
  profession text,
  experience text not null default 'Boshlang‘ich',
  work_mode text,
  opportunity_types text[] not null default '{}',
  skills text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  type text not null check (type in ('Ish','Stajirovka','Grant','Kurs')),
  location text not null,
  mode text not null check (mode in ('Masofaviy','Ofis','Gibrid')),
  category text not null,
  experience text not null default 'Boshlang‘ich',
  description text not null default '',
  deadline date,
  url text not null,
  source text,
  source_url text,
  external_id text,
  is_verified boolean not null default false,
  is_active boolean not null default true,
  last_verified_at timestamptz,
  verified_by text,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists opportunities_source_external_uidx on public.opportunities (source, external_id) where source is not null and external_id is not null;
create index if not exists opportunities_active_deadline_idx on public.opportunities (is_active, deadline);
create index if not exists opportunities_type_idx on public.opportunities (type);
create index if not exists opportunities_category_idx on public.opportunities (category);
create index if not exists opportunities_verified_idx on public.opportunities (is_verified, is_active, last_verified_at);

create table if not exists public.saved_opportunities (
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  state text not null default 'saved' check (state in ('saved','preparing','applied','accepted','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

create table if not exists public.opportunity_reports (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  reporter_id uuid references auth.users(id) on delete set null,
  reason text not null check (reason in ('expired','wrong_info','broken_link','spam','duplicate','other')),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunity_verifications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  verifier text not null,
  result text not null check (result in ('verified','changed','expired','broken_link','rejected')),
  note text,
  checked_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.opportunity_reports enable row level security;
alter table public.opportunity_verifications enable row level security;

drop policy if exists "Public can read active opportunities" on public.opportunities;
create policy "Public can read active opportunities" on public.opportunities for select using (is_active = true);

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users read own saved opportunities" on public.saved_opportunities;
create policy "Users read own saved opportunities" on public.saved_opportunities for select using (auth.uid() = user_id);
drop policy if exists "Users insert own saved opportunities" on public.saved_opportunities;
create policy "Users insert own saved opportunities" on public.saved_opportunities for insert with check (auth.uid() = user_id);
drop policy if exists "Users update own saved opportunities" on public.saved_opportunities;
create policy "Users update own saved opportunities" on public.saved_opportunities for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users delete own saved opportunities" on public.saved_opportunities;
create policy "Users delete own saved opportunities" on public.saved_opportunities for delete using (auth.uid() = user_id);

drop policy if exists "Authenticated users can report opportunities" on public.opportunity_reports;
create policy "Authenticated users can report opportunities" on public.opportunity_reports for insert with check (auth.uid() = reporter_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.expire_stale_opportunities()
returns integer language plpgsql security definer set search_path = public as $$
declare changed integer;
begin
  update public.opportunities set is_active = false, updated_at = now()
  where is_active = true and deadline is not null and deadline < current_date;
  get diagnostics changed = row_count;
  return changed;
end;
$$;

comment on table public.opportunities is 'Verified and curated opportunities shown by Imkon';
comment on column public.opportunities.source is 'Origin system, API, partner, or editorial source';
comment on column public.opportunities.last_verified_at is 'Last editorial verification timestamp';
