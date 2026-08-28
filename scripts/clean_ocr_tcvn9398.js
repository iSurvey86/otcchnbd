/**
 * Làm sạch OCR TCVN 9398:2012
 */
const fs = require('fs')
const path = require('path')

const rawPath = path.join(__dirname, '..', 'docs', 'tcvn', 'TCVN-9398-2012.ocr.raw.txt')
const outPath = path.join(__dirname, '..', 'docs', 'tcvn', 'TCVN-9398-2012.clean.txt')

let t = fs.readFileSync(rawPath, 'utf8')

t = t.replace(/^===== TRANG \d+ \/ \d+ =====\s*/gm, '')
t = t.replace(/^TCVN 9398:2012\s*$/gm, '')
t = t.replace(/^TIÊU CHUẢN QUÓC GIA TCVN 9398:2012\s*$/gim, '')
t = t.replace(/^TJCVN TIEUCHUAN QUOC GIA\s*$/gim, '')
t = t.replace(/\.{3,}/g, ' … ')
t = t.replace(/[-=_]{5,}/g, ' ')
t = t.replace(/n{4,}/gi, ' ')
t = t.replace(/\bE+\b/g, ' ')
t = t.replace(/^\s*\d+\s*$/gm, '')

const fixes = [
  [/TRAC PIA/gi, 'TRẮC ĐỊA'],
  [/TRAC DIA/gi, 'TRẮC ĐỊA'],
  [/CÔNG TAC TRẮC/g, 'CÔNG TÁC TRẮC'],
  [/YÊU CÀU/g, 'YÊU CẦU'],
  [/toa độ/gi, 'tọa độ'],
  [/Toa độ/g, 'Tọa độ'],
  [/dé /g, 'để '],
  [/Đồi /g, 'Đối với '],
  [/bd sung/gi, 'bổ sung'],
  [/công bồ/g, 'công bố'],
  [/Do lường/g, 'Đo lường'],
  [/thẳm định/g, 'thẩm định'],
  [/đề cương/g, 'đề cương'],
  [/tiền độ/g, 'tiến độ'],
  [/tiền hành/g, 'tiến hành'],
  [/bồ trí/g, 'bố trí'],
  [/củng /g, 'cùng '],
  [/dau dương/g, 'dấu dương'],
  [/mặt dat/gi, 'mặt đất'],
  [/có thé/g, 'có thể'],
  [/tỉ lệ/g, 'tỷ lệ'],
  [/ban đồ/gi, 'bản đồ'],
  [/đền /g, 'đến '],
  [/yếu tb/g, 'yếu tố'],
  [/mặt đắt/g, 'mặt đất'],
  [/thuỷ/g, 'thủy'],
  [/kĩ thuật/g, 'kỹ thuật'],
  [/Hệ thong/g, 'Hệ thống'],
  [/phan mềm/g, 'phần mềm'],
  [/tằng/g, 'tầng'],
  [/tang /g, 'tầng '],
  [/đơn vi /g, 'đơn vị '],
  [/ồn định/g, 'ổn định'],
  [/móc kiểm/g, 'mốc kiểm'],
  [/can được/g, 'căn được'],
  [/¢\)/g, 'c)'],
  [/NGRIBP/g, 'nghiệp'],
  [/GPS là/g, 'GPS là'],
  [/4S,/g, 'ΔS,'],
  [/4v /g, 'Δv '],
  [/Ay /g, 'Δy '],
  [/PRAM Vi/g, 'Phạm vi'],
  [/AD GUNG/g, 'áp dụng'],
  [/viện dẫn/g, 'viện dẫn'],
  [/dé tai/g, 'đề tài'],
  [/lan /g, 'lần '],
  [/lan sai/g, 'lần sai'],
  [/Bang (\d+)/g, 'Bảng $1'],
  [/Dieu (\d+)/gi, 'Điều $1'],
  [/Chuong (\d+)/gi, 'Chương $1'],
]

for (const [re, rep] of fixes) t = t.replace(re, rep)

t = t.replace(/(\S)-\n(\S)/g, '$1$2')
t = t.replace(/\n{3,}/g, '\n\n')
t = t
  .split('\n')
  .map((l) => l.replace(/[ \t]+$/, ''))
  .join('\n')
  .trim()

const cleanToc = `Mục lục (dựng lại từ nội dung OCR)

Lời nói đầu
1 Phạm vi áp dụng
2 Tài liệu viện dẫn
3 Ký hiệu dùng trong tiêu chuẩn
4 Quy định chung
5 Khảo sát trắc địa địa hình phục vụ thiết kế công trình
6 Lưới khống chế thi công
7 Công tác bố trí công trình
8 Kiểm tra kích thước hình học và đo vẽ hoàn công
9 Công tác đo lún, đo chuyển dịch nhà và công trình
10 Ghi chép lưu giữ hồ sơ
Phụ lục A (Tham khảo): Các sơ đồ lưới bố trí công trình trên mặt bằng xây dựng
Phụ lục B (Tham khảo): Dung sai cho phép về trắc địa khi lắp ghép các kết cấu bê tông cốt thép đúc sẵn
Phụ lục C (Tham khảo): Dung sai cho phép về trắc địa khi lắp ghép các kết cấu thép
Phụ lục D (Tham khảo): Một số máy toàn đạc điện tử thông dụng tại Việt Nam
Phụ lục E (Tham khảo): Phân cấp các máy thủy bình thông dụng ở Việt Nam
Thư mục tài liệu tham khảo
`

t = t.replace(/Mục lục[\s\S]*?(?=Lời nói đầu)/, `${cleanToc}\n`)

const header = `# TCVN 9398:2012 — Công tác trắc địa trong xây dựng công trình — Yêu cầu chung

> Nguồn: OCR từ PDF \`docs/tcvn/TCVN 9398_2012 … Yeu cau chung.pdf\` (Tesseract vie+eng, pdf-to-img scale 2.2).
> Đã làm sạch lỗi OCR thường gặp; **bảng số liệu / phụ lục** vẫn có thể sai — đối chiếu PDF khi cần chính xác tuyệt đối.
> **Lưu ý:** Hiện chỉ có bản **9398:2012** (còn hiệu lực); không có TCVN 9398:2024.

---

`

fs.writeFileSync(outPath, header + t + '\n', 'utf8')
console.log('Wrote', outPath, fs.statSync(outPath).size, 'bytes')
console.log('--- preview ---')
console.log((header + t).slice(0, 1800))
