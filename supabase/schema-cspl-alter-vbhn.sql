-- Nếu đã chạy schema-cspl.sql trước khi có loại vbhn:
-- chạy đoạn này trên Supabase SQL Editor để bổ sung "Văn bản hợp nhất".

alter table public.cspl_documents
  drop constraint if exists cspl_documents_doc_type_check;

alter table public.cspl_documents
  add constraint cspl_documents_doc_type_check
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
  ));
