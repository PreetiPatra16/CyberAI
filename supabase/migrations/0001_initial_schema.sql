create extension if not exists pgcrypto;

create type public.module_status as enum ('available', 'coming_soon');
create type public.attempt_status as enum ('in_progress', 'completed');
create type public.confidence_level as enum ('confident', 'guessing');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  icon_key text not null,
  accent text not null,
  sort_order integer not null unique,
  status public.module_status not null default 'coming_soon',
  max_points integer not null check (max_points > 0),
  pass_threshold integer not null check (pass_threshold between 0 and max_points)
);

create table public.lesson_sections (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  sort_order integer not null,
  title text not null,
  body text,
  bullets jsonb not null default '[]'::jsonb,
  unique(module_id, sort_order)
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  content_key text not null,
  sort_order integer not null,
  prompt text not null,
  explanation text not null,
  topic text not null,
  points integer not null check (points > 0),
  unique(module_id, sort_order),
  unique(module_id, content_key)
);

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  content_key text not null,
  sort_order integer not null,
  label text not null,
  is_correct boolean not null default false,
  unique(question_id, sort_order),
  unique(question_id, content_key)
);

create unique index exactly_one_correct_option on public.question_options(question_id) where is_correct;

create table public.cheat_sheet_items (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  sort_order integer not null,
  body text not null,
  unique(module_id, sort_order)
);

create table public.levels (
  id integer generated always as identity primary key,
  name text not null unique,
  minimum_points integer not null unique check (minimum_points >= 0),
  status_name text not null
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  status public.attempt_status not null default 'in_progress',
  score integer not null default 0 check (score >= 0),
  passed boolean not null default false,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create unique index one_active_attempt_per_module on public.quiz_attempts(user_id, module_id) where status = 'in_progress';

create table public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_id uuid not null references public.question_options(id),
  confidence public.confidence_level not null,
  is_correct boolean not null,
  points_earned integer not null check (points_earned >= 0),
  created_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);

create table public.module_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  attempt_count integer not null default 0,
  best_score integer not null default 0,
  passed boolean not null default false,
  completed_at timestamptz,
  primary key(user_id, module_id)
);

create table public.earned_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key(user_id, module_id)
);

create index quiz_attempts_user_idx on public.quiz_attempts(user_id, started_at desc);
create index quiz_responses_attempt_idx on public.quiz_responses(attempt_id);
create index module_progress_user_idx on public.module_progress(user_id);

create function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), case when new.is_anonymous then 'Demo Learner' else split_part(coalesce(new.email, 'Learner'), '@', 1) end));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.create_profile_for_new_user();
