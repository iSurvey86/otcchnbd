-- Override nóng câu hỏi (JSON gốc ⊕ bản ghi này).
-- Chạy trong Supabase SQL Editor.

create table if not exists public.question_overrides (
  id uuid primary key default gen_random_uuid(),
  sector text not null
    check (sector in ('do-dac-ban-do', 'xay-dung', 'dau-thau')),
  -- Đo đạc: bank_id (official-2020, …). Xây dựng: track_id. Đấu thầu: để trống.
  bank_id text not null default '',
  track_id text not null default '',
  question_id text not null,
  prompt text,
  options jsonb,
  answer int check (answer is null or answer between 0 and 3),
  explanation text,
  source text,
  section text check (section is null or section in ('phap-luat', 'kinh-nghiem')),
  topic text,
  note text,
  updated_by_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sector, bank_id, track_id, question_id)
);

create index if not exists question_overrides_sector_idx
  on public.question_overrides (sector);

create index if not exists question_overrides_question_id_idx
  on public.question_overrides (question_id);

alter table public.question_overrides enable row level security;

comment on table public.question_overrides is
  'Sửa nóng câu hỏi: field null = giữ bản gốc từ JSON/TS.';

-- Góp ý: lưu bank để Admin mở đúng bộ đề
alter table public.feedback
  add column if not exists bank_id text;

comment on column public.feedback.bank_id is
  'Bank Đo đạc (nếu có) khi user góp ý.';
