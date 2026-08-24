# QUY CHẾ VẬN HÀNH — SINH CÂU HỎI THEO THÁNG

**Trạng thái:** Đã chốt — dùng làm chuẩn vận hành  
**Sản phẩm:** onthicchn.org  
**Múi giờ:** Việt Nam (GMT+7 / `Asia/Ho_Chi_Minh`)  
**Bản Word đồng bộ:** `docs/Quy-che-van-hanh-sinh-cau-hoi-thang.docx`  
**Tạo lại Word:** `node scripts/create-quy-che-sinh-cau-hoi-thang-docx.mjs`

Áp dụng cho mọi lĩnh vực: Đo đạc và Bản đồ, Xây dựng, Đấu thầu, và các phân hệ / KPI bổ sung sau này (cùng quy chế, khác khung số câu đề).

---

## 1. Mục đích

Mỗi tháng, mỗi lĩnh vực có một **pack câu hỏi** đủ để ôn và thi thử theo khung đề chính thức. Nguồn = kho **CSPL** (nghị định, thông tư, QCVN, TCVN…). AI sinh **draft** theo template cố định; **Admin duyệt** mới vào pack. Không tự publish câu chưa duyệt.

## 2. Nguyên tắc cứng

1. Pack tháng = **100% câu mới** so với toàn lịch sử đã công bố.
2. Cùng điều / cùng VB được nếu **góc hỏi khác**.
3. **Không bịa** điều khoản; mọi căn cứ phải gắn chunk CSPL `active`.
4. Mỗi câu đủ **giải thích 4 mục** (mẫu Đấu thầu).
5. Chỉ **Admin** upload CSPL và duyệt / publish.
6. Ưu tiên **đơn nguồn**; đa nguồn chỉ khi **AI đề xuất + Admin tick**.
7. Không đủ chuẩn hoặc quá hạn duyệt → **khóa thi thử**.
8. Đáp án **kiểm chứng được** trên CSPL — cấm câu “hiểu thế nào cũng đúng / trả lời thế nào cũng được”.

### 2.1. Kiểm chứng & chống mơ hồ

- Mỗi câu chỉ **một** đáp án đúng theo căn cứ đã gắn.
- Loại: cảm tính; hai phương án cùng đúng; từ mơ hồ không neo ngưỡng/điều; tình huống thiếu giả định.
- Ưu tiên: số liệu / định nghĩa đóng / thẩm quyền–trình tự–ngoại lệ rõ trong văn bản.

## 3. Khung đề thi (số câu mỗi lượt thi thử)

| Lĩnh vực | Số câu / đề | Ghi chú |
|----------|-------------|---------|
| Đo đạc và Bản đồ | 40 | 16 PL + 24 KN (khung hiện hành) |
| Xây dựng | 30 | 10 PL + 20 CM |
| Đấu thầu NVCM | 70 | Theo khung hiện hành |

Phần KN Đo đạc cũng lấy từ CSPL (NĐ, TT, TCVN, QCVN…).

## 4. Pack tháng & trộn đề

- **Tối thiểu pack** = số câu đề chuẩn; được sinh **nhiều hơn**.
- Ôn: dùng cả pack.
- Thi thử: mỗi lần = **đúng số câu đề**, **trộn lại**.
- Nếu pack > đề (vd. 40 câu / đề 30): qua nhiều lượt thi của **cùng user trong tháng**, ưu tiên câu chưa/ít ra để **phủ hết pack**, rồi trộn cân bằng.
- Pack = đúng số đề: mỗi lần dùng cả pack, chỉ xáo thứ tự.

## 5. Lịch tháng (GMT+7)

| Mốc | Việc |
|-----|------|
| Trước 01 (gợi ý T-10→T-2) | AI draft; Admin duyệt đủ (+ buffer) |
| **T-1** (trước 01 đúng 1 ngày) | Cảnh báo Admin: **popup** + Telegram/Zalo nếu chưa đủ approved |
| **01 00:00** | Publish pack tháng (chỉ approved, đủ gate) |
| **Quá 01 chưa duyệt** | **Khóa thi thử** — không publish draft |

## 6. Upload CSPL trên web (Admin)

Form đơn giản — Admin **không** tự tạo path:

1. Chọn lĩnh vực  
2. Chọn loại VB (NĐ / TT / QCVN / TCVN / …)  
3. Điền số hiệu + thông tin cơ bản  
4. Chọn file → Upload  

