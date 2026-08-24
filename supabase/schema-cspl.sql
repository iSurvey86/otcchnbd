-- CSPL (cơ sở pháp lý) — chạy trong Supabase SQL Editor sau schema.sql
-- Pilot: Đo đạc và Bản đồ (sector vẫn hỗ trợ các lĩnh vực khác)

create table if not exists public.cspl_documents (
  id uuid primary key default gen_random_uuid(),
  sector text not null
    check (sector in ('do-dac-ban-do', 'xay-dung', 'dau-thau')),
  doc_type text not null
    check (doc_type in (
      'nghi-dinh',
      'thong-tu',
      'quyet-dinh',
      'luat',
      'vbhn',
      'qcvn',
      'tcvn',
      'quy-dinh',
      'khac'
    )),
  so_hieu text not null,
  title text,
  issued_on date,
  effective_on date,
  -- Pipeline xử lý file / sinh câu (không lẫn với hiệu lực pháp lý)
  status text not null default 'uploaded'
    check (status in (
      'uploaded',
      'ingesting',
      'chunk_review',
      'active',
      'superseded'
    )),
  -- Hiệu lực pháp lý (kiểu danh mục CSPL ksnpsc)
  legal_status text not null default 'con_hieu_luc'
    check (legal_status in ('con_hieu_luc', 'het_hieu_luc')),
  expired_on date,
  replaced_by_id uuid references public.cspl_documents (id) on delete set null,
  expire_note text,
  phu_luc_files jsonb not null default '[]'::jsonb,
  storage_bucket text not null default 'cspl',
  storage_path text not null,
  original_filename text,
  content_type text,
  byte_size bigint,
  content_hash text,
  uploaded_by_uid text,
  uploaded_by_email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cspl_documents_sector_created_idx
  on public.cspl_documents (sector, created_at desc);

create index if not exists cspl_documents_so_hieu_idx
  on public.cspl_documents (so_hieu);

create index if not exists cspl_documents_legal_status_idx
  on public.cspl_documents (legal_status);

create unique index if not exists cspl_documents_storage_path_uidx
  on public.cspl_documents (storage_path);

alter table public.cspl_documents enable row level security;

-- Bucket private (idempotent nếu đã có)
insert into storage.buckets (id, name, public)
values ('cspl', 'cspl', false)
on conflict (id) do nothing;
