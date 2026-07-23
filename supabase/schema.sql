-- Run this in Supabase: SQL Editor → New query → Run

create table if not exists public.day_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  tasks jsonb not null default '{}',
  notes jsonb not null default '{}',
  updated_at timestamptz default now(),
  unique(user_id, date)
);

alter table public.day_records enable row level security;

create policy "Users read own day records"
  on public.day_records for select
  using (auth.uid() = user_id);

create policy "Users insert own day records"
  on public.day_records for insert
  with check (auth.uid() = user_id);

create policy "Users update own day records"
  on public.day_records for update
  using (auth.uid() = user_id);

create policy "Users delete own day records"
  on public.day_records for delete
  using (auth.uid() = user_id);

create index if not exists day_records_user_date_idx
  on public.day_records(user_id, date);
