-- DollCloset (MVP) – Supabase Schema + RLS + Storage Policies
-- Run this in Supabase SQL Editor (Database).

-- Extensions
create extension if not exists "pgcrypto";

-- Tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamp with time zone default now()
);

create table if not exists public.clothing_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  category text not null check (category in ('tops','bottoms','shoes','accessories')),
  color text,
  created_at timestamp with time zone default now()
);

create index if not exists clothing_items_user_id_idx on public.clothing_items(user_id);
create index if not exists clothing_items_category_idx on public.clothing_items(category);

create table if not exists public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  thumbnail_url text,
  created_at timestamp with time zone default now()
);

create index if not exists outfits_user_id_idx on public.outfits(user_id);

create table if not exists public.outfit_items (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid not null references public.outfits(id) on delete cascade,
  clothing_item_id uuid not null references public.clothing_items(id) on delete cascade,
  x double precision not null,
  y double precision not null,
  scale double precision not null default 1,
  rotation double precision not null default 0,
  z_index int not null default 0
);

create index if not exists outfit_items_outfit_id_idx on public.outfit_items(outfit_id);

-- Auto-create profile on signup (reads name from auth metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, nullif(new.raw_user_meta_data->>'name',''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.clothing_items enable row level security;
alter table public.outfits enable row level security;
alter table public.outfit_items enable row level security;

-- profiles: only own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- clothing_items: only own rows
drop policy if exists "clothing_items_all_own" on public.clothing_items;
create policy "clothing_items_all_own"
on public.clothing_items for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- outfits: only own rows
drop policy if exists "outfits_all_own" on public.outfits;
create policy "outfits_all_own"
on public.outfits for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- outfit_items: ownership via parent outfit
drop policy if exists "outfit_items_all_own" on public.outfit_items;
create policy "outfit_items_all_own"
on public.outfit_items for all
using (
  exists (
    select 1
    from public.outfits o
    where o.id = outfit_id
      and o.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.outfits o
    where o.id = outfit_id
      and o.user_id = auth.uid()
  )
);

-- Storage: private bucket "closet"
insert into storage.buckets (id, name, public)
values ('closet', 'closet', false)
on conflict (id) do nothing;

-- Storage policies (bucket: closet)
-- Path convention: {userId}/items/{uuid}.{ext}
drop policy if exists "closet_select_own" on storage.objects;
create policy "closet_select_own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'closet'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "closet_insert_own" on storage.objects;
create policy "closet_insert_own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'closet'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "closet_update_own" on storage.objects;
create policy "closet_update_own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'closet'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'closet'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "closet_delete_own" on storage.objects;
create policy "closet_delete_own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'closet'
  and (storage.foldername(name))[1] = auth.uid()::text
);



