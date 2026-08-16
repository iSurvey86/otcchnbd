-- Chạy trong Supabase SQL Editor (Project → SQL → New query)
-- Schema onthicchn: users / logs / feedback (Firebase Auth UID)

create extension if not exists "pgcrypto";

create table if not exists public.app_users (
  uid text primary key,
  email text,
  display_name text,
  photo_url text,
  provider text,
  answer_count integer not null default 0,
  exam_count integer not null default 0,
  login_count integer not null default 0,
  last_login_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  uid text not null,
  email text,
  display_name text,
  event text not null,
  question_id text,
  mode text,
  passed boolean,
  score double precision,
  reason text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_created_at_idx
  on public.activity_logs (created_at desc);

create index if not exists activity_logs_event_idx
  on public.activity_logs (event);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  uid text not null,
  email text,
  display_name text,
  message text not null,
  question_id text not null,
  question_prompt text,
  sector text,
  track_id text,
  topic_id text,
  status text not null default 'moi'
    check (status in ('moi', 'dang_xu_ly', 'xong', 'dong')),
  admin_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);

create index if not exists feedback_status_idx
  on public.feedback (status);

-- API dùng service role key → bypass RLS. Bật RLS để chặn anon client.
alter table public.app_users enable row level security;
alter table public.activity_logs enable row level security;
alter table public.feedback enable row level security;
