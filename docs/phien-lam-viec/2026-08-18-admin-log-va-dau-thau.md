# 2026-08-18 — Nhật ký admin + Đấu thầu bỏ lô (70/60/100)

## Quyết định sản phẩm

- Nhật ký admin phải trả lời: **ai / lĩnh vực nào / câu gì / chọn gì / đúng hay sai**.
- Đấu thầu **bỏ lô 20 câu**. Thi thử = Thông báo 1891: **70 câu / 60 phút / 100 điểm**, đạt ≥ 50 (Điều 20 TT 02/2024).
- Ôn theo văn bản pháp lý (Luật / NĐ 214 / TT 79), câu sai, ngẫu nhiên 10/20/30, tiếp tục chỗ dở.
- Không gắn nhãn a–d Điều 18 (ngân hàng BTC không phân loại).

## OTP / đăng nhập (đã push trước trong phiên)

- Commit `245aa7b`: đăng xuất session Firebase cũ trước khi OTP tài khoản khác (`signInWithCustomToken`).
- Production: chờ Vercel deploy; mã OTP đã dùng thì phải **Gửi lại mã**.

## Không làm trong phiên

- Màn kết thúc phiên ôn tập đầy đủ (xem lại từng câu) — user nói không, ý là git handoff.
- Gắn tay nhóm a/b/c/d Điều 18.
- Push force / sửa env production.
