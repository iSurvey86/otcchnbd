-- Phụ lục / phần Công báo gắn cùng một văn bản CSPL (jsonb như ksnpsc).
-- Chạy trên Supabase nếu bảng đã tồn tại.

alter table public.cspl_documents
  add column if not exists phu_luc_files jsonb;

update public.cspl_documents
set phu_luc_files = '[]'::jsonb
where phu_luc_files is null;

alter table public.cspl_documents
  alter column phu_luc_files set default '[]'::jsonb;

alter table public.cspl_documents
  alter column phu_luc_files set not null;

comment on column public.cspl_documents.phu_luc_files is
  'Mảng JSON phụ lục / phần Công báo [{id, ten, path, file_ten_goc, byte_size, thu_tu}] — cùng một văn bản';
