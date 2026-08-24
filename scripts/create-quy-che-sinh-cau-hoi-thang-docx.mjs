/**
 * Quy chế vận hành sinh câu hỏi tháng — tài liệu Word.
 * Chạy: node scripts/create-quy-che-sinh-cau-hoi-thang-docx.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  Header,
  Footer,
  ShadingType,
} from 'docx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'docs')
const outPath = path.join(outDir, 'Quy-che-van-hanh-sinh-cau-hoi-thang.docx')

const copper = 'B57A3C'
const ink = '1F2937'
const muted = '6B5A45'
const soft = 'F8F1E7'
const line = 'D6C4A8'

function run(text, opts = {}) {
  const { bold = false, italics = false, size = 22, color = ink } = opts
  return new TextRun({
    text,
    bold,
    italics,
    size,
    color,
    font: 'Times New Roman',
  })
}

function p(text, opts = {}) {
  const {
    bold = false,
    size = 22,
    color = ink,
    align = AlignmentType.JUSTIFIED,
    spacingAfter = 140,
    spacingBefore = 0,
    italics = false,
  } = opts
  return new Paragraph({
    alignment: align,
    spacing: { after: spacingAfter, before: spacingBefore, line: 312 },
    children: [run(text, { bold, size, color, italics })],
  })
}

function rich(parts, opts = {}) {
  const {
    align = AlignmentType.JUSTIFIED,
    spacingAfter = 140,
    spacingBefore = 0,
  } = opts
  return new Paragraph({
    alignment: align,
    spacing: { after: spacingAfter, before: spacingBefore, line: 312 },
    children: parts.map((part) =>
      typeof part === 'string' ? run(part) : run(part.text, part),
    ),
  })
}

function bullet(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 90, line: 300 },
    indent: { left: 360 },
    children: [run(`•  ${text}`)],
  })
}

function numbered(n, text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 90, line: 300 },
    indent: { left: 360 },
    children: [run(`${n}.  ${text}`)],
  })
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: 280, after: 140 },
    children: [
      run(text, {
        bold: true,
        size: level === HeadingLevel.HEADING_1 ? 28 : 24,
        color: copper,
      }),
    ],
  })
}

function cell(text, opts = {}) {
  const { header = false, width = 2340 } = opts
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: header
      ? { type: ShadingType.CLEAR, fill: copper }
      : { type: ShadingType.CLEAR, fill: 'FFFFFF' },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: line },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: line },
      left: { style: BorderStyle.SINGLE, size: 4, color: line },
      right: { style: BorderStyle.SINGLE, size: 4, color: line },
    },
    children: [
      new Paragraph({
        spacing: { after: 60, before: 60 },
        children: [
          run(text, {
            bold: header,
            size: 18,
            color: header ? 'FFFFFF' : ink,
          }),
        ],
      }),
    ],
  })
}

function simpleTable(headers, rows, widths) {
  const w = widths ?? headers.map(() => Math.floor(9020 / headers.length))
  return new Table({
    width: { size: 9020, type: WidthType.DXA },
    columnWidths: w,
    rows: [
      new TableRow({
        children: headers.map((h, i) => cell(h, { header: true, width: w[i] })),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map((c, i) => cell(String(c), { width: w[i] })),
          }),
      ),
    ],
  })
}

function spacer(after = 120) {
  return new Paragraph({ spacing: { after }, children: [] })
}

const doc = new Document({
  styles: {
    default: {
      document: {
        styles: [
          {
            id: 'Normal',
            run: { font: 'Times New Roman', size: 22 },
          },
        ],
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 850, bottom: 850, left: 1000, right: 1000 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                run('onthicchn.org — Quy chế nội bộ', {
                  size: 16,
                  color: muted,
                  italics: true,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                run('Trang ', { size: 16, color: muted }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: 'Times New Roman',
                  size: 16,
                  color: muted,
                }),
                run(' / ', { size: 16, color: muted }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  font: 'Times New Roman',
                  size: 16,
                  color: muted,
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        p('QUY CHẾ VẬN HÀNH', {
          bold: true,
          size: 36,
          color: copper,
          align: AlignmentType.CENTER,
          spacingAfter: 80,
        }),
        p('SINH CÂU HỎI THEO THÁNG', {
          bold: true,
          size: 36,
          color: copper,
          align: AlignmentType.CENTER,
          spacingAfter: 200,
        }),
        p(
          'Áp dụng cho toàn bộ lĩnh vực trên website ôn thi chứng chỉ hành nghề (Đo đạc và Bản đồ, Xây dựng, Đấu thầu và các phân hệ / thẻ KPI bổ sung sau này).',
          { align: AlignmentType.CENTER, italics: true, color: muted, size: 20 },
        ),
        p(`Phiên bản ĐÃ CHỐT — chuẩn vận hành — ${new Date().toLocaleDateString('vi-VN')}`, {
          align: AlignmentType.CENTER,
          size: 18,
          color: muted,
          spacingAfter: 120,
        }),
        p(
          'Bản Markdown đồng bộ (ưu tiên cho agent/dev): docs/Quy-che-van-hanh-sinh-cau-hoi-thang.md',
          {
            align: AlignmentType.CENTER,
            size: 16,
            color: muted,
            italics: true,
            spacingAfter: 280,
          },
        ),

        heading('1. Mục đích'),
        p(
          'Mỗi tháng, mỗi lĩnh vực có một bộ câu hỏi (pack tháng) đủ để người dùng ôn tập và thi thử theo đúng khung đề thi chính thức của chuyên ngành đó. Nguồn gốc câu hỏi là kho cơ sở pháp lý (CSPL): nghị định, thông tư, QCVN, TCVN và các văn bản liên quan — do Admin đưa vào hệ thống qua form trên web.',
        ),
        p(
          'Hệ thống hỗ trợ sinh bản nháp (draft) bằng AI theo một mẫu cố định; Admin duyệt rồi mới đưa vào pack. Không tự động công bố câu chưa duyệt.',
        ),

        heading('2. Phạm vi áp dụng'),
        bullet('Đo đạc và Bản đồ'),
        bullet('Xây dựng (theo từng track / hạng khi có)'),
        bullet('Đấu thầu (NVCM và các nhóm nguồn pháp lý liên quan)'),
        bullet('Các lĩnh vực / thẻ KPI bổ sung sau này — cùng một quy chế, khác khung số câu đề'),
        p(
          'Quy chế này là quy chế vận hành chung. Thứ tự triển khai kỹ thuật từng lĩnh vực (pilot) có thể chọn sau, không làm thay đổi nội dung quy chế.',
          { italics: true, color: muted },
        ),

        heading('3. Định nghĩa nhanh'),
        simpleTable(
          ['Thuật ngữ', 'Ý nghĩa'],
          [
            [
              'CSPL',
              'Kho văn bản pháp lý / quy chuẩn (file gốc + bản ghi DB + đoạn Điều/Khoản đã tách).',
            ],
            [
              'Chunk',
              'Một đoạn văn bản đã tách (thường theo Điều/Khoản) đã được Admin duyệt để dùng làm căn cứ ra đề.',
            ],
            [
              'Pack tháng',
              'Bộ câu hỏi thuộc một lĩnh vực trong một tháng (YYYY-MM), chỉ gồm câu mới và đã duyệt.',
            ],
            [
              'Thi thử',
              'Mỗi lần làm bài rút đúng số câu theo khung đề chuyên ngành từ pack tháng đang mở.',
            ],
            [
              'Template',
              'Khung nội dung cố định cho mọi câu (meta + 4 đáp án + giải thích 4 mục). AI chỉ điền nội dung, không đổi khung.',
            ],
          ],
          [2200, 6820],
        ),
        spacer(),

        heading('4. Nguyên tắc cứng (không thỏa hiệp)'),
        numbered(1, 'Pack tháng bắt buộc 100% câu hỏi mới so với toàn bộ lịch sử đã công bố. Không tái sử dụng nguyên câu cũ.'),
        numbered(
          2,
          'Được hỏi lại cùng điều luật / cùng văn bản nếu góc hỏi khác (định nghĩa, ngoại lệ, so sánh, tình huống, phương án nào sai…).',
        ),
        numbered(
          3,
          'Tuyệt đối không bịa điều khoản, số hiệu hoặc nội dung không có trong CSPL đã active. Mọi căn cứ phải gắn được với chunk thật.',
        ),
        numbered(
          4,
          'Mỗi câu phải có giải thích đủ 4 mục theo mẫu Đấu thầu (xem mục 9).',
        ),
        numbered(5, 'Chỉ Admin được upload CSPL và duyệt / công bố câu hỏi, pack tháng.'),
        numbered(
          6,
          'Ưu tiên câu đơn nguồn (một văn bản / một căn cứ chính). Câu đa nguồn chỉ khi AI đề xuất và Admin tick xác nhận.',
        ),
        numbered(
          7,
          'Không đủ câu đạt chuẩn hoặc quá hạn duyệt → không mở thi thử tháng đó (khóa thi thử).',
        ),
        numbered(
          8,
          'Đáp án phải kiểm chứng được trên văn bản / số liệu trong CSPL. Cấm câu “hiểu thế nào cũng đúng”, “trả lời thế nào cũng được”, hoặc nhiều phương án cùng đúng nếu không ghi rõ “chọn phương án đúng nhất / đầy đủ nhất” và căn cứ vẫn chỉ ra đúng một đáp án.',
        ),

        heading('4.1. Quy tắc kiểm chứng & chống mơ hồ', HeadingLevel.HEADING_2),
        p(
          'Mỗi câu trắc nghiệm chỉ được tồn tại một đáp án đúng theo căn cứ đã gắn. Người duyệt và máy kiểm phải trả lời được: “Mở đúng đoạn CSPL này, đối chiếu, kết luận A/B/C/D — không tranh cãi.”',
        ),
        p('Loại câu cần loại bỏ hoặc viết lại:', { bold: true, spacingBefore: 60 }),
        bullet('Câu ý kiến / cảm tính (“nên”, “hợp lý”, “thường thì”) không neo vào điều khoản hoặc chỉ số cụ thể.'),
        bullet('Câu có hai phương án cùng đúng theo cùng một căn cứ (trừ khi đề bài yêu cầu rõ dạng “đầy đủ nhất” và chỉ một phương án bao quát đúng).'),
        bullet('Câu dùng từ mơ hồ không có định nghĩa trong văn bản (“đáng kể”, “phù hợp”, “kịp thời”) khi không gắn ngưỡng/điều kiện trong CSPL.'),
        bullet('Câu tình huống thiếu giả định khiến kết luận đảo chiều tùy cách hiểu.'),
        p('Ưu tiên các câu neo được vào:', { bold: true, spacingBefore: 60 }),
        bullet('Số liệu, ngưỡng, thời hạn, bán kính, tỷ lệ, điểm đạt, số ngày… (định lượng).'),
        bullet('Định nghĩa / liệt kê đóng trong điều khoản (có / không thuộc).'),
        bullet('Thẩm quyền, trình tự, ngoại lệ được nêu rõ trong văn bản.'),
        p(
          'Ví dụ định lượng đạt chuẩn (Đo đạc): “Hành lang bảo vệ mốc đo đạc trong mạng lưới tọa độ quốc gia… bán kính bao nhiêu mét tính từ tâm mốc?” — các phương án 40 / 50 / 60 / 70 m; đáp án đúng 50 m, kiểm chứng trực tiếp trên nghị định/thông tư tương ứng trong CSPL. Tương tự với hành lang bảo vệ trạm định vị vệ tinh (bán kính từ tâm ăng-ten).',
          { italics: true },
        ),
        p(
          'Mỗi lần người dùng nhấn Thi thử, hệ thống rút đúng số câu theo khung chuyên ngành (không lấy hết pack nếu pack lớn hơn). Ví dụ khung đang dùng trên hệ thống:',
        ),
        simpleTable(
          ['Lĩnh vực', 'Số câu / đề', 'Ghi chú khung'],
          [
            ['Đo đạc và Bản đồ', '40', '16 pháp luật + 24 kinh nghiệm (khung chuẩn hiện hành)'],
            ['Xây dựng', '30', '10 pháp luật + 20 chuyên môn (theo cấu hình đề)'],
            ['Đấu thầu NVCM', '70', 'Theo khung NVCM hiện hành'],
          ],
          [2800, 1800, 4420],
        ),
        spacer(100),
        p(
          'Phần kinh nghiệm Đo đạc cũng lấy căn cứ từ CSPL (nghị định, thông tư, TCVN, QCVN…), không tách thành “chỉ kinh nghiệm miệng không văn bản”.',
        ),

        heading('6. Pack tháng — số lượng tối thiểu và ôn / thi'),
        bullet('Pack tháng tối thiểu = đúng số câu đề tiêu chuẩn của lĩnh vực đó.'),
        bullet(
          'Được sinh nhiều hơn mức tối thiểu (ví dụ đề 30 câu, pack tháng có 40 câu) để ôn phong phú hơn.',
        ),
        bullet(
          'Ôn tập: người dùng có thể làm trên toàn bộ câu trong pack.',
        ),
        bullet(
          'Thi thử: mỗi lần nhấn vào là trộn đề lại; số câu làm = số câu đề chuẩn.',
        ),
        heading('6.1. Khi pack lớn hơn số câu đề — phủ đều mọi câu', HeadingLevel.HEADING_2),
        p(
          'Ví dụ: đề chuẩn 30 câu, tháng đó pack có 40 câu. Một lượt thi chỉ làm 30 câu, nên không thể “dùng hết 40” trong một lần. Yêu cầu nghiệp vụ: qua nhiều lần thi thử của cùng một người dùng trong tháng, thuật toán ưu tiên các câu chưa / ít được chọn, để cả 40 câu đều được sử dụng; sau khi đã phủ đủ thì tiếp tục trộn cân bằng, tránh câu nào bị bỏ quên lâu.',
        ),
        p(
          'Nếu pack đúng bằng số câu đề (ví dụ 30/30): mỗi lần thi dùng cả pack, chỉ xáo thứ tự câu.',
          { italics: true },
        ),

        heading('7. Lịch tháng (múi giờ Việt Nam GMT+7)'),
        simpleTable(
          ['Mốc', 'Việc cần làm'],
          [
            [
              'Trước ngày 01 (gợi ý T-10 → T-2)',
              'AI sinh draft theo template; Admin duyệt / sửa / loại cho đủ số câu đạt chuẩn (+ buffer nếu cần).',
            ],
            [
              'Trước 01 đúng 1 ngày (T-1)',
              'Nếu chưa đủ câu approved: cảnh báo Admin (popup nổi trên web Admin) và/hoặc tin nhắn Telegram / Zalo để giục tiến độ.',
            ],
            [
              'Ngày 01, 00:00 (GMT+7)',
              'Publish pack tháng mới (chỉ câu đã duyệt, đủ gate). Người dùng ôn / thi trên pack đó.',
            ],
            [
              'Quá ngày 01 mà chưa duyệt xong',
              'Khóa thi thử tháng đó. Không tự publish draft chưa duyệt.',
            ],
          ],
          [2800, 6220],
        ),
        spacer(),

        heading('8. Kho CSPL và luồng upload trên web (dành cho Admin)'),
        heading('8.1. Nguyên tắc lưu trữ', HeadingLevel.HEADING_2),
        bullet(
          'Không nhồi file văn bản lớn vào mã nguồn Git (tránh phình repo). File gốc lưu kho riêng (Storage); thông tin phân loại và trạng thái lưu DB.',
        ),
        bullet(
          'Admin không phải tự tạo thư mục hay đặt path thủ công. Form trên web phân loại → hệ thống tự lưu đúng chỗ.',
        ),
        heading('8.2. Luồng upload dễ dùng (đã chốt)', HeadingLevel.HEADING_2),
        p('Trên trang Admin có một luồng upload. Mỗi lần thêm văn bản mới, Admin làm lần lượt:'),
        numbered(1, 'Chọn lĩnh vực (Đo đạc và Bản đồ / Xây dựng / Đấu thầu / …).'),
        numbered(2, 'Chọn loại văn bản (Nghị định / Thông tư / QCVN / TCVN / …).'),
        numbered(3, 'Điền số hiệu và thông tin cơ bản (tên, ngày ban hành / hiệu lực nếu có).'),
        numbered(4, 'Chọn file (PDF/DOCX) → Upload.'),
        p(
          'Hệ thống tự đưa file lên kho và ghi bản ghi DB đúng phân loại. Đây là bước đưa văn bản vào hệ thống — đơn giản nhất với Admin.',
        ),
        heading('8.3. Các bước sau upload (tóm tắt, không làm rối lúc upload)', HeadingLevel.HEADING_2),
        p(
          'Sau khi file đã vào hệ thống, để dùng được cho ra đề còn các bước xử lý nội dung (có thể làm ở màn hình khác, không gộp hết vào một lần bấm upload):',
        ),
        numbered(1, 'Hệ thống tách nội dung thành các đoạn (chunk) theo Điều/Khoản khi khả thi.'),
        numbered(2, 'Admin duyệt / chỉnh chunk (bắt buộc trước khi chunk được coi là active).'),
        numbered(3, 'Khi soạn pack tháng: AI sinh draft từ chunk active → Admin duyệt câu.'),
        numbered(4, 'Đủ số câu đạt chuẩn → sẵn sàng publish ngày 01.'),
        p(
          'Gợi ý tổ chức phía máy (Admin không cần nhớ path): theo lĩnh vực → loại VB → năm → số hiệu chuẩn hóa → file gốc. DB mới là nơi tìm kiếm theo số hiệu, lĩnh vực, trạng thái.',
          { italics: true, color: muted, size: 20 },
        ),

        heading('9. Template câu hỏi (cố định — AI chỉ điền)'),
        p(
          'Chỉ có một mẫu thống nhất cho mọi lĩnh vực. Không sinh template mới mỗi tháng. Khi cần đổi mẫu, đổi một lần thành phiên bản template mới cho cả hệ thống.',
        ),
        p('Cấu trúc bắt buộc:', { bold: true, spacingBefore: 80 }),
        bullet('META: lĩnh vực, tháng, góc hỏi (stem_type), chuyên đề / phân mục, danh sách nguồn (1 hoặc nhiều chunk_id + số hiệu + Điều/Khoản).'),
        bullet('CÂU HỎI: đề bài + bốn phương án A/B/C/D + đáp án đúng.'),
        bullet('GIẢI THÍCH — đúng 4 mục như form Đấu thầu:'),
        new Paragraph({
          spacing: { after: 60, line: 300 },
          indent: { left: 720 },
          children: [run('1. Đáp án chính xác cho câu hỏi này là:', { bold: true })],
        }),
        new Paragraph({
          spacing: { after: 60, line: 300 },
          indent: { left: 720 },
          children: [run('2. Căn cứ:', { bold: true })],
        }),
        new Paragraph({
          spacing: { after: 60, line: 300 },
          indent: { left: 720 },
          children: [run('3. Phân tích:', { bold: true })],
        }),
        new Paragraph({
          spacing: { after: 120, line: 300 },
          indent: { left: 720 },
          children: [run('4. Đối chiếu với các phương án còn lại:', { bold: true })],
        }),
        bullet(
          'Kiểm tra máy trước khi đưa vào hàng chờ duyệt: đủ 4 mục; mọi căn cứ resolve được trong CSPL; không trùng lịch sử; đáp án khớp phương án; với câu định lượng — số/đơn vị trong đáp án đúng xuất hiện trong chunk căn cứ; loại câu mơ hồ / nhiều đáp án cùng đúng.',
        ),

        heading('10. Góc hỏi (stem) — cùng điều, khác cách hỏi'),
        p('Các góc hỏi được phép (không trùng y hệt câu cũ), gồm cả góc định lượng:'),
        simpleTable(
          ['Mã góc', 'Ý nghĩa'],
          [
            ['định-nghĩa', 'Khái niệm / thuộc loại gì'],
            ['phạm-vi', 'Đối tượng / phạm vi áp dụng'],
            ['trừ-ngoại', 'Ngoại lệ / trường hợp không thuộc'],
            ['so-sánh', 'Phân biệt A với B'],
            ['tình-huống', 'Tình huống ngắn, áp dụng điều khoản'],
            ['phương-án-sai', 'Chọn nhận định / phương án không đúng'],
            ['thẩm-quyền / trình-tự', 'Ai quyết định / thứ tự thực hiện'],
            [
              'định-lượng',
              'Hỏi số, ngưỡng, thời hạn, bán kính, tỷ lệ, điểm… có thể đối chiếu đúng một giá trị (hoặc một khoảng đã quy định) trên CSPL',
            ],
          ],
          [2400, 6620],
        ),
        spacer(80),
        heading('10.1. Góc định lượng — yêu cầu bổ sung', HeadingLevel.HEADING_2),
        p(
          'Câu định lượng là một trong những dạng dễ kiểm chứng nhất, cần được ưu tiên khi văn bản có số liệu. Quy tắc riêng:',
        ),
        bullet('Đơn vị đo phải rõ (m, ngày, %, điểm…) và khớp văn bản.'),
        bullet(
          'Ba phương án nhiễu nên cùng đơn vị, gần giá trị thật (cùng “họ số”) để kiểm tra nhớ đúng số, không đánh đố bằng đơn vị lệch.',
        ),
        bullet(
          'Căn cứ trong giải thích phải nêu đúng Điều/Khoản (hoặc mục QCVN/TCVN) chứa con số đó.',
        ),
        bullet(
          'Nếu văn bản quy định theo trường hợp (A = 50 m, B = 100 m) thì đề bài phải nêu đủ điều kiện trường hợp — không hỏi chung chung khiến cả hai số đều “đúng”.',
        ),
        p(
          'Góc định lượng có thể kết hợp nhẹ với tình huống (“Theo quy định về…, bán kính hành lang là?”) nhưng vẫn chỉ có một đáp án số kiểm chứng được.',
          { italics: true },
        ),

        heading('11. Đơn nguồn và đa nguồn (phối hợp văn bản)'),
        p(
          'Kho CSPL có nhiều nghị định, thông tư, quy chuẩn… Có thể phối hợp nhiều tài liệu trong một câu, nhưng có luật:',
        ),
        bullet('Mặc định: câu đơn nguồn — một căn cứ chính, dễ duyệt, ít rủi ro.'),
        bullet(
          'Đa nguồn: AI có thể đề xuất ghép các đoạn liên quan (ví dụ nghị định + thông tư hướng dẫn; thông tư + QCVN). Admin tick xác nhận mới dùng.',
        ),
        bullet(
          'Cấm ghép hai văn bản không liên quan hoặc suy diễn quan hệ không có trong kho / chưa được tick.',
        ),
        p('Ví dụ dễ hiểu:', { bold: true, spacingBefore: 80 }),
        bullet(
          'Đơn nguồn: hỏi đúng/sai về một khoản trong một thông tư đã có trong kho.',
        ),
        bullet(
          'Đa nguồn (sau khi tick): tình huống “đủ điều kiện theo nghị định nhưng thiếu hồ sơ theo thông tư” — căn cứ ghi cả hai điều thật.',
        ),
        p(
          'Tháng không có văn bản mới vẫn phải sinh pack tháng từ toàn bộ CSPL đang hiệu lực (đơn nguồn và/hoặc đa nguồn đã được phép), vẫn 100% câu mới, không bịa điều.',
        ),

        heading('12. Vai trò AI và Admin'),
        simpleTable(
          ['Vai trò', 'Được làm', 'Không được làm'],
          [
            [
              'AI',
              'Sinh draft đúng template từ chunk active; đề xuất quan hệ / câu đa nguồn.',
              'Tự publish; bịa điều khoản; đổi khung template.',
            ],
            [
              'Admin',
              'Upload CSPL có phân loại; duyệt chunk; duyệt/sửa/loại câu; tick đa nguồn; publish ngày 01.',
              'Bỏ qua kiểm tra căn cứ để “cho đủ số”.',
            ],
            [
              'Người dùng',
              'Ôn và thi thử trên pack đã publish.',
              'Upload CSPL; xem draft chưa duyệt.',
            ],
          ],
          [1600, 3710, 3710],
        ),
        spacer(),

        heading('13. Điều kiện mở pack / mở thi thử (gate)'),
        p('Pack chỉ publish / thi thử chỉ mở khi đồng thời:'),
        bullet('Đủ số câu tối thiểu (= số câu đề chuẩn lĩnh vực).'),
        bullet('Mọi câu trong pack ở trạng thái đã duyệt (approved).'),
        bullet('100% câu mới so với lịch sử công bố.'),
        bullet('Mọi căn cứ gắn chunk CSPL active; giải thích đủ 4 mục.'),
        bullet('Đáp án kiểm chứng được (mục 4.1); câu định lượng neo đúng số/đơn vị trên căn cứ.'),
        bullet('Đúng tỷ lệ phân mục nếu khung đề có (ví dụ pháp luật / kinh nghiệm).'),
        p(
          'Thiếu bất kỳ điều kiện nào sau ngày 01 → khóa thi thử tháng đó; Admin nhận cảnh báo từ mốc T-1.',
        ),

        heading('14. Quản lý thay thế văn bản'),
        bullet(
          'Khi upload văn bản mới thay thế văn bản cũ: đánh dấu văn bản cũ superseded; câu gắn căn cứ đã hết hiệu lực không đưa vào pack tháng mới.',
        ),
        bullet(
          'Lịch sử thi / ôn của người dùng trước đó vẫn giữ nguyên bản ghi (không xóa lịch sử vì văn bản đổi).',
        ),

        heading('15. Dự phòng rủi ro đã thống nhất'),
        simpleTable(
          ['Rủi ro', 'Cách xử lý trong quy chế'],
          [
            ['Repo / Git phình vì file văn bản', 'CSPL lưu Storage + DB; upload qua form Admin'],
            ['AI bịa điều khoản', 'Chỉ cite chunk thật; validate; Admin duyệt'],
            ['Trùng câu giữa các tháng', 'Pack 100% mới; cùng điều nhưng góc hỏi khác'],
            ['Ghép văn bản không liên quan', 'Ưu tiên đơn nguồn; đa nguồn cần tick'],
            ['Duyệt trễ / quên', 'Cảnh báo T-1 (popup + Telegram/Zalo); khóa thi thử sau 01'],
            ['Publish nhầm draft', 'Chỉ approved mới vào pack'],
            ['Câu “thừa” trong pack không bao giờ ra đề', 'Thuật toán phủ đều theo user + tháng'],
            ['Sai múi giờ', 'Mọi mốc theo GMT+7'],
            ['Telegram/Zalo lỗi', 'Popup Admin vẫn bắt buộc'],
            ['Câu mơ hồ / nhiều cách hiểu đều đúng', 'Áp dụng mục 4.1; loại hoặc viết lại trước khi duyệt'],
            ['Câu định lượng thiếu điều kiện trường hợp', 'Đề bài phải nêu đủ giả định; một đáp án số duy nhất'],
            ['OCR / tách chunk sai', 'Bắt buộc duyệt chunk trước khi active'],
          ],
          [3200, 5820],
        ),
        spacer(),

        heading('16. Những việc cố ý để sau (không chặn quy chế)'),
        bullet('Thứ tự triển khai kỹ thuật từng lĩnh vực (pilot) — chọn khi bắt tay code.'),
        bullet('Chi tiết cấu hình bot Telegram/Zalo, giao diện từng màn Admin.'),
        bullet('Công nghệ cụ thể (bảng DB, API, nhà cung cấp AI) — thuộc giai kế kỹ thuật khi XÁC NHẬN triển khai.'),

        heading('17. Tóm tắt một dòng cho Admin'),
        p(
          'Mỗi tháng: đảm bảo CSPL đã sẵn → AI draft theo mẫu cố định (ưu tiên câu kiểm chứng được, gồm định lượng khi văn bản có số) → duyệt đủ câu → ngày 01 mở pack; nếu trễ thì bị nhắc trước 1 ngày và khóa thi thử đến khi đạt chuẩn. Upload văn bản mới: vào web Admin, chọn lĩnh vực + loại, điền số hiệu, chọn file — hệ thống lo phần còn lại.',
          { bold: true },
        ),

        spacer(200),
        p('— Hết quy chế —', {
          align: AlignmentType.CENTER,
          italics: true,
          color: muted,
          spacingAfter: 80,
        }),
        p(
          'Tài liệu này ghi nhận các nội dung đã bàn và chốt giữa chủ sản phẩm và tư vấn kiến trúc cho ý tưởng “sinh câu hỏi tháng” trên onthicchn.org.',
          {
            align: AlignmentType.CENTER,
            size: 18,
            color: muted,
            italics: true,
          },
        ),
      ],
    },
  ],
})

fs.mkdirSync(outDir, { recursive: true })
const buffer = await Packer.toBuffer(doc)
fs.writeFileSync(outPath, buffer)
console.log('Wrote', outPath)
