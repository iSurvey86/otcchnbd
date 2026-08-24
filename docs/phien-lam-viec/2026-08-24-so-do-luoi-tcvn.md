# 2026-08-24 — Sơ đồ lưới TT 68/2015 + TCVN 9401 (6.2–6.4)

## Đã làm

- **TT 68/2015 — Hệ thống lưới tọa độ và độ cao:** sơ đồ 1920×1080 nền tối, cột trái vàng (SỞ), nút phẳng, hàng giãn dọc; Unicode **TỌA**; tiêu đề ô in hoa; mũi tên nét liền (phát triển cấp) + nét đứt (DV→Chi tiết); bỏ mũi tên thừa giữa hàng 3→4 và ghi chú chân mũi tên. Script tái xuất: `scripts/export_so_do_luoi_tt68_png.js`.
- **TCVN 9401:2024 — Điều 6.2–6.4:** ba sơ đồ cùng layout, palette riêng — 6.2 indigo/hồng (`export_so_do_luoi_tcvn9401_png.js`); 6.3 xanh lục/cyan + 6.4 cam/đỏ (`export_so_do_luoi_tcvn9401_63_64_png.js`). Mỗi sơ đồ có PNG, SVG, `-4k.png`.
- **Kho TCVN:** OCR + làm sạch 9401 (`clean_ocr_tcvn9401.js` → `TCVN-9401-2024.clean.txt`); Word biên tập (`export_tcvn9401_docx.js`); `docs/tcvn/README.md` mô tả trạng thái PDF/OCR.
- **Không bump app / không HDSD / không workflow** — phiên chỉ tài liệu và sơ đồ minh họa, chưa gắn UI.

## File chính

| File | Vai trò |
|------|---------|
| `docs/tcvn/so-do-luoi-tt68-2015.png` (+ svg, -4k) | Sơ đồ lưới TT 68 (chốt) |
| `docs/tcvn/so-do-luoi-tcvn9401-2024*.png` | 6.2 KS CT / 6.3 MB thi công / 6.4 QT CD ngang |
| `scripts/export_so_do_luoi_tt68_png.js` | Tái xuất TT 68 |
| `scripts/export_so_do_luoi_tcvn9401_png.js` | Tái xuất 6.2 |
| `scripts/export_so_do_luoi_tcvn9401_63_64_png.js` | Tái xuất 6.3 + 6.4 |
| `docs/tcvn/TCVN-9401-2024.clean.txt` | Toàn văn OCR 9401 |
| `docs/tcvn/68_2015_TT-BTNMT(13437).extract.txt` | Toàn văn TT 68 |

## Việc tiếp

- [ ] Gắn sơ đồ vào màn ôn Đo đạc / HDSD nếu cần (khi đó mới bump `package.json`).
- [ ] OCR / PDF sạch **TCVN 9398:2012**; tuỳ chọn OCR 96 TCN 42/43.
- [ ] Soạn câu hỏi GNSS theo 9401; so sánh lưới TT 68 vs 9401.

## Câu mở phiên sau

> TT68 sơ đồ lưới đã chốt (`so-do-luoi-tt68-2015.png`, `node scripts/export_so_do_luoi_tt68_png.js`). TCVN 9401 có 3 sơ đồ 6.2/6.3/6.4 palette riêng. Kho TCVN trong `docs/tcvn/README.md`. Tiếp: gắn UI nếu cần, OCR 9398, hoặc câu hỏi GNSS.
