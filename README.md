# Ôn thi chứng chỉ hành nghề đo đạc bản đồ

Ứng dụng trắc nghiệm luyện thi sát hạch cấp chứng chỉ hành nghề đo đạc và bản đồ.

## Thể lệ mô phỏng

- 40 câu / 45 phút
- 24 câu kinh nghiệm nghề nghiệp (60 điểm) + 16 câu kiến thức pháp luật (40 điểm)
- Mỗi câu 2,5 điểm; đạt khi **mỗi phần ≥ 80%** điểm tối đa (pháp luật ≥ 32/40 và nghề nghiệp ≥ 48/60)

Nguồn câu hỏi: Quyết định 308/QĐ-ĐĐBĐVN ngày 29/12/2020 của Cục Đo đạc, Bản đồ và Thông tin địa lý Việt Nam (100 câu pháp luật, 293 câu kinh nghiệm nghề nghiệp).

## Chạy local

```bash
npm install
npm run dev
```

Mở địa chỉ Vite in ra (thường là `http://localhost:5173`).

Chưa cấu hình Firebase thì app vẫn chạy: khách được ôn/thi không giới hạn, nút đăng nhập báo chưa cấu hình.

## Đăng nhập Google và thống kê (giai đoạn thử nghiệm)

Giai đoạn đầu: khách được **15 câu miễn phí** (ôn tập hoặc thi thử). Hết hạn mức thì bắt đăng nhập Google. **Sau khi đăng nhập vẫn miễn phí** để thu thập thống kê; thu phí làm sau.

1. Tạo project trên [Firebase Console](https://console.firebase.google.com/).
2. Bật **Authentication → Google**.
3. Tạo **Firestore** (production mode), dán nội dung `firestore.rules` rồi Publish.
4. (Tuỳ chọn) Document `meta/config` field `adminEmails` kiểu array nếu muốn thêm admin khác. Gmail `minhphuong.npsc@gmail.com` đã gắn sẵn trong `firestore.rules`.
5. Authentication → Settings → **Authorized domains**: `localhost` và domain Vercel.
6. Copy file `.env.example` thành `.env.local`, điền khóa web app.
7. Restart `npm run dev`. Đăng nhập Google bằng `minhphuong.npsc@gmail.com` để thấy nút **Quản lý**.

Trên Vercel, khai báo cùng các biến `VITE_*` trong Project Settings → Environment Variables.
