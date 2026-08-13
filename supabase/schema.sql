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
  is_verified boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists opportunities_active_deadline_idx on public.opportunities (is_active, deadline);
create index if not exists opportunities_type_idx on public.opportunities (type);
create index if not exists opportunities_category_idx on public.opportunities (category);

alter table public.opportunities enable row level security;
create policy "Public can read active opportunities" on public.opportunities
  for select using (is_active = true);

insert into public.opportunities (title, organization, type, location, mode, category, experience, description, deadline, url, is_verified)
values
('Junior SMM Assistant', 'Local startup', 'Ish', 'Toshkent', 'Gibrid', 'SMM', 'Boshlang‘ich', 'Kontent rejalashtirish va ijtimoiy tarmoqlar bilan ishlash.', current_date + 18, 'https://example.com', true),
('Frontend Internship', 'Tech company', 'Stajirovka', 'Toshkent', 'Ofis', 'IT', 'Boshlang‘ich', 'Real product jamoasida frontend tajribasi olish imkoniyati.', current_date + 27, 'https://example.com', true),
('Digital Skills Scholarship', 'Education foundation', 'Grant', 'O‘zbekiston', 'Masofaviy', 'Ta’lim', 'Boshlang‘ich', 'Raqamli ko‘nikmalar kurslari uchun to‘liq grant.', current_date + 35, 'https://example.com', true),
('English for Career — Free', 'Open learning', 'Kurs', 'O‘zbekiston', 'Masofaviy', 'Ingliz tili', 'Boshlang‘ich', 'Ish va universitet uchun bepul ingliz tili kursi.', null, 'https://example.com', true)
on conflict do nothing;
