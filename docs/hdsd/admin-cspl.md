# HDSD — Admin CSPL Đo đạc (upload → chunk → active)

Áp dụng tab **CSPL Đo đạc** trên `/admin`. Quy chế: `docs/Quy-che-van-hanh-sinh-cau-hoi-thang.md`.

## Upload văn bản

1. Chọn file PDF/Word → (tuỳ chọn) **Quét** điền form → kiểm lại số hiệu / loại / trích yếu.
2. **Lưu**. Hệ thống không nhồi file vào Git — lưu Storage + DB.
3. Số hiệu trùng → báo ngay, không cho lưu.

## Pipeline đoạn (bắt buộc trước khi sinh câu)

| Bước | Nút | Ý nghĩa |
|------|-----|---------|
| 1 | **Đoạn** | Mở danh sách đoạn đã tách (lần đầu thường trống). |
| 2 | **Tách đoạn** | Đọc file gốc → cắt Điều/Khoản (Luật–NĐ–TT) hoặc mục số (TCVN). |
| 3 | Duyệt / Loại / Sửa chữ | Hoặc **Duyệt hết chờ**. |
| 4 | **Đưa vào dùng** | VB → `active`. Chỉ chunk **Đã duyệt** của VB active mới cite được. |

Cột **Pipeline** trên bảng: Đã tải lên → Chờ duyệt đoạn → Đang dùng.

### Cơ sở tách

- Có «Điều n» → mỗi Điều một đoạn; Điều dài có Khoản → tách thêm Khoản.
- TCVN kiểu `4.2`, `5.1.1` → cite `Mục …`.
- Không nhận cấu trúc → cắt khối ~1500 ký tự (fallback).

## Sửa / phụ lục / hết HL

- **Sửa**: metadata (số hiệu, ngày, trích yếu…); file gốc giữ nguyên — đổi file: xóa upload lại hoặc thêm phụ lục.
- **Phụ lục**: PDF/Word kèm (Công báo, bảng số…).
- **Hết HL**: đánh dấu hiệu lực pháp lý (khác pipeline chunk).

## Lưu ý kỹ thuật

- Lần đầu sau deploy: chạy `supabase/schema-cspl-chunks.sql` trên Supabase SQL Editor.
- PDF scan không có lớp chữ: upload **Word OCR** rồi tách.
- Tách VB dài (TT 68, TCVN 9401) có thể 30–90 giây.
