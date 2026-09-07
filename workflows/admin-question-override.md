# Workflow — Override câu hỏi (Admin)

## Trước khi test

- [ ] Chạy `supabase/schema-question-overrides.sql` (bảng + cột `feedback.bank_id`).
- [ ] Đăng nhập admin; `npm run dev`.

## Từ góp ý

1. `/admin` → **Góp ý người dùng** → mở chi tiết.
2. **Mở câu trong ôn** → tab mới, câu đứng đầu (`?q=`).
3. **Sửa câu (override)** → sửa đáp án / giải thích / nguồn → **Lưu override**.
4. Reload trang ôn/thi: thấy bản đã sửa (không cần deploy Git).

## Kho câu hỏi

1. Tab **Kho câu hỏi** → ô tìm (id / đề / nguồn).
2. **Sửa** / **Mở ôn** / badge **Override**.
3. **Xóa override** → khôi phục bản file gốc.

## Lỗi

- «Chưa chạy schema-question-overrides» → chạy SQL.
- Không tìm thấy câu → sai bank; thử tìm trong Kho câu hỏi.
