# Workflow — UX ôn Đo đạc (sơ đồ + tìm câu + xem như NG)

> 2026-09-07 · app `0.1.2`

## Phạm vi thay đổi

- Gallery sơ đồ lưới → **accordion** (tên + căn cứ; bấm mở ảnh).
- Ô **Tìm câu hỏi** trên trang bộ đề (Đo đạc / XD / Đấu thầu).
- Admin **Xem như người dùng** / topbar **Xem như NG**.
- (Nền) Ôn theo phần PL / chuyên môn; Admin log default Ẩn admin.

## Kiểm tra sau deploy

1. `/do-dac-ban-do/official-2020` — ô tìm ≥ 2 ký tự → tối đa 20 kết quả; bấm → `practice?q=…`; không lộ ghi chú Admin.
2. Cuối trang — 4 dòng sơ đồ dạng `1. … (TT 68/2015)`; mặc định thu gọn; bấm mở ảnh; phóng to / Esc / Đóng.
3. Admin → **Xem như người dùng** → về `/`, không còn **Quản lý**; topbar **Thoát xem như NG** → Admin lại.
4. Admin Kho câu hỏi — hàng tìm; nhật ký trang cuối hiện **Hết**.
5. (Regression) 2 card tím/hồng ôn theo phần; Admin log mặc định Ẩn admin.

## Tái xuất sơ đồ (dev)

Nguồn trong `docs/tcvn/`. Sau khi sửa script:

```bash
node scripts/export_so_do_luoi_tt68_png.js
node scripts/export_so_do_luoi_tcvn9401_png.js
node scripts/export_so_do_luoi_tcvn9401_63_64_png.js
```

Copy lại 4 PNG thường (không `-4k`) vào `public/tcvn/`:

- `so-do-luoi-tt68-2015.png`
- `so-do-luoi-tcvn9401-2024.png`
- `so-do-luoi-tcvn9401-2024-thicong.png`
- `so-do-luoi-tcvn9401-2024-quantrac.png`

## File liên quan

| Layer | File |
|-------|------|
| UI | `DdGridDiagrams.tsx`, `QuestionSearch.tsx`, `Home.tsx`, `DoDacBrowse.tsx`, `DtBrowse.tsx` |
| Admin preview | `useAdminViewAsUser.ts`, `Layout.tsx`, `Admin.tsx` |
| Data | `src/data/dd/diagrams.ts`, `src/data/topics.ts` |
| Routing | `src/lib/paths.ts`, `src/types.ts` (`practice.questionId`) |
| Style | `src/app/globals.css` (`.dd-diagram-*`, `.q-search-*`, `.admin-q-search-*`) |
| Static | `public/tcvn/*.png` |
| HDSD | `docs/hdsd/do-dac-on-tap.md` |
