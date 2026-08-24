/**
 * Xuất TCVN 9401:2024 → Word theo thể thức gần bản gốc TCVN
 * - Lề kiểu TT 01/2011 (A4): trái 3 cm, phải 2 cm, trên/dưới 2,5 cm
 * - Times New Roman 13 đậm tiêu đề; bảng kẻ đủ viền
 * - Chèn bảng kỹ thuật đã biên tập (OCR bảng gốc kém)
 */
const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  BorderStyle,
  WidthType,
  VerticalAlign,
  PageBreak,
  ShadingType,
} = require("docx");

const SRC = path.join(__dirname, "..", "docs", "tcvn", "TCVN-9401-2024.clean.txt");
const OUT = path.join(__dirname, "..", "docs", "tcvn", "TCVN-9401-2024.docx");

const mm = (n) => Math.round((n / 25.4) * 1440); // twips
const PAGE_W = mm(210);
const MARGIN = { top: mm(25), bottom: mm(25), left: mm(30), right: mm(20) };
const CONTENT_W = PAGE_W - MARGIN.left - MARGIN.right;

const thin = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: thin, bottom: thin, left: thin, right: thin };
const noBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function p(text, opts = {}) {
  const {
    bold = false,
    italic = false,
    size = 26, // 13pt
    align = AlignmentType.BOTH,
    before = 0,
    after = 120,
    indent = 0,
    color,
    heading,
  } = opts;
  return new Paragraph({
    heading,
    alignment: align,
    spacing: { before, after, line: 360 }, // 1.5 lines ~ TCVN đọc thoáng
    indent: indent ? { firstLine: indent } : undefined,
    children: [
      new TextRun({
        text,
        bold,
        italics: italic,
        size,
        font: "Times New Roman",
        color,
      }),
    ],
  });
}

function cell(text, opts = {}) {
  const {
    bold = false,
    align = AlignmentType.CENTER,
    width,
    fill,
    size = 20,
  } = opts;
  return new TableCell({
    borders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
    children: [
      new Paragraph({
        alignment: align,
        spacing: { before: 40, after: 40, line: 276 },
        children: [
          new TextRun({
            text: String(text ?? ""),
            bold,
            size,
            font: "Times New Roman",
          }),
        ],
      }),
    ],
  });
}

function makeTable(headers, rows, colWidths) {
  const widths =
    colWidths ||
    headers.map(() => Math.floor(CONTENT_W / headers.length));
  const head = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      cell(h, { bold: true, width: widths[i], fill: "E8EEF7", align: AlignmentType.CENTER })
    ),
  });
  const body = rows.map(
    (r) =>
      new TableRow({
        children: r.map((c, i) =>
          cell(c, {
            width: widths[i],
            align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
            bold: false,
          })
        ),
      })
  );
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [head, ...body],
  });
}

function tableCaption(title) {
  return p(title, {
    bold: true,
    align: AlignmentType.CENTER,
    before: 200,
    after: 80,
    size: 24,
  });
}

function tableNote(text) {
  return p(text, { italic: true, size: 18, after: 160, color: "475569", align: AlignmentType.LEFT });
}

