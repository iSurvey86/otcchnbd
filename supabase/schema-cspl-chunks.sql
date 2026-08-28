-- CSPL chunks — đoạn Điều/Khoản/mục để cite khi sinh câu hỏi tháng.
-- Chạy trong Supabase SQL Editor (sau schema-cspl.sql).

create table if not exists public.cspl_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null
    references public.cspl_documents (id) on delete cascade,
  sector text not null
    check (sector in ('do-dac-ban-do', 'xay-dung', 'dau-thau')),
  so_hieu text not null,
  cite_label text not null,
  dieu text,
  khoan text,
  muc text,
  body text not null,
  char_count int not null default 0,
  sort_order int not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cspl_chunks_document_sort_idx
  on public.cspl_chunks (document_id, sort_order);

create index if not exists cspl_chunks_document_status_idx
  on public.cspl_chunks (document_id, status);

create index if not exists cspl_chunks_sector_status_idx
  on public.cspl_chunks (sector, status);

alter table public.cspl_chunks enable row level security;

comment on table public.cspl_chunks is
  'Đoạn CSPL (Điều/Khoản/mục) — chỉ chunk approved của VB active mới dùng để sinh câu.';
