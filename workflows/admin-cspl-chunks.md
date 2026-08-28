# Workflow — Admin CSPL chunks (Đo đạc)

## Trước khi test

- [ ] Đã chạy `supabase/schema-cspl-chunks.sql` trên project Supabase.
- [ ] Đăng nhập email trong `NEXT_PUBLIC_ADMIN_EMAILS`.
- [ ] Dev: `npm run dev` (sau build lớn nên xóa `.next` nếu CSS trắng).

## Kiểm tra tách / duyệt

1. `/admin` → tab **CSPL Đo đạc**.
2. Chọn 1 VB Word (vd. Luật 27/2018 hoặc TCVN 9398) → **Đoạn**.
3. Thấy «Chưa có đoạn» → **Tách đoạn**.
4. Có danh sách cite (`Điều n` hoặc `Mục x.y`) → **Duyệt** vài đoạn hoặc **Duyệt hết chờ**.
5. **Đưa vào dùng** → Pipeline = Đang dùng; không còn pending.
6. Đóng / mở lại **Đoạn**: load xong nhanh, **không** kẹt «Đang tải…» mãi.

## Kiểm tra lỗi đã biết

- [ ] Mở modal không gọi API lặp vô hạn (Network: GET chunks chỉ 1 lần lúc mở).
- [ ] Trùng số hiệu khi upload / sửa → báo lỗi, không lưu.
- [ ] Popup Sửa văn bản đủ rộng để đọc trích yếu.

## Sau này (chưa có)

- Sinh draft câu hỏi tháng từ chunk `approved` + VB `active`.