/** Bảng kỹ thuật đã biên tập (đối chiếu OCR + tham số chuẩn) */
const TABLES = {
  "Bảng 1": {
    title: "Bảng 1 — Tham số hình học cơ bản của Ellipsoid toàn cầu (Ellipsoid WGS-84)",
    headers: ["Tham số hình học", "Giá trị"],
    widths: [Math.floor(CONTENT_W * 0.62), Math.floor(CONTENT_W * 0.38)],
    rows: [
      ["1. Bán trục lớn a (m)", "6 378 137"],
      ["2. Bán trục nhỏ b (m)", "6 356 752,314 2"],
      ["3. Độ dẹt f", "1/298,257 223 563"],
      ["4. Bình phương độ lệch tâm thứ nhất e²", "0,006 694 379 990 13"],
      ["5. Bình phương độ lệch tâm thứ hai e′²", "0,006 739 496 742 227"],
    ],
  },
  "Bảng 2": {
    title:
      "Bảng 2 — Yêu cầu kỹ thuật chủ yếu của lưới khảo sát công trình thành lập bằng công nghệ GNSS tĩnh",
    headers: [
      "Chỉ tiêu kỹ thuật",
      "Cơ sở cấp 1",
      "Cơ sở cấp 2",
      "Đo vẽ cấp 1",
      "Đo vẽ cấp 2",
    ],
    widths: [mm(48), mm(28), mm(28), mm(28), mm(28)],
    rows: [
      [
        "1. Khoảng cách giữa các điểm lưới, km",
        "1 ÷ 5",
        "Tăng dày điểm KC",
        "Tăng dày điểm KC",
        "Tăng dày điểm KC",
      ],
      ["2. Sai số trung phương vị trí điểm, m", "0,02", "0,03", "—", "—"],
      ["3. Sai số trung phương độ cao, m", "0,03", "0,03", "—", "—"],
      [
        "4. Sai số trung phương tương đối cạnh yếu nhất",
        "1/100 000",
        "1/20 000",
        "1/10 000",
        "1/5 000",
      ],
      ["5. Giá trị trung bình số lần đo lặp tại các điểm", "≥ 1,6", "≥ 1,6", "≥ 1,6", "≥ 1,6"],
      ["6. Số lượng cạnh trong vòng đo độc lập / tuyến phù hợp", "≤ 10", "≤ 10", "—", "—"],
      [
        "7. Số điểm khống chế tọa độ tối thiểu",
        "03 điểm gốc tọa độ quốc gia",
        "03 điểm gốc lưới CS cấp 1 trở lên",
        "03 điểm gốc lưới CS cấp 2 trở lên",
        "03 điểm gốc lưới đo vẽ cấp 1 trở lên",
      ],
      [
        "8. Số điểm khống chế độ cao tối thiểu",
        "03 điểm gốc độ cao hạng IV trở lên",
        "03 điểm gốc độ cao hạng IV trở lên",
        "02 điểm độ cao kỹ thuật trở lên",
        "02 điểm gốc thuộc lưới đo vẽ cấp 1 trở lên",
      ],
    ],
    note: "a) Lưới có số điểm mới ≤ 3 được phép dùng 02 điểm gốc tọa độ hạng cao. Giá trị biên tập từ OCR — đối chiếu PDF khi cần.",
  },
  "Bảng 5": {
    title: "Bảng 5 — Lựa chọn máy thu GNSS trong đo GNSS tĩnh và tĩnh nhanh",
    headers: ["Dạng lưới khống chế", "Loại máy thu", "Số lượng máy thu"],
    widths: [Math.floor(CONTENT_W * 0.34), Math.floor(CONTENT_W * 0.48), Math.floor(CONTENT_W * 0.18)],
    rows: [
      [
        "1. Lưới khảo sát công trình",
        "Thu Code + Phase; 1 hoặc đa tần số; sai số cạnh ≤ (10 mm + 1 mm×D)",
        "CS cấp 1–2; đo vẽ cấp 1–2 theo thiết kế",
      ],
      [
        "2. Lưới khống chế mặt bằng phục vụ thi công",
        "Thu Code + Phase; 1 hoặc đa tần số; sai số cạnh ≤ (5 mm + 1 mm×D)",
        "Theo thiết kế",
      ],
      [
        "3. Lưới quan trắc chuyển dịch ngang — độ chính xác cấp 1 và 2",
        "Thu Code + Phase; 2 hoặc đa tần số; sai số cạnh ≤ (3 mm + 1 mm×D)",
        "≥ 3",
      ],
      [
        "3. Lưới quan trắc chuyển dịch ngang — độ chính xác cấp 3 và 4",
        "Thu Code + Phase; 1 hoặc đa tần số; sai số cạnh ≤ (5 mm + 1 mm×D)",
        "Theo thiết kế",
      ],
    ],
    note: "D là chiều dài cạnh đo tính bằng kilômét (km).",
  },
};

