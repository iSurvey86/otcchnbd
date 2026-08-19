# 2026-08-20 — Đo đạc multi-bank + hub Đấu thầu 2 cột

## Đo đạc — nhiều ngân hàng câu hỏi

### Đã làm

- **Số hóa ngân hàng 2019:** `scripts/parse_dd2019.py` → `src/data/dd/official-2019.json` (**244 câu**: 80 PL + 164 KN). Metadata `official-2019` trong `src/data/dd/banks.ts` (`ready: true`).
- **Routing theo bankId:** `/do-dac-ban-do/[bankId]/` (home, practice, exam, history, result). Trang `/do-dac-ban-do` = chọn bộ đề (`DoDacBrowse`).
- **Màn chọn bộ đề** (`DoDacBrowse.tsx` + CSS `.dd-browse-*`):
  - 2 cột desktop: ONTHICCHN trái, chính thức phải (tiêu đề căn phải).
  - Card KPI: gradient, bar trên, nút **Vào ôn & thi thử** góc phải; badge **Chính thức** / **New** (ONTHICCHN mới nhất).
  - Khuyến nghị card featured phía trên (2020).
- **Wire bankId** qua `StudyScope.bankId`: `bank.ts`, `paths.ts`, `Home`, `Exam`, `History`, `Result`, `Certificate`, `Layout`, `TrackBankGate`, `useDdBank`.

### Trang ôn Đo đạc (Home)

- Hero dòng 3: chỉ **Đo đạc và Bản đồ** (bỏ tên ngân hàng khỏi `sectorTitle`).
- **Bỏ banner** “Bộ đang học” (tên QĐ, nút Đổi bộ đề). Nguồn vẫn ở `source-note` dưới KPI.

---

## Đấu thầu — hub 2 cột

### Đã làm

- **Layout 2 cột** (`DtBrowse.tsx`, tái dùng `.dd-browse-columns`):
  - **Trái:** Ôn luyện (tiếp tục → câu sai → random 10/20/30) + **Ôn thi theo bộ đề từ ONTHICCHN**.
  - **Phải:** Ôn theo văn bản (5 nhóm, tiêu đề căn phải).
- **ONTHICCHN Đấu thầu:** `DT_ONTHICCHN_SETS` trong `groups.ts` — 07/2026, 06/2026, `ready: false`, card “Sắp có”. Tiêu đề: **Bộ câu hỏi cập nhật tháng MM/YYYY** + **New** trên bộ mới nhất.
- Chưa có JSON ngân hàng ONTHICCHN cho Đấu thầu (chỉ có `bank.json` NVCM 390 câu).

---

## OTP email (Supabase — không sửa code)

- Template **Magic Link** trên Supabase Dashboard → Body dùng `{{ .Token }} là mã đăng nhập ONTHICCHN.ORG của bạn`.
- Code gửi OTP: `src/lib/emailOtp.ts` → `signInWithOtp`.

---

## Dev local

- CSS/HTML trôi: thường do **`.next` hỏng** hoặc **2 process dev** (port 3000 + 3001). Fix: kill node, `Remove-Item -Recurse -Force .next`, `npm run dev`.
- **Không** chạy `npm run build` song song dev rồi refresh dev — dễ lỗi chunk 404.

---

## File chính

| File | Vai trò |
|------|---------|
| `src/data/dd/banks.ts` | Metadata 2020/2019/ONTHICCHN |
| `src/data/dd/official-2019.json` | 244 câu 2019 |
| `src/data/dd/questions.ts` | Loader theo bankId |
| `src/views/DoDacBrowse.tsx` | Chọn bộ đề Đo đạc |
| `src/views/DtBrowse.tsx` | Hub Đấu thầu 2 cột |
| `src/data/dt/groups.ts` | `DT_ONTHICCHN_SETS` placeholder |
| `src/lib/bank.ts` | `sectorTitle`, `sourceNoteForScope`, bank scope |
| `src/views/Home.tsx` | Bỏ banner Bộ đang học |
| `scripts/parse_dd2019.py` | Parser PDF → JSON |
| `src/app/globals.css` | `.dd-browse-*`, `.dt-browse-*` |

---

## Việc tiếp

- [ ] **Commit + deploy** khi user yêu cầu (nhiều file chưa commit; bỏ `tmp-*`, `__pycache__`).
- [ ] Bổ sung **JSON ONTHICCHN Đấu thầu** (07/2026, 06/2026) + routing ôn thi.
- [ ] Cập nhật **email template Supabase** (subject + body OTP).
- [ ] (Tuỳ) Dọn file tạm `tmp-*.txt/json` ở root repo.
- [ ] Gắn a–d Điều 18 khi có bảng BTC — **không** auto-tag.

---

## Kiểm tra nhanh

- [x] `npm run build` pass (2026-08-20).
- [ ] `/do-dac-ban-do` — chọn 2019/2020/ONTHICCHN, vào ôn + thi.
- [ ] `/dau-thau` — 2 cột, ONTHICCHN placeholder, ôn theo văn bản căn phải.
- [ ] `/do-dac-ban-do/official-2019` — hero 3 dòng, không banner Bộ đang học.
