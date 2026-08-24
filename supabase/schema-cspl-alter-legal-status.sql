-- Bổ sung hiệu lực pháp lý cho bảng cspl_documents đã tạo trước đó.
-- Chạy trên Supabase SQL Editor (an toàn nếu cột đã có một phần).

alter table public.cspl_documents
  add column if not exists legal_status text;

alter table public.cspl_documents
  add column if not exists expired_on date;

alter table public.cspl_documents
  add column if not exists replaced_by_id uuid;

alter table public.cspl_documents
  add column if not exists expire_note text;

update public.cspl_documents
set legal_status = 'con_hieu_luc'
where legal_status is null or legal_status = '';

alter table public.cspl_documents
  alter column legal_status set default 'con_hieu_luc';

alter table public.cspl_documents
  alter column legal_status set not null;

alter table public.cspl_documents
  drop constraint if exists cspl_documents_legal_status_check;

alter table public.cspl_documents
  add constraint cspl_documents_legal_status_check
  check (legal_status in ('con_hieu_luc', 'het_hieu_luc'));

-- FK thay thế (bỏ rồi thêm lại nếu cần)
alter table public.cspl_documents
  drop constraint if exists cspl_documents_replaced_by_id_fkey;

alter table public.cspl_documents
  add constraint cspl_documents_replaced_by_id_fkey
  foreign key (replaced_by_id) references public.cspl_documents (id)
  on delete set null;

create index if not exists cspl_documents_legal_status_idx
  on public.cspl_documents (legal_status);
