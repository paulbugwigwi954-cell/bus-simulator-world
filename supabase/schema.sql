-- Tayari imeshaendeshwa kwenye project bus-simulator-world
create table if not exists public.scores (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 20),
  route      text not null default 'dar-dodoma',
  money      integer not null,
  crashes    integer not null check (crashes >= 0),
  secs       integer not null check (secs >= 60),
  stars      integer not null check (stars between 1 and 5),
  created_at timestamptz not null default now()
);
create index if not exists scores_route_money on public.scores (route, money desc);

alter table public.scores enable row level security;

create policy "anyone can read scores" on public.scores
  for select to anon, authenticated using (true);

create policy "anyone can add a sane score" on public.scores
  for insert to anon, authenticated
  with check (money between -2000000 and 3000000 and secs between 60 and 7200);
