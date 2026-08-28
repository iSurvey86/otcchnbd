# Workflow — UX ôn Đo đạc (sơ đồ + ôn theo phần)

> 2026-08-28 · commit `464b9bf`

## Phạm vi thay đổi

- Gallery sơ đồ lưới TT 68 / TCVN 9401 trên hub và trang bộ đề Đo đạc.
- Hai entry ôn theo cả phần PL / chuyên môn.
- Admin log: default Ẩn admin.

## Kiểm tra sau deploy

1. `/do-dac-ban-do` — cuối trang có 4 sơ đồ; bấm mở modal, đóng được.
2. `/do-dac-ban-do/official-2020` — hero 393 / 100 / 293; 2 card tím/hồng; 8 chuyên đề; sơ đồ lưới.
3. Bấm **Ôn kiến thức pháp luật** → practice 100 câu; **Kiến thức chuyên môn** → 293 câu.
4. Admin → Nhật ký: lần đầu vào thấy **Hiện admin** (tức đang ẩn log admin).

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
| UI | `src/components/DdGridDiagrams.tsx`, `src/views/Home.tsx`, `src/views/DoDacBrowse.tsx` |
| Data | `src/data/dd/diagrams.ts`, `src/data/topics.ts` (`DD_SECTION_TOPICS`) |
| Routing ôn | `src/lib/bank.ts` (`dd-phap-luat`, `dd-kinh-nghiem`) |
| Style | `src/app/globals.css` (`.dd-section-tone-*`, `.dd-diagram-*`) |
| Static | `public/tcvn/*.png` |
| HDSD | `docs/hdsd/do-dac-on-tap.md` |
