# Workflow — Pack câu hỏi tháng (Đo đạc)

## Trước khi test

- [ ] Đã chạy `supabase/schema-cspl-chunks.sql` và `schema-cspl-monthly-pack.sql`.
- [ ] Có ≥1 VB `active` + chunk `approved` (tab CSPL → Đoạn).
- [ ] `GEMINI_API_KEY` trong `.env.local` / Vercel.
- [ ] Đăng nhập admin.

## Tạo pack + sinh draft

1. `/admin` → tab **Pack tháng**.
2. Chọn `YYYY-MM` (mặc định tháng sau GMT+7) → **Tạo / mở pack**.
3. **Sinh +5 câu AI** (có thể lặp đến ≥ min 40).
4. Mở từng câu: kiểm 4 mục giải thích + cite; **Duyệt** / **Loại**.
5. Nếu AI đề xuất đa nguồn → tick **Admin tick đa nguồn**.

## Gate (quy chế — MVP chưa publish tự động)

Đủ khi: ≥ min câu, toàn bộ approved, cite OK, 4 mục OK, tỷ lệ PL/KN.  
Publish **01 00:00 GMT+7** / khóa thi thử — **chưa code** trong MVP này.

## Lỗi thường gặp

- «Chưa có VB active» → Admin tách/duyệt chunk rồi **Đưa vào dùng**.
- «Chưa tạo bảng pack» → chạy SQL monthly-pack.
- AI 422 thiếu 4 mục / cite → bấm Sinh lại.
