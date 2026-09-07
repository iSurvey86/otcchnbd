-- Pack câu hỏi tháng + draft câu (CSPL).
-- Chạy sau schema-cspl.sql và schema-cspl-chunks.sql.

create table if not exists public.cspl_monthly_packs (
  id uuid primary key default gen_random_uuid(),
  sector text not null
    check (sector in ('do-dac-ban-do', 'xay-dung', 'dau-thau')),
  -- Tháng pack: 'YYYY-MM' (GMT+7)
  period text not null
    check (period ~ '^\d{4}-\d{2}$'),
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved', 'published', 'locked')),
  min_questions int not null default 40,
  law_target int not null default 16,
  skill_target int not null default 24,
  notes text,
  created_by_email text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sector, period)
);

create table if not exists public.cspl_pack_questions (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null
    references public.cspl_monthly_packs (id) on delete cascade,
  sector text not null
    check (sector in ('do-dac-ban-do', 'xay-dung', 'dau-thau')),
  period text not null,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'rejected')),
  stem_type text not null default 'định-nghĩa',
  section text not null default 'phap-luat'
    check (section in ('phap-luat', 'kinh-nghiem')),
  prompt text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  answer int not null check (answer between 0 and 3),
  explanation text not null,
  -- Nguồn cite: [{ chunkId, soHieu, citeLabel, multiSourceSuggested? }]
  sources jsonb not null default '[]'::jsonb,
  multi_source_ok boolean not null default false,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cspl_monthly_packs_sector_period_idx
  on public.cspl_monthly_packs (sector, period desc);

create index if not exists cspl_pack_questions_pack_status_idx
  on public.cspl_pack_questions (pack_id, status);

create index if not exists cspl_pack_questions_sector_period_idx
  on public.cspl_pack_questions (sector, period);

alter table public.cspl_monthly_packs enable row level security;
alter table public.cspl_pack_questions enable row level security;

comment on table public.cspl_monthly_packs is
  'Pack câu hỏi tháng — chỉ published mới phục vụ ôn/thi; draft/review chỉ Admin.';
comment on table public.cspl_pack_questions is
  'Câu trong pack tháng; cite chunk CSPL active; explanation đúng 4 mục mẫu Đấu thầu.';