function stripMarkdownHeader(text) {
  const parts = text.split(/\n---\n/);
  if (parts.length > 1 && text.trimStart().startsWith("#")) {
    return parts.slice(1).join("\n---\n").trim();
  }
  return text.trim();
}

function cleanLine(s) {
  return s
    .replace(/^§\s*/, "5 ")
    .replace(/\bLap /g, "Lập ")
    .replace(/\bChon /g, "Chọn ")
    .replace(/\bChuan /g, "Chuẩn ")
    .replace(/\bBao cáo/g, "Báo cáo")
    .replace(/\bHang số/g, "Hằng số")
    .replace(/\btoa độ/gi, "tọa độ")
    .replace(/\bdạng dữ liệu/g, "dạng dữ liệu")
    .replace(/\bkhuôn dang/g, "khuôn dạng")
    .replace(/\bDo động/g, "Đo động")
    .replace(/\bTram tham/g, "Trạm tham")
    .replace(/\bdn định/g, "ổn định")
    .replace(/\bcắp /g, "cấp ")
    .replace(/\bkiên có/g, "kiên cố")
    .replace(/\bdam bảo/g, "đảm bảo")
    .replace(/\byêu cau/g, "yêu cầu")
    .replace(/\bda tan số/g, "đa tần số")
    .replace(/\btrị do /g, "trị đo ")
    .replace(/\bSai sô/g, "Sai số")
    .replace(/\bdé /g, "để ")
    .replace(/\bthé /g, "thế ")
    .replace(/\b4m /g, "ẩm ")
    .replace(/\bmắt điện/g, "mất điện")
    .replace(/\btrục trac/g, "trục trặc")
    .replace(/\bcó thé/g, "có thể")
    .replace(/\blich đo/g, "lịch đo")
    .replace(/\bsé do/g, "sổ đo")
    .replace(/\bbè mặt/g, "bề mặt")
    .replace(/\bNghiêm cắm/g, "Nghiêm cấm")
    .replace(/\bphim bắm/g, "phím bấm")
    .replace(/[–—~_]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isGarbageTableLine(line) {
  if (/^[|\-_=~.`'*\s]+$/.test(line)) return true;
  if (/^(ee |TT\b|Sam \|)/i.test(line)) return true;
  if (line.length < 40 && /\|/.test(line) && !/\d/.test(line)) return true;
  // dòng số thuần OCR bảng vỡ
  if (/^\d+(\s+\d+){4,}$/.test(line)) return true;
  return false;
}

function matchTableKey(line) {
  const m = line.match(/^Bảng\s+(\d+|[A-Z]\.?\d*)/i);
  if (!m) return null;
  const key = `Bảng ${m[1].replace(/\.$/, "")}`.replace(/^Bảng (\d+)/, "Bảng $1");
  // normalize Bảng 1, Bảng 2, Bảng 5
  if (/^Bảng\s*1\b/i.test(line)) return "Bảng 1";
  if (/^Bảng\s*2\b/i.test(line)) return "Bảng 2";
  if (/^Bảng\s*5\b/i.test(line)) return "Bảng 5";
  return null; // các bảng phức tạp: bỏ block OCR, ghi chú
}

function isSectionH1(line) {
  if (/^Lời nói đầu$/i.test(line)) return true;
  if (/^Mục lục/i.test(line)) return true;
  if (/^Thư mục tài liệu tham khảo$/i.test(line)) return true;
  if (/^Phụ lục [A-I]\b/i.test(line)) return true;
  if (/^\d+\s+[A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/.test(line) && line.length < 100)
    return true;
  return false;
}

function isClause(line) {
  return /^\d+\.\d+(\.\d+)?(\s|$)/.test(line);
}

function isListItem(line) {
  return /^[—\-–~]\s*/.test(line) || /^[a-z]\)\s/.test(line);
}

async function main() {
  let raw = stripMarkdownHeader(fs.readFileSync(SRC, "utf8"));
  const lines = raw.split(/\r?\n/).map((l) => l.trim());

  const children = [];

  // ===== Bìa TCVN =====
  children.push(
    p("TIÊU CHUẨN QUỐC GIA", { bold: true, align: AlignmentType.CENTER, size: 28, after: 200 }),
    p("TCVN 9401:2024", { bold: true, align: AlignmentType.CENTER, size: 40, after: 80 }),
    p("Xuất bản lần 2", { italic: true, align: AlignmentType.CENTER, size: 24, after: 280 }),
    p("KỸ THUẬT ĐO VÀ XỬ LÝ SỐ LIỆU GNSS", {
      bold: true,
      align: AlignmentType.CENTER,
      size: 28,
      after: 40,
    }),
    p("TRONG TRẮC ĐỊA CÔNG TRÌNH", {
      bold: true,
      align: AlignmentType.CENTER,
      size: 28,
      after: 160,
    }),
    p("Measuring and processing techniques for GNSS data in engineering survey", {
      italic: true,
      align: AlignmentType.CENTER,
      size: 20,
      after: 280,
    }),
    p("HÀ NỘI — 2024", { align: AlignmentType.CENTER, size: 24, after: 400 }),
    p(
      "Bản Word biên tập lại từ OCR PDF scan, trình bày theo thể thức văn bản kỹ thuật (lề A4 kiểu TT 01/2011/TT-BNV; bảng kẻ viền). Nội dung kỹ thuật đối chiếu TCVN 9401:2024; bảng phức tạp / phụ lục số nên kiểm tra PDF gốc.",
      { italic: true, size: 18, color: "475569", align: AlignmentType.BOTH, after: 200 }
    ),
    new Paragraph({ children: [new PageBreak()] })
  );

  let skipUntilClause = false; // bỏ dòng OCR bảng thô sau khi đã chèn bảng đẹp
  let buf = [];
  const flushBody = () => {
    const text = cleanLine(buf.join(" "));
    buf = [];
    if (!text || isGarbageTableLine(text)) return;
    if (/^TCVN TIÊU CHUẨN|^Xuất bản lần|^KỸ THUẬT ĐO|^TRONG TRẮC|^Measuring and|^HÀ NỘI/i.test(text))
      return;
    children.push(p(text, { indent: mm(10), after: 100 }));
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (!line) {
      flushBody();
      continue;
    }

    // Bỏ header lặp OCR
    if (/^TCVN 9401:2024$/.test(line)) continue;

    const tKey = matchTableKey(line);
    if (tKey && TABLES[tKey]) {
      flushBody();
      const t = TABLES[tKey];
      children.push(tableCaption(t.title));
      children.push(makeTable(t.headers, t.rows, t.widths));
      if (t.note) children.push(tableNote(t.note));
      // nhảy qua các dòng tiếp theo thuộc khối bảng OCR cho đến khi gặp điều khoản mới
      skipUntilClause = true;
      continue;
    }

    if (/^Bảng\s+/i.test(line)) {
      flushBody();
      // Bảng chưa biên tập đủ → ghi chú + tiêu đề
      children.push(
        tableCaption(cleanLine(line).replace(/\s*[-–—].*$/, (m) => m.replace(/^[\s\-–—]+/, " — ")))
      );
      children.push(
        tableNote(
          "[Bảng số liệu OCR chưa dựng đủ lưới kẻ — vui lòng đối chiếu PDF gốc trang tương ứng. Đoạn văn xung quanh vẫn giữ nguyên.]"
        )
      );
      skipUntilClause = true;
      continue;
    }

    if (skipUntilClause) {
      if (isClause(line) || isSectionH1(line) || /^Phụ lục/i.test(line) || /^Các ký hiệu/i.test(line)) {
        skipUntilClause = false;
      } else if (isGarbageTableLine(line) || /^\d+\./.test(line) && line.length < 120 && /\|/.test(line)) {
        continue;
      } else if (/^(Chỉ tiêu|Tham số|Dạng lưới|ee |TT\b)/i.test(line)) {
        continue;
      } else if (line.length < 90 && /\d+[.,]\d+/.test(line) && !isClause(line)) {
        continue;
      } else {
        // có thể là chú thích bảng dạng a)
        if (/^[a-z]\)|^®\)|^a\)/i.test(line) || line.startsWith("(")) {
          children.push(p(cleanLine(line), { italic: true, size: 20, after: 80 }));
          continue;
        }
        // vẫn skip dòng bảng vỡ
        if (!isClause(line) && !isSectionH1(line)) continue;
        skipUntilClause = false;
      }
    }

    if (isSectionH1(line)) {
      flushBody();
      children.push(
        p(cleanLine(line), {
          heading: HeadingLevel.HEADING_1,
          bold: true,
          size: 28,
          align: AlignmentType.LEFT,
          before: 280,
          after: 120,
          color: "1e3a8a",
        })
      );
      continue;
    }

    if (isClause(line) && line.length < 20) {
      // "3.1" đơn dòng — gộp với dòng sau nếu là tên thuật ngữ
      flushBody();
      const next = lines[i + 1] ? cleanLine(lines[i + 1]) : "";
      if (next && !isClause(next) && !isSectionH1(next) && next.length < 120) {
        children.push(
          p(`${line}  ${next}`, {
            heading: HeadingLevel.HEADING_2,
            bold: true,
            size: 24,
            before: 180,
            after: 80,
            color: "1e40af",
            align: AlignmentType.LEFT,
          })
        );
        i++;
        continue;
      }
      children.push(
        p(line, {
          heading: HeadingLevel.HEADING_2,
          bold: true,
          size: 24,
          before: 160,
          after: 60,
          align: AlignmentType.LEFT,
        })
      );
      continue;
    }

    if (isClause(line)) {
      flushBody();
      children.push(
        p(cleanLine(line), {
          before: 140,
          after: 80,
          indent: 0,
        })
      );
      continue;
    }

    if (isListItem(line)) {
      flushBody();
      const item = cleanLine(line.replace(/^[—\-–~]\s*/, "").replace(/^_\s*/, ""));
      children.push(
        p(`— ${item}`, {
          after: 60,
          indent: mm(8),
          align: AlignmentType.BOTH,
        })
      );
      continue;
    }

    if (isGarbageTableLine(line)) continue;

    buf.push(line);
  }
  flushBody();

  const doc = new Document({
    creator: "ONTHICCHN",
    title: "TCVN 9401:2024 — Kỹ thuật đo và xử lý số liệu GNSS trong trắc địa công trình",
    description: "Bản Word biên tập OCR, trình bày gần thể thức TCVN",
    styles: {
      default: {
        document: {
          styles: [
            {
              id: "Normal",
              run: { font: "Times New Roman", size: 26 },
            },
          ],
        },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickStyle: true,
          run: { size: 28, bold: true, font: "Times New Roman", color: "1e3a8a" },
          paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 0 },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickStyle: true,
          run: { size: 24, bold: true, font: "Times New Roman", color: "1e40af" },
          paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 1 },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: mm(297) },
            margin: MARGIN,
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: {
                  bottom: { style: BorderStyle.SINGLE, size: 6, color: "1e3a8a", space: 4 },
                },
                children: [
                  new TextRun({
                    text: "TCVN 9401:2024",
                    font: "Times New Roman",
                    size: 18,
                    italics: true,
                    color: "334155",
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
                border: {
                  top: { style: BorderStyle.SINGLE, size: 6, color: "94a3b8", space: 4 },
                },
                children: [
                  new TextRun({
                    text: "Trang ",
                    font: "Times New Roman",
                    size: 18,
                    color: "64748b",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Times New Roman",
                    size: 18,
                    color: "64748b",
                  }),
                  new TextRun({
                    text: " / ",
                    font: "Times New Roman",
                    size: 18,
                    color: "64748b",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: "Times New Roman",
                    size: 18,
                    color: "64748b",
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const bufOut = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT, bufOut);
  console.log("Wrote", OUT);
  console.log("Size", bufOut.length, "bytes; blocks", children.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
