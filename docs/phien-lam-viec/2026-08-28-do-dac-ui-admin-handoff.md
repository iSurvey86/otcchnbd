# 2026-08-28 — Gắn sơ đồ lưới UI + ôn theo phần + admin Ẩn admin

## Đã làm

- **`git pull`** (fast-forward `b114976 → aeec5fd`), đọc HANDOFF phiên 2026-08-24, tiếp tục công việc.
- **Sơ đồ lưới trên web:** copy 4 PNG vào `public/tcvn/`; component `DdGridDiagrams` (gallery + modal phóng to) gắn ở hub `/do-dac-ban-do` và trang bộ đề `/do-dac-ban-do/[bankId]`. Nguồn gốc: `docs/tcvn/so-do-luoi-*.png`.
- **Ôn theo phần (KPI card):** thêm 2 card trước 8 chuyên đề con — **100 câu** kiến thức pháp luật (`dd-phap-luat`), **293 câu** kiến thức chuyên môn (`dd-kinh-nghiem`). Palette riêng tím / hồng (`dd-section-tone-law` / `dd-section-tone-skill`), không trùng màu KPI hero hay topic-tone.
- **Admin nhật ký:** mặc định **Ẩn admin** bật khi chưa có preference `localStorage`.
- **Bump** `package.json` → `0.1.0`.
- **Commit + push:** `464b9bf` lên `main`.

## File chính

| File | Vai trò |
|------|---------|
| `src/components/DdGridDiagrams.tsx` | Gallery sơ đồ + modal |
| `src/data/dd/diagrams.ts` | Metadata 4 sơ đồ |
| `public/tcvn/so-do-luoi-*.png` | Asset phục vụ web |
| `src/data/topics.ts` | `DD_SECTION_TOPICS` (ôn theo phần) |
| `src/lib/bank.ts` | Lọc `dd-phap-luat` / `dd-kinh-nghiem` |
| `src/views/Home.tsx` | Card phần + sơ đồ |
| `src/views/DoDacBrowse.tsx` | Sơ đồ trên hub |
| `src/views/Admin.tsx` | Default Ẩn admin |
| `docs/hdsd/do-dac-on-tap.md` | HDSD ôn Đo đạc (cập nhật UX) |
| `workflows/do-dac-on-tap-ux.md` | Workflow triển khai / kiểm tra |

## Việc tiếp

- [ ] OCR / PDF sạch **TCVN 9398:2012**; tuỳ chọn OCR 96 TCN 42/43.
- [ ] Soạn câu hỏi GNSS theo 9401; so sánh lưới TT 68 vs 9401.
- [ ] JSON + routing **ONTHICCHN Đấu thầu** (07/2026, 06/2026).
- [ ] Cập nhật **email template Supabase** (Magic Link / OTP).

## Câu mở phiên sau

> Đọc HANDOFF mới nhất. Đo đạc đã có sơ đồ lưới TT68 + TCVN9401 trên web (`DdGridDiagrams`, `public/tcvn/`). Ôn theo phần: 100 PL + 293 chuyên môn (card tím/hồng). Admin log mặc định Ẩn admin. Build pass; đã push `464b9bf`. Tiếp: OCR 9398, câu hỏi GNSS, hoặc data ONTHICCHN Đấu thầu.