Hệ thống tự lưu Storage + ghi DB.  
**Không nhồi file lớn vào Git.**

Sau upload (màn khác): tách chunk → Admin duyệt chunk → mới dùng để sinh câu.

## 7. Template cố định (AI chỉ điền — không đổi khung mỗi tháng)

**META:** sector, period, stem_type, topic, sources[] (chunk_id + số hiệu + Điều/Khoản)

**Câu hỏi:** prompt + A/B/C/D + đáp án

**Giải thích (đúng thứ tự):**

1. Đáp án chính xác cho câu hỏi này là:  
2. Căn cứ:  
3. Phân tích:  
4. Đối chiếu với các phương án còn lại:  

**Checklist máy:** đủ 4 mục; cite resolve; không trùng lịch sử; đáp án khớp; định lượng → số/đơn vị có trong chunk; loại câu mơ hồ.

## 8. Góc hỏi (stem)

| Mã | Ý nghĩa |
|----|---------|
| định-nghĩa | Khái niệm / loại |
| phạm-vi | Đối tượng / phạm vi |
| trừ-ngoại | Ngoại lệ / không thuộc |
| so-sánh | Phân biệt A vs B |
| tình-huống | Tình huống ngắn |
| phương-án-sai | Chọn phương án / nhận định sai |
| thẩm-quyền / trình-tự | Ai quyết / thứ tự |
| **định-lượng** | Số, ngưỡng, thời hạn, bán kính, tỷ lệ, điểm… một giá trị kiểm chứng được |

### 8.1. Định lượng

- Đơn vị rõ; distractor cùng đơn vị, gần số đúng.  
- Căn cứ nêu đúng Điều/Khoản (hoặc mục QCVN/TCVN) chứa số.  
- Nếu VB chia theo trường hợp → đề phải nêu đủ điều kiện (một đáp án số duy nhất).  
- Ví dụ đạt chuẩn: bán kính hành lang bảo vệ mốc / trạm GNSS (50 m) — kiểm chứng trên CSPL.

## 9. Đơn nguồn / đa nguồn

- Mặc định **đơn nguồn**.  
- **Đa nguồn:** AI đề xuất → Admin tick.  
- Cấm ghép VB không liên quan.  
- Tháng không có VB mới vẫn sinh pack từ CSPL đang hiệu lực (vẫn 100% câu mới).

## 10. Gate mở pack / thi thử

Chỉ khi đủ đồng thời:

- Số câu ≥ min (= số câu đề)  
- Toàn bộ `approved`  
- 100% mới  
- Cite + explanation 4 mục OK  
- Kiểm chứng được (kể cả định lượng)  
- Đúng tỷ lệ PL/KN nếu khung có  

## 11. Supersede văn bản

VB mới thay VB cũ → cũ `superseded`; câu hết hiệu lực không vào pack mới. Lịch sử thi/ôn user giữ nguyên.

## 12. Vai trò

| Ai | Được | Không |
|----|------|--------|
| AI | Draft đúng template; đề xuất đa nguồn | Tự publish; bịa điều; đổi template |
| Admin | Upload/duyệt CSPL & câu; tick; publish 01 | Hạ chuẩn để “cho đủ số” |
| User | Ôn/thi pack đã publish | Upload CSPL; xem draft |

## 13. Rủi ro đã dự phòng (tóm tắt)

Repo phình → Storage+DB · Bịa điều → cite+duyệt · Trùng câu → 100% mới · Ghép sai VB → đơn nguồn + tick · Trễ duyệt → T-1 + khóa thi · Draft lộ → chỉ approved · Câu thừa không ra đề → phủ đều theo user · Sai giờ → GMT+7 · Chat lỗi → popup Admin bắt buộc · OCR sai → duyệt chunk · Câu mơ hồ → mục 2.1.

## 14. Ngoài phạm vi chốt (không đổi quy chế)

- Thứ tự pilot kỹ thuật từng lĩnh vực  
- Chi tiết bot Telegram/Zalo, UI từng màn  
- Stack DB/API/model AI cụ thể (thiết kế khi triển khai)

---

*Mọi tính năng sinh câu hỏi tháng / CSPL / pack / thi thử phải tuân thủ quy chế này. Khi mâu thuẫn với thói quen cũ, ưu tiên quy chế.*
