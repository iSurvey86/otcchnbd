# 2026-08-15 — Google Auth, hạn mức 15 câu, thống kê

## Quyết định sản phẩm

- Chưa thu tiền. Học viên Google xong thì dùng không giới hạn để gom thống kê.
- Đăng nhập Google (free), không SMS OTP.
- Admin = đăng nhập Google bằng `minhphuong.npsc@gmail.com`. Không làm form Admin/mật khẩu trên UI học viên.

## Hành vi

- Khách: 15 câu bất kỳ (ôn + thi thử). Hết → modal Google. Bắt đầu đề 40 câu khi đã hết hạn mức cũng phải login.
- Đã login: không giới hạn; Firestore ghi `login`, `question_answered`, `exam_started`, `exam_submitted`.
- Trang **Quản lý**: user, đăng nhập hôm nay, câu đã trả lời, bài đã nộp, nhật ký.

## Firebase đã bật trên máy này

- Project: `otcchnbd` (Spark), Firestore Standard `asia-southeast1`, Google Sign-in Enable.
- `.env.local` đã có khóa web (không commit).
- Popup Google chạy trên Chrome/Edge; Cursor Simple Browser lỗi `The requested action is invalid`.

## Không làm trong phiên

- Thanh toán / paywall thật.
- Deploy Vercel với env production.
- Push GitHub (để user quyết).
