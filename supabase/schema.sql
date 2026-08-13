create extension if not exists pgcrypto;

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

create index if not exists opportunities_active_deadline_idx on public.opportunities (is_active, deadline);
create index if not exists opportunities_type_idx on public.opportunities (type);
create index if not exists opportunities_category_idx on public.opportunities (category);
create index if not exists opportunities_source_idx on public.opportunities (source);
create index if not exists opportunities_verified_idx on public.opportunities (is_verified, is_active, last_verified_at);
create unique index if not exists opportunities_source_external_uidx on public.opportunities (source, external_id) where source is not null and external_id is not null;

alter table public.opportunities enable row level security;
drop policy if exists "Public can read active opportunities" on public.opportunities;
create policy "Public can read active opportunities" on public.opportunities for select using (is_active = true);

create table if not exists public.opportunity_reports (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  reason text not null check (reason in ('expired','wrong_info','broken_link','spam','duplicate','other')),
  note text,
  created_at timestamptz not null default now()
);
alter table public.opportunity_reports enable row level security;
drop policy if exists "Public can report opportunities" on public.opportunity_reports;
create policy "Public can report opportunities" on public.opportunity_reports for insert with check (true);

create table if not exists public.opportunity_verifications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  verifier text not null,
  result text not null check (result in ('verified','changed','expired','broken_link','rejected')),
  note text,
  checked_at timestamptz not null default now()
);
alter table public.opportunity_verifications enable row level security;

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

insert into public.opportunities (title, organization, type, location, mode, category, experience, description, deadline, url, source, source_url, is_verified)
values
('Junior SMM Assistant', 'Local startup', 'Ish', 'Toshkent', 'Gibrid', 'SMM', 'Boshlang‘ich', 'Kontent rejalashtirish va ijtimoiy tarmoqlar bilan ishlash.', current_date + 18, 'https://example.com', 'demo', 'https://example.com', true),
('Frontend Internship', 'Tech company', 'Stajirovka', 'Toshkent', 'Ofis', 'IT', 'Boshlang‘ich', 'Real product jamoasida frontend tajribasi olish imkoniyati.', current_date + 27, 'https://example.com', 'demo', 'https://example.com', true),
('Digital Skills Scholarship', 'Education foundation', 'Grant', 'O‘zbekiston', 'Masofaviy', 'Ta’lim', 'Boshlang‘ich', 'Raqamli ko‘nikmalar kurslari uchun to‘liq grant.', current_date + 35, 'https://example.com', 'demo', 'https://example.com', true),
('English for Career — Free', 'Open learning', 'Kurs', 'O‘zbekiston', 'Masofaviy', 'Ingliz tili', 'Boshlang‘ich', 'Ish va universitet uchun bepul ingliz tili kursi.', null, 'https://example.com', 'demo', 'https://example.com', true)
on conflict do nothing;
