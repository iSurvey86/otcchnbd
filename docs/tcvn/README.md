# Kho tài liệu TCVN / quy định đo đạc bản đồ

Thư mục: `docs/tcvn/` — cập nhật 2026-08-24.

## Trạng thái đọc máy (OCR / text layer)

| File PDF | Loại | Trang | Text layer | Sẵn sàng hỏi–đáp / trích dẫn |
|----------|------|------:|-----------|------------------------------|
| `68_2015_TT-BTNMT(13437).pdf` | Thông tư 68/2015/TT-BTNMT | 70 | **Có** (~110k ký tự) | **Sẵn sàng** |
| `TCVN 9398_2012 … Yeu cau chung.pdf` | TCVN 9398:2012 | 32 | **Đã OCR** → `TCVN-9398-2012.clean.txt` | **Sẵn sàng** (văn bản; bảng số liệu nên đối chiếu PDF) |
| `Tiêu chuẩn Việt Nam-TCVN 9401_2024.pdf` | TCVN 9401:2024 | 60 | **Đã OCR** → `TCVN-9401-2024.clean.txt` | **Sẵn sàng** (văn bản; bảng số liệu nên đối chiếu PDF) |
| `96 TCN 42-90_… trong nhà.pdf` | 96 TCN 42-90 | 55 | **Scan ảnh** | Chưa — cần OCR; phần lớn đã được TT 68 thay |
| `96 TCN 43-90_… ngoài trời.pdf` | 96 TCN 43-90 | 101 | **Scan ảnh** | Chưa — cần OCR; phần lớn đã được TT 68 thay |

File `.extract.txt` cạnh mỗi PDF = kết quả `pdf-parse` (chỉ hữu ích khi PDF có text layer sạch).

---

## Danh mục nội dung

### 1. Thông tư 68/2015/TT-BTNMT — **đã đọc được**
- **Tên:** Quy định kỹ thuật đo đạc trực tiếp địa hình phục vụ thành lập bản đồ địa hình và CSDL nền địa lý tỷ lệ **1:500, 1:1000, 1:2000, 1:5000**.
- **Ban hành:** 22/12/2015 (Công báo 29/01/2016).
- **Cấu trúc chính:**
  - Chương I — Phạm vi, đối tượng, thuật ngữ, quy định chung
  - Chương II — Hệ tọa độ/độ cao, mức độ thể hiện địa hình, lưới khống chế, độ chính xác
  - Chương III — Công nghệ đo lưới (cơ sở cấp 1–2, độ cao kỹ thuật, đo vẽ cấp 1–2; **GNSS tĩnh / động**)
  - Chương IV — Đo vẽ chi tiết
  - Chương V — Kiểm tra nghiệm thu, đóng gói giao nộp
  - Chương VI — Kiểm định / kiểm nghiệm thiết bị
  - Chương VII — Điều khoản thi hành
  - Phụ lục 1–3
- **Vai trò với bộ 96 TCN:** đây là quy định **hiện hành** thay thế phần lớn quy phạm đo vẽ BDĐH 1:500–1:5000 kiểu 96 TCN 42/43-90 trong phạm vi đo đạc trực tiếp địa hình.

### 2. TCVN 9398:2012 — **đã OCR + Word sạch**
- **Tên:** Công tác trắc địa trong xây dựng công trình — Yêu cầu chung.
- **File dùng:** `TCVN-9398-2012.clean.txt`; Word upload CSPL: **`TCVN-9398-2012.docx`**.
- **Script:** `node scripts/ocr_tcvn_tesseract.js "…pdf"` → `node scripts/clean_ocr_tcvn9398.js` → `node scripts/export_tcvn_clean_docx.js 9398`.
- **Lưu ý:** Không có bản **9398:2024**; tiêu chuẩn hiện hành vẫn là **9398:2012**.

### 3. TCVN 9401:2024 — **đã OCR + Word sạch**
- **Tên:** Kỹ thuật đo và xử lý số liệu **GNSS** trong trắc địa công trình.
- **Thay thế:** TCVN 9401:2012.
- **File dùng:** `TCVN-9401-2024.clean.txt`; Word: **`TCVN-9401-2024.docx`** (lề A4 kiểu TT 01/2011, Times New Roman; bảng 1/2/5 kẻ viền).
- **Script:** `node scripts/export_tcvn_clean_docx.js 9401` (hoặc `all` cho cả 9398+9401).
- **Phạm vi:** lưới khảo sát CT, lưới khống chế mặt bằng thi công, quan trắc chuyển dịch ngang, chuyển điểm thiết kế ra thực địa, đo vẽ BDĐH tỷ lệ lớn phục vụ thiết kế.
- **Lưu ý:** đoạn văn đọc tốt; **bảng / phụ lục số** OCR kém hơn — tra PDF khi cần số chính xác.

### 4. 96 TCN 42-90 / 43-90 — lịch sử, scan
- Quy phạm đo vẽ thành lập bản đồ địa hình tỷ lệ **1:500–1:5000** (trong nhà / ngoài trời).
- Dùng tham chiếu lịch sử hoặc câu hỏi cũ; khi ôn theo quy định mới ưu tiên **TT 68/2015** (+ TCVN GNSS 9401:2024 khi hỏi GNSS công trình).

---

## Sẵn sàng hỗ trợ ngay

1. **Toàn văn TT 68/2015** — `68_2015_TT-BTNMT(13437).extract.txt`
2. **Toàn văn TCVN 9398:2012 (OCR)** — `TCVN-9398-2012.clean.txt`
3. **Toàn văn TCVN 9401:2024 (OCR)** — `TCVN-9401-2024.clean.txt`
4. **Metadata** TCVN 9398:2012 (đã OCR)

## Cần bạn bổ sung (tuỳ chọn)

- OCR 96 TCN 42/43 nếu còn ôn câu cũ

---

## Sơ đồ lưới (PNG / SVG)

Thiết kế chung: **1920×1080** ngang, nền tối, cột trái (SỞ), hàng giãn dọc, nút phẳng, mũi tên nét liền (phát triển cấp) và nét đứt (đo vẽ → chi tiết). Mỗi sơ đồ có bản **PNG**, **SVG** và **`-4k.png`**.

| Sơ đồ | Nguồn | Palette | File | Script tái xuất |
|-------|-------|---------|------|-----------------|
| Hệ thống lưới tọa độ & độ cao | TT 68/2015 | Vàng / xanh slate | `so-do-luoi-tt68-2015.png` | `node scripts/export_so_do_luoi_tt68_png.js` |
| Lưới KS công trình | TCVN 9401 §6.2 | Indigo / hồng | `so-do-luoi-tcvn9401-2024.png` | `node scripts/export_so_do_luoi_tcvn9401_png.js` |
| Lưới khống chế MB thi công | TCVN 9401 §6.3 | Xanh lục / cyan | `so-do-luoi-tcvn9401-2024-thicong.png` | `node scripts/export_so_do_luoi_tcvn9401_63_64_png.js` |
| Lưới quan trắc CD ngang | TCVN 9401 §6.4 | Cam / đỏ / vàng / tím | `so-do-luoi-tcvn9401-2024-quantrac.png` | (cùng script 6.3) |

Word minh họa TT 68: `so-do-luoi-tt68-2015.docx`.

Tiếp theo có thể: soạn câu hỏi GNSS theo 9401, so sánh lưới TT 68 vs 9401. **Sơ đồ đã gắn UI** — xem `public/tcvn/`, `DdGridDiagrams`, HDSD `docs/hdsd/do-dac-on-tap.md`.
