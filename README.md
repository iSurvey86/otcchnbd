# Ôn thi chứng chỉ hành nghề đo đạc bản đồ

Ứng dụng trắc nghiệm luyện thi sát hạch chứng chỉ hành nghề đo đạc và bản đồ.

## Thể lệ mô phỏng

- 40 câu / 45 phút
- 24 câu kinh nghiệm nghề nghiệp (60 điểm) + 16 câu kiến thức pháp luật (40 điểm)
- Mỗi câu 2,5 điểm; đạt khi **mỗi phần ≥ 80%** điểm tối đa (pháp luật ≥ 32/40 và nghề nghiệp ≥ 48/60)

Nguồn câu hỏi: Quyết định 308/QĐ-ĐĐBĐVN ngày 29/12/2020 của Cục Đo đạc, Bản đồ và Thông tin địa lý Việt Nam (100 câu pháp luật, 293 câu kinh nghiệm nghề nghiệp).

## Stack

- **Vercel** — host Next.js
- **Firebase Auth** — đăng nhập Google
- **Supabase (Postgres)** — users / nhật ký / góp ý

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Cấu hình

1. Copy `.env.example` → `.env.local`.
2. **Firebase Auth:** bật Google Sign-in; Authorized domains gồm `localhost`, `onthicchn.org`.
3. **Firebase Admin:** Project settings → Service accounts → Generate private key → điền `FIREBASE_ADMIN_*`.
4. **Supabase:** tạo project → SQL Editor chạy file `supabase/schema.sql` → lấy Project URL + `service_role` key.
5. Vercel: khai báo cùng biến env (Production), rồi Redeploy.

Admin: Gmail trong `NEXT_PUBLIC_ADMIN_EMAILS` (mặc định có `minhphuong.npsc@gmail.com`).
