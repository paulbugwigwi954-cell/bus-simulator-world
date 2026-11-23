-- Picha (snapshot) ya hifadhidata halisi ya project bus-simulator-world, 2026-11-23.
-- Migrations zilizoshaendeshwa: create_scores_leaderboard, career_economy_garage,
-- dynamic_routes_finish_trip, more_bus_models. Usiiendeshe tena kwenye project iliyopo.

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 20),
  route text not null default 'dar-dodoma',
  money integer not null,
  crashes integer not null check (crashes >= 0),
  secs integer not null check (secs >= 20),
  stars integer not null check (stars between 1 and 5),
  created_at timestamptz not null default now()
);
create index if not exists scores_route_money on public.scores (route, money desc);
alter table public.scores enable row level security;
create policy "anyone can read scores" on public.scores for select to anon, authenticated using (true);
create policy "anyone can add a sane score" on public.scores for insert to anon, authenticated
  with check (money between -5000000 and 200000000 and secs between 20 and 100000);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  name text not null check (char_length(name) between 2 and 20),
  cash bigint not null default 3000000 check (cash >= 0),
  loan bigint not null default 0 check (loan >= 0),
  xp integer not null default 0,
  trips integer not null default 0,
  last_trip_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());

create table if not exists public.garage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  model text not null check (model in ('scania','yutong','ideale','torino')),
  condition integer not null default 100 check (condition between 0 and 100),
  livery jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.garage enable row level security;
create policy "own garage read" on public.garage for select to authenticated using (user_id = auth.uid());

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  bus_id uuid references public.garage(id),
  route text not null,
  net_tzs bigint not null,
  secs integer not null,
  crashes integer not null,
  dmg integer not null,
  stars integer not null,
  created_at timestamptz not null default now()
);
alter table public.trips enable row level security;
create policy "own trips read" on public.trips for select to authenticated using (user_id = auth.uid());

-- Maandishi kamili ya functions (bus_price, ensure_profile, buy_bus, repair_bus,
-- set_livery, take_loan, repay_loan, finish_trip) yako kwenye migrations za project:
--   supabase migration list   (au Dashboard > Database > Functions)
-- Uandishi wote (cash, garage, trips) hufanyika kupitia functions hizi tu (SECURITY DEFINER);
-- jedwali hazina policy za insert/update/delete kwa watumiaji, kwa hiyo mteja hawezi kujiongezea pesa.
