-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/fhiofqpvzlnidglwbjxe/sql/new

-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  username text unique not null,
  avatar_url text,
  grade text,
  experience text,
  onboarding_completed boolean default false,
  xp integer default 0,
  streak integer default 0,
  hearts integer default 5,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS Policies
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- Create index on username for faster lookups
create index if not exists profiles_username_idx on public.profiles(username);

-- Create index on user_id for faster joins
create index if not exists profiles_user_id_idx on public.profiles(user_id);
