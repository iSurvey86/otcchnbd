# 2026-09-07 — Tìm câu hỏi, Xem như NG, sơ đồ thu gọn

## Ngữ cảnh

Sau `0399c67` (pack tháng + question overrides), phiên này tập trung UX end-user và Admin preview.

## Thay đổi

### Tìm câu hỏi

- Component `QuestionSearch`: tìm trong ngân hàng đang chọn (đề / phương án / nguồn).
- Gắn `Home` (Đo đạc, Xây dựng) và `DtBrowse` (Đấu thầu).
- `practice` nhận `questionId` → URL `?q=`; `pathForView` encode query.

### Xem như người dùng

- `localStorage` key `otcchnbd.admin.viewAsUser`.
- Topbar: **Xem như NG** ẩn **Quản lý**; **Thoát xem như NG** mở lại Admin.
- Trang Admin: nút **Xem như người dùng** → `/`.

### Sơ đồ lưới

- `DdGridDiagrams`: danh sách thu gọn số thứ tự + tên + `(căn cứ)`; expand mới hiện ảnh / lightbox.
- Bỏ đoạn intro dưới tiêu đề section.

### Admin polish

- Pager: trang cuối hiện **Hết** (không còn nút Tiếp disabled).
- Kho câu hỏi: hàng tìm `admin-q-search-row`.

## Không commit

- `scripts/create-dd-intro-docx.mjs` (local helper).

## Kiểm tra nhanh

1. `/do-dac-ban-do/official-2020` — ô tìm ≥ 2 ký tự → mở practice đúng câu.
2. Admin → **Xem như người dùng** → không còn **Quản lý**; **Thoát xem như NG**.
3. Cuối trang Đo đạc — 4 dòng sơ đồ; bấm mở / đóng; phóng to ảnh.
