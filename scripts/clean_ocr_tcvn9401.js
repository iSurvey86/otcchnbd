/**
 * Làm sạch OCR TCVN 9401:2024
 */
const fs = require("fs");
const path = require("path");

const rawPath = path.join(__dirname, "..", "docs", "tcvn", "TCVN-9401-2024.ocr.raw.txt");
const outPath = path.join(__dirname, "..", "docs", "tcvn", "TCVN-9401-2024.clean.txt");

let t = fs.readFileSync(rawPath, "utf8");

t = t.replace(/^===== TRANG \d+ \/ \d+ =====\s*/gm, "");
t = t.replace(/^TCVN 9401:2024\s*$/gm, "");
t = t.replace(/^TIEU CHUAN QU[OÓ]C GIA TCVN 9401:2024\s*$/gim, "");
t = t.replace(/\.{3,}/g, " … ");
t = t.replace(/[-=_]{5,}/g, " ");

const fixes = [
  [/SÓ LIỆU/g, "SỐ LIỆU"],
  [/sattelite/gi, "satellite"],
  [/tin hiệu/g, "tín hiệu"],
  [/có định/g, "cố định"],
  [/tiền hành/g, "tiến hành"],
  [/thé giới/g, "thế giới"],
  [/toa độ/g, "tọa độ"],
  [/Quốc té/g, "Quốc tế"],
  [/Bo lường/g, "Đo lường"],
  [/Chat lượng/g, "Chất lượng"],
  [/công bó/g, "công bố"],
  [/Yêu câu/g, "Yêu cầu"],
  [/chuyén dịch/g, "chuyển dịch"],
  [/Quang thời gian/g, "Khoảng thời gian"],
  [/sé đo/g, "sổ đo"],
  [/sé liệu/g, "số liệu"],
  [/tram máy/g, "trạm máy"],
  [/tram do/g, "trạm đo"],
  [/tat máy/g, "tắt máy"],
  [/sam chớp/g, "sấm chớp"],
  [/mắt số liệu/g, "mất số liệu"],
  [/Do đạc/g, "Đo đạc"],
  [/Do GNSS/g, "Đo GNSS"],
  [/do GNSS tinh/g, "đo GNSS tĩnh"],
  [/GNSS tinh/g, "GNSS tĩnh"],
  [/phục vy/g, "phục vụ"],
  [/đinh tâm/g, "định tâm"],
  [/6n định/g, "ổn định"],
  [/thóng kê/g, "thống kê"],
  [/dau mốc/g, "dấu mốc"],
  [/đau mốc/g, "dấu mốc"],
  [/bd sung/g, "bổ sung"],
  [/xentimet/g, "centimet"],
  [/khởi do/g, "khởi đo"],
  [/thiết ké/g, "thiết kế"],
  [/doi tâm/g, "đối tâm"],
  [/may thu/g, "máy thu"],
  [/độchính xác/g, "độ chính xác"],
  [/độchính/g, "độ chính"],
  [/Bang (\d+)/g, "Bảng $1"],
  [/Bo chiều cao/g, "Đo chiều cao"],
  [/bảo dam/g, "bảo đảm"],
  [/phục quan trắc/g, "phục vụ quan trắc"],
  [/Trước va sau/g, "Trước và sau"],
  [/chắn động/g, "chấn động"],
  [/Gôhg 146 Go’/g, "Công tác đo"],
  [/có\./g, "có."],
];

for (const [re, rep] of fixes) t = t.replace(re, rep);

t = t.replace(/(\S)-\n(\S)/g, "$1$2");
t = t.replace(/\n{3,}/g, "\n\n");
t = t
  .split("\n")
  .map((l) => l.replace(/[ \t]+$/, ""))
  .join("\n")
  .trim();

// Mục lục OCR gần như hỏng → thay bằng mục lục dựng lại
const cleanToc = `Mục lục (dựng lại từ nội dung OCR)

Lời nói đầu
1 Phạm vi áp dụng
2 Tài liệu viện dẫn
3 Thuật ngữ và định nghĩa
4 Từ viết tắt
5 Quy định chung
6 Thiết kế kỹ thuật lưới GNSS
7 Yêu cầu kỹ thuật đối với máy móc thiết bị
8 Công tác chuẩn bị đo GNSS
9 Công tác đo GNSS tĩnh
10 Công tác đo GNSS động
11 Ghi sổ đo ngoại nghiệp
12 Xử lý số liệu
13 Báo cáo kết quả đo
Phụ lục A (tham khảo) Quy cách và dấu mốc GNSS
Phụ lục B (tham khảo) Bảng điều độ đo GNSS (ca đo thiết kế)
Phụ lục C (tham khảo) Mẫu bảng thống kê số liệu đo GNSS
Phụ lục D (tham khảo) Kiểm định độ ổn định máy trên chiều dài chuẩn
Phụ lục E (tham khảo) Kiểm định độ ổn định tâm pha ăng-ten
Phụ lục F (tham khảo) Kiểm nghiệm và hiệu chỉnh đối tâm quang học
Phụ lục G (tham khảo) Yêu cầu và phương pháp đo độ cao ăng-ten
Phụ lục H (tham khảo) Kết quả thực nghiệm lưới đo vẽ cấp 1 (GNSS tĩnh)
Phụ lục I (tham khảo) Quy trình xử lý số liệu lưới GNSS quan trắc chuyển dịch ngang
Thư mục tài liệu tham khảo
`;

t = t.replace(
  /Mục lục[\s\S]*?(?=Lời nói đầu)/,
  cleanToc + "\n"
);

// Một số lỗi còn sót sau vòng 1
t = t
  .replace(/Đo lường Chat\s*\n?\s*lượng/g, "Đo lường Chất lượng")
  .replace(/Chat\s*\n\s*lượng/g, "Chất lượng")
  .replace(/tat cả/g, "tất cả")
  .replace(/Bo đồng bộ/g, "Đo đồng bộ")
  .replace(/Thời lượng do của/g, "Thời lượng đo của")
  .replace(/Công tac đo/g, "Công tác đo")
  .replace(/đặt có\ndefịnh/g, "đặt cố định")
  .replace(/đặt có định/g, "đặt cố định")
  .replace(/như do GNSS/g, "như đo GNSS")
  .replace(/ngoại ngQhigp/gi, "ngoại nghiệp");

const header = `# TCVN 9401:2024 — Kỹ thuật đo và xử lý số liệu GNSS trong trắc địa công trình

> Nguồn: OCR từ PDF scan \`docs/tcvn\` (Tesseract vie+eng, 200 DPI).
> Đã làm sạch lỗi OCR thường gặp; **bảng số liệu / phụ lục** vẫn có thể sai — đối chiếu PDF khi cần chính xác tuyệt đối.
> Thay thế TCVN 9401:2012. Công bố 2024.

---

`;

fs.writeFileSync(outPath, header + t + "\n", "utf8");
console.log("Wrote", outPath, fs.statSync(outPath).size, "bytes");
console.log("--- preview ---");
console.log((header + t).slice(0, 1600));
