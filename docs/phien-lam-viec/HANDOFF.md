# HANDOFF — Ôn thi CCHN (otcchn / otcchnbd)

> **Máy khác:** `git pull` → đọc block **đầu tiên** dưới đây → tiếp tục chat.  
> **Cuối phiên:** `làm cuối phiên đầy đủ`.

---

## 2026-08-20 — Đo đạc multi-bank + hub Đấu thầu 2 cột

### Đã làm

- **Đo đạc multi-bank:** routing `/do-dac-ban-do/[bankId]/…`; màn chọn bộ (`DoDacBrowse`) 2 cột ONTHICCHN | chính thức; ngân hàng **2019** số hóa (244 câu, `official-2019.json`); wire `bankId` toàn app.
- **Home Đo đạc:** hero chỉ **Đo đạc và Bản đồ**; **bỏ banner** “Bộ đang học”.
- **Hub Đấu thầu:** 2 cột — trái ôn luyện + ONTHICCHN (placeholder 07/06-2026); phải ôn theo văn bản (căn phải).
- **OTP mail:** hướng dẫn sửa template Supabase (`{{ .Token }} là mã đăng nhập ONTHICCHN.ORG của bạn`) — chưa đổi trên dashboard.
- **Dev:** fix CSS trôi = xóa `.next`, kill process dev cũ, restart một port.

### File chính

| File | Vai trò |
|------|---------|
| `src/data/dd/` | banks, questions, official-2019.json |
| `src/views/DoDacBrowse.tsx` | Chọn bộ đề Đo đạc |
| `src/views/DtBrowse.tsx` | Hub Đấu thầu 2 cột |
| `src/data/dt/groups.ts` | `DT_ONTHICCHN_SETS` (chưa có data) |
| `src/lib/bank.ts` | Scope theo bankId, `sectorTitle` |
| `scripts/parse_dd2019.py` | Parser PDF 2019 |

### Việc tiếp

- [ ] **Chưa commit** — push/deploy khi user bảo.
- [ ] JSON + routing **ONTHICCHN Đấu thầu** (07/2026, 06/2026).
- [ ] Cập nhật **email template Supabase** (Magic Link / OTP).
- [ ] Dọn `tmp-*` ở root (không commit).
- [ ] Gắn a–d Điều 18 khi có bảng BTC.

### Câu mở phiên sau

> Đọc HANDOFF mới nhất. Đo đạc đã multi-bank (2019/2020/ONTHICCHN), hub chọn bộ 2 cột. Đấu thầu hub 2 cột; ONTHICCHN ĐT mới placeholder. Home DD bỏ banner Bộ đang học. Build pass; chưa commit. Tiếp: data ONTHICCHN ĐT, Supabase mail, commit/deploy.

Chi tiết: [2026-08-20-do-dac-multi-bank-dt-browse.md](./2026-08-20-do-dac-multi-bank-dt-browse.md)

---

## 2026-08-18 (tối) — Chứng nhận phôi PNG + OTP local + ẩn admin

### Đã làm

- **Chứng nhận thi thử:** chồng chữ lên phôi `public/certificates/`. Đạt = `phoi-dat.png`; chưa đạt = `phoi-chua-dat.png` + hoa overlay. Gạch chân tên / vạch ký do CSS. Phiếu chưa đạt: khối ÔN + hoa trên nền trắng, lệch phải. Disclaimer nghiêng, chữ đậm; `onthicchn.org` màu đồng; con dấu ĐẠT / ÔN TIẾP.
- **OTP local:** verify thử `email|magiclink|signup`; form nhắc không bấm link mail. Local đã login được (web vốn ổn).
- **Admin nhật ký:** nút Ẩn/Hiện admin.
- **UI:** ôn tập xem lại câu + khung thi thử căn giữa (`0ee9f68`); ô tên không cắt dấu; đồng hồ/tên căn giữa tab.

### File chính

| File | Vai trò |
|------|---------|
| `src/components/Certificate.tsx` | Chồng nội dung lên phôi |
| `public/certificates/` | `phoi-dat.png`, `phoi-chua-dat.png`, `hoa-chua-dat.png` |
| `src/lib/emailOtp.ts` | Verify OTP nhiều type |
| `src/views/Admin.tsx` | Ẩn admin trong nhật ký |
| `src/views/Practice.tsx` | Màn kết thúc ôn (đã push sớm) |

### Việc tiếp

- [ ] (Tuỳ) Tinh chỉnh vị trí khối hoa/logo phiếu chưa đạt nếu còn lệch phôi.
- [ ] Gắn a–d Điều 18 khi có bảng BTC — **không** auto-tag.
- [ ] Log cũ: không có chữ chọn A/B — chỉ log mới.

### Câu mở phiên sau

> Đọc HANDOFF mới nhất. Chứng nhận dùng phôi PNG (đạt vàng / chưa đạt hồng). OTP local đã ổn (verify nhiều type). Admin nhật ký có Ẩn admin. Tiếp: tinh chỉnh chứng nhận nếu cần, hoặc Điều 18 khi có bảng BTC.

Chi tiết: [2026-08-18-chung-chi-otp-admin.md](./2026-08-18-chung-chi-otp-admin.md)

