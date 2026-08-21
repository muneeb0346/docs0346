-- Documents table
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users not null,
  title text default 'Untitled Document',
  content jsonb default '{}',
  file_name text,
  file_size bigint,
  file_storage_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Document shares table
create table if not exists public.document_shares (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.documents on delete cascade not null,
  shared_with_user_id uuid references auth.users not null,
  permission text default 'viewer',
  created_at timestamptz default now(),
  unique(document_id, shared_with_user_id)
);

-- Enable RLS
alter table public.documents enable row level security;
alter table public.document_shares enable row level security;

-- Documents policies
create policy "Users can view own documents"
  on public.documents for select
  using (owner_id = auth.uid());

create policy "Users can view shared documents"
  on public.documents for select
  using (id in (select document_id from public.document_shares where shared_with_user_id = auth.uid()));

create policy "Users can insert own documents"
  on public.documents for insert
  with check (owner_id = auth.uid());

create policy "Users can update own documents"
  on public.documents for update
  using (owner_id = auth.uid());

create policy "Users can delete own documents"
  on public.documents for delete
  using (owner_id = auth.uid());

-- Document shares policies
create policy "Owners can view shares"
  on public.document_shares for select
  using (document_id in (select id from public.documents where owner_id = auth.uid()));

create policy "Owners can insert shares"
  on public.document_shares for insert
  with check (document_id in (select id from public.documents where owner_id = auth.uid()));

create policy "Owners can update shares"
  on public.document_shares for update
  using (document_id in (select id from public.documents where owner_id = auth.uid()));

create policy "Owners can delete shares"
  on public.document_shares for delete
  using (document_id in (select id from public.documents where owner_id = auth.uid()));
