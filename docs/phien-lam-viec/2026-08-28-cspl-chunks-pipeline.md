# 2026-08-28 (tối) — CSPL chunk pipeline + TCVN Word + Admin UX

## Đã làm

### CSPL — tách / duyệt đoạn (MVP)
- Schema `supabase/schema-cspl-chunks.sql` → bảng `cspl_chunks`.
- Tách: Luật/NĐ/TT theo **Điều** (+ Khoản nếu Điều dài); TCVN theo **mục số** (`Mục 4.2`…).
- API: `GET/POST/PATCH /api/admin/cspl/[id]/chunks`, `PATCH …/chunks/[chunkId]`.
- UI: nút **Đoạn** trên bảng CSPL → modal **Tách đoạn → Duyệt → Đưa vào dùng** (`active`).
- Fix vòng lặp load modal (onDocumentUpdated → re-fetch vô hạn).

### Kho TCVN / Word
- OCR + clean **TCVN 9398:2012**; xuất Word thống nhất lề TT 01/2011 (`export_tcvn_clean_docx.js`).
- Tái xuất **TCVN-9401-2024.docx** cùng bố cục.
- CSPL Đo đạc trên Supabase: **8 VB** (Luật + 4 NĐ + TT 68 + 2 TCVN) — file gốc đã upload; pipeline vẫn `uploaded` đến khi Admin tách/duyệt.

### Admin / Catalog
- Popup **Sửa văn bản** rộng hơn (~920px).
- CSPL: STT, cột kéo được, cảnh báo trùng số hiệu; Catalog lead 3 dòng; admin shell full width.

## Việc vận hành còn lại (Admin)

1. Chạy SQL `schema-cspl-chunks.sql` trên Supabase (nếu chưa).
2. Mỗi VB: **Đoạn** → **Tách đoạn** → duyệt → **Đưa vào dùng**.
3. Sau đó mới sinh pack câu hỏi tháng (chưa code).

## Không commit

- `tmp-*`, `__pycache__`, `*.traineddata`, mockup sơ đồ TT68 tạm.
