create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true
);

create table public.content_items (
  id text primary key default gen_random_uuid()::text,
  collection text not null check (collection in ('notices', 'events', 'faculty')),
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.content_items enable row level security;

create policy "Admins can read their own access record"
  on public.admins for select using (auth.uid() = user_id);

create policy "Public can read content"
  on public.content_items for select using (true);

create policy "Enabled admins can manage content"
  on public.content_items for all
  using (exists (select 1 from public.admins where user_id = auth.uid() and enabled = true))
  with check (exists (select 1 from public.admins where user_id = auth.uid() and enabled = true));

insert into storage.buckets (id, name, public)
values ('admin-uploads', 'admin-uploads', true)
on conflict (id) do nothing;

create policy "Public can read admin uploads"
  on storage.objects for select using (bucket_id = 'admin-uploads');

create policy "Enabled admins can upload files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'admin-uploads'
    and (storage.foldername(name))[1] = 'admin-uploads'
    and exists (select 1 from public.admins where user_id = auth.uid() and enabled = true)
  );
