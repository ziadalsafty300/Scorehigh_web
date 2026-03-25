-- Supabase Schema for ScoreHigh Tutoring

-- 1. Profiles Table (Automatically created when a user signs up)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  grade text,
  has_taken_before boolean,
  english_score integer,
  target_score text,
  test_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view own profile." on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Study Plans Table
create table public.study_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  plan_title text,
  plan_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security for study_plans
alter table public.study_plans enable row level security;

-- Policies for study_plans
create policy "Users can view own study plans." on public.study_plans
  for select using (auth.uid() = user_id);

create policy "Users can insert own study plans." on public.study_plans
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own study plans." on public.study_plans
  for delete using (auth.uid() = user_id);

-- Trigger to create a profile automatically when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, grade, has_taken_before, english_score)
  values (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'grade',
    (new.raw_user_meta_data->>'has_taken_before')::boolean,
    (new.raw_user_meta_data->>'english_score')::integer
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