---

## 2026-08-18 — Nhật ký admin + Đấu thầu 70/60/100 (bỏ lô)


### Đã làm

- **Admin nhật ký:** cột Lĩnh vực; ôn/thi dưới `ON_THI`; chi tiết câu + chọn/đáp án + Đúng/Sai (log mới); nộp bài việt hóa `điểm/tổng · ngưỡng · Đạt/Không đạt`; font mỏng; căn giữa tên/hành động; căn giữa hàng; góp ý user nền xanh nhạt.
- **Log ôn tập:** `practice_started` / `practice_finished`; trả lời ghi `correct`, `choice`, `prompt`, `sector`. Log cũ không có đáp án đã chọn.
- **Đấu thầu:** bỏ KPI lô. Hub `/dau-thau`: thi thử 70 câu / 60 phút / 100 điểm (100/70 mỗi câu đúng, đạt ≥ 50, xếp loại Điều 20). Ôn: tiếp tục, câu sai, random 10/20/30, theo văn bản. URL lô cũ redirect về hub.
- **OTP đổi tài khoản:** đã push `245aa7b` (clear Firebase session trước custom token).

### File chính

| File | Vai trò |
|------|---------|
| `src/views/Admin.tsx` | Bảng nhật ký / chi tiết góp ý |
| `src/views/DtBrowse.tsx` | Hub Đấu thầu (ôn + thi thử) |
| `src/lib/exam.ts` | `EXAM_DAU_THAU` 70/60/100, `examGradeLabel` |
| `src/data/dt/groups.ts` | Gom câu theo Luật / NĐ 214 / TT 79 |
| `src/lib/dtPractice.ts` | Cursor ôn tiếp + hàng đợi câu sai (localStorage) |
| `src/lib/paths.ts` | `/dau-thau/practice\|exam\|history\|result` |
| `src/context/AuthContext.tsx` | OTP switch account + payload log câu |

### Việc tiếp

- [ ] Vercel Production deploy xong thì thử: đổi email OTP; nhật ký admin; thi thử Đấu thầu 70 câu.
- [ ] Log cũ: không có chữ chọn A/B — chỉ log mới sau deploy.
- [ ] (Tuỳ) Màn kết thúc phiên ôn: xem lại từng câu đúng/sai.
- [ ] (Tuỳ) Gắn a–d Điều 18 khi có bảng phân loại từ BTC — **không** auto-tag.

### Câu mở phiên sau

> Đọc HANDOFF mới nhất. Đấu thầu đã bỏ lô: thi 70/60/100, ôn theo văn bản. Admin log có Lĩnh vực + đúng/sai (log mới). OTP đổi account đã fix (`245aa7b`). Tiếp: kiểm tra production sau Vercel, hoặc màn kết thúc ôn tập.

Chi tiết ngày: [2026-08-18-admin-log-va-dau-thau.md](./2026-08-18-admin-log-va-dau-thau.md)

---

## 2026-08-15 — Google login + 15 câu miễn phí + trang Quản lý

### Đã làm

- Giai đoạn đầu: **test app + thu thống kê, chưa thu phí**.
- Khách được **15 câu** (ôn tập hoặc thi thử, cộng dồn). Hết hạn mức → cửa sổ **Đăng nhập Google**. Đã login thì ôn/thi không giới hạn.
- Firebase Auth (Google) + Firestore (`users`, `logs`). Admin: Gmail `minhphuong.npsc@gmail.com` → nút **Quản lý**.
- Đã bỏ form Admin + mật khẩu (nhìn thô trên form học viên).
- Đăng nhập Google phải dùng **Chrome/Edge** (`http://localhost:5173`), không dùng preview Cursor.
- Khóa API nằm trong `.env.local` (gitignored). Vite COOP `same-origin-allow-popups` để popup Google chạy.

### File chính

| File | Vai trò |
|------|---------|
| `src/context/AuthContext.tsx` | Google login, hạn mức khách, ghi log |
| `src/components/LoginModal.tsx` | Cửa sổ đăng nhập Google |
| `src/components/QuotaHint.tsx` | Banner còn x/15 câu |
| `src/pages/Admin.tsx` | Thống kê user + nhật ký |
| `src/lib/firebase.ts` | Init Firebase từ `VITE_*` |
| `firestore.rules` | User tự ghi; admin đọc hết |
| `.env.example` | Mẫu biến môi trường |

### Việc tiếp

- [ ] Firestore Console: dán `firestore.rules` rồi **Publish** nếu chưa (cần để trang Quản lý đọc được log).
- [ ] Vercel: khai báo các biến `VITE_*` (copy từ `.env.local`), thêm domain Vercel vào Firebase Authorized domains.
- [ ] Thu phí sau: khoá nội dung sau khi đã có số liệu thật.
- [ ] Push `main` lên GitHub khi muốn.

### Câu mở phiên sau

> Đọc HANDOFF mới nhất. App local: 15 câu rồi Google. Admin = Gmail minhphuong.npsc@gmail.com. Tiếp: Publish rules + Vercel env, hoặc thu phí sau.

Chi tiết ngày: [2026-08-15-google-auth-thong-ke.md](./2026-08-15-google-auth-thong-ke.md)
