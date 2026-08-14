# HANDOFF — Ôn thi CCHN đo đạc bản đồ (otcchnbd)

> **Máy khác:** `git pull` → đọc block **đầu tiên** dưới đây → tiếp tục chat.  
> **Cuối phiên:** `làm cuối phiên đầy đủ`.

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
