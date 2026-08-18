# 2026-08-18 (tối) — Chứng nhận thi thử + OTP local + ẩn admin

## Quyết định sản phẩm

- Chứng nhận **đạt / chưa đạt đều có**, dùng phôi PNG (không vẽ SVG). Đạt = vàng–xanh; chưa đạt = hồng + hoa vàng.
- Phôi **không** vạch sẵn: code tự gạch chân tên (vàng) và vạch chữ ký (xám).
- Phiếu chưa đạt: logo ÔN + ONTHICCHN.ORG nằm trên hoa, cả khối trên nền trắng bên phải.
- Dòng disclaimer in nghiêng, chữ đậm (không xám mờ); `onthicchn.org` màu đồng; **ÔN TIẾP** / **ĐẠT** trong vòng tròn.

## OTP local

- Web production OTP ổn. Local từng `otp_expired` vì copy `.env.local` khi `npm run dev` đang chạy (EBUSY) và verify chỉ thử `type: email`.
- Đã thử lần lượt `email` / `magiclink` / `signup`; `flowType: implicit`. Local đã vào được.
- Mã đã dùng / đã bấm link trong mail → phải **Gửi lại mã**, chỉ gõ 6 số.

## UI khác

- Màn kết thúc ôn: xem lại từng câu (đã push `0ee9f68` đầu phiên).
- Khung thi thử Đấu thầu: kích thước cột cũ, căn giữa (cùng commit).
- Ô họ tên thi thử: tăng chiều cao, không cắt dấu.
- Tab thi: đồng hồ + tên căn giữa.
- Nhật ký admin: nút **Ẩn admin** / **Hiện admin** (lọc email `NEXT_PUBLIC_ADMIN_EMAILS`, nhớ localStorage).

## File phôi

- `public/certificates/phoi-dat.png`
- `public/certificates/phoi-chua-dat.png`
- `public/certificates/hoa-chua-dat.png` (cắt hoa từ phôi hồng để dịch vị trí)

## Không làm

- Gắn a–d Điều 18.
- Sửa env production / push force.
