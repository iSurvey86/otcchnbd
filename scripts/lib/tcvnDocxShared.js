/**
 * Shared layout helpers for TCVN Word export
 * Lề A4 kiểu TT 01/2011: trái 3 cm, phải 2 cm, trên/dưới 2,5 cm
 * Times New Roman 13pt; giãn dòng 1.5
 */
const {
  Document,
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
} = require('docx')

const mm = (n) => Math.round((n / 25.4) * 1440)
const PAGE_W = mm(210)
const PAGE_H = mm(297)
const MARGIN = { top: mm(25), bottom: mm(25), left: mm(30), right: mm(20) }
const CONTENT_W = PAGE_W - MARGIN.left - MARGIN.right

const thin = { style: BorderStyle.SINGLE, size: 4, color: '000000' }
const borders = { top: thin, bottom: thin, left: thin, right: thin }

function p(text, opts = {}) {
  const {
    bold = false,
    italic = false,
    size = 26,
    align = AlignmentType.BOTH,
    before = 0,
    after = 120,
    indent = 0,
    color,
    heading,
  } = opts
  return new Paragraph({
    heading,
    alignment: align,
    spacing: { before, after, line: 360 },
    indent: indent ? { firstLine: indent } : undefined,
    children: [
      new TextRun({
        text,
        bold,
        italics: italic,
        size,
        font: 'Times New Roman',
        color,
      }),
    ],
  })
}

function cell(text, opts = {}) {
  const {
    bold = false,
    align = AlignmentType.CENTER,
    width,
    fill,
    size = 20,
  } = opts
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
            text: String(text ?? ''),
            bold,
            size,
            font: 'Times New Roman',
          }),
        ],
      }),
    ],
  })
}

function makeTable(headers, rows, colWidths) {
  const widths =
    colWidths || headers.map(() => Math.floor(CONTENT_W / headers.length))
  const head = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      cell(h, {
        bold: true,
        width: widths[i],
        fill: 'E8EEF7',
        align: AlignmentType.CENTER,
      }),
    ),
  })
  const body = rows.map(
    (r) =>
      new TableRow({
        children: r.map((c, i) =>
          cell(c, {
            width: widths[i],
            align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
          }),
        ),
      }),
  )
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [head, ...body],
  })
}

function tableCaption(title) {
  return p(title, {
    bold: true,
    align: AlignmentType.CENTER,
    before: 200,
    after: 80,
    size: 24,
  })
}

function tableNote(text) {
  return p(text, {
    italic: true,
    size: 18,
    after: 160,
    color: '475569',
    align: AlignmentType.LEFT,
  })
}

function stripMarkdownHeader(raw) {
  return raw.replace(/^#[^\n]*\n+/, '').replace(/^(>.*\n)+\n*---\n*/m, '')
}

function cleanLine(s) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .replace(/Đối với với/g, 'Đối với')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim()
}

function isSectionH1(line) {
  if (/^Lời nói đầu$/i.test(line)) return true
  if (/^Mục lục/i.test(line)) return true
  if (/^Thư mục tài liệu tham khảo$/i.test(line)) return true
  if (/^Phụ lục [A-Z]\b/i.test(line)) return true
  if (
    /^\d+\s+[A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/.test(
      line,
    ) &&
    line.length < 110
  ) {
    return true
  }
  return false
}

function isClause(line) {
  return /^\d+\.\d+(\.\d+)?(\s|$)/.test(line)
}

function isListItem(line) {
  return /^[—\-–~]\s*/.test(line) || /^[a-z]\)\s/.test(line)
}

function isGarbageTableLine(line) {
  if (!line) return false
  if ((line.match(/\|/g) || []).length >= 2) return true
  if (/^\|/.test(line) || /\|\s*$/.test(line)) return true
  if (/_{5,}|\.{8,}|-{8,}/.test(line)) return true
  return false
}

function buildCover({
  code,
  edition,
  titleLines,
  enTitle,
  placeYear,
  note,
}) {
  const kids = [
    p('TIÊU CHUẨN QUỐC GIA', {
      bold: true,
      align: AlignmentType.CENTER,
      size: 28,
      after: 200,
    }),
    p(code, { bold: true, align: AlignmentType.CENTER, size: 40, after: 80 }),
  ]
  if (edition) {
    kids.push(
      p(edition, {
        italic: true,
        align: AlignmentType.CENTER,
        size: 24,
        after: 280,
      }),
    )
  }
  for (let i = 0; i < titleLines.length; i++) {
    kids.push(
      p(titleLines[i], {
        bold: true,
        align: AlignmentType.CENTER,
        size: 28,
        after: i === titleLines.length - 1 ? 160 : 40,
      }),
    )
  }
  if (enTitle) {
    kids.push(
      p(enTitle, {
        italic: true,
        align: AlignmentType.CENTER,
        size: 20,
        after: 280,
      }),
    )
  }
  kids.push(
    p(placeYear, { align: AlignmentType.CENTER, size: 24, after: 400 }),
    p(note, {
      italic: true,
      size: 18,
      color: '475569',
      align: AlignmentType.BOTH,
      after: 200,
    }),
    new Paragraph({ children: [new PageBreak()] }),
  )
  return kids
}

function buildDoc({ code, fullTitle, children }) {
  return new Document({
    creator: 'ONTHICCHN',
    title: fullTitle,
    description:
      'Bản Word biên tập từ OCR, trình bày theo thể thức văn bản kỹ thuật TCVN',
    styles: {
      default: {
        document: {
          styles: [
            {
              id: 'Normal',
              run: { font: 'Times New Roman', size: 26 },
            },
          ],
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickStyle: true,
          run: {
            size: 28,
            bold: true,
            font: 'Times New Roman',
            color: '1e3a8a',
          },
          paragraph: {
            spacing: { before: 280, after: 120 },
            outlineLevel: 0,
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickStyle: true,
          run: {
            size: 24,
            bold: true,
            font: 'Times New Roman',
            color: '1e40af',
          },
          paragraph: {
            spacing: { before: 180, after: 80 },
            outlineLevel: 1,
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: PAGE_H },
            margin: MARGIN,
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: {
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 6,
                    color: '1e3a8a',
                    space: 4,
                  },
                },
                children: [
                  new TextRun({
                    text: code,
                    font: 'Times New Roman',
                    size: 18,
                    italics: true,
                    color: '334155',
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
                  top: {
                    style: BorderStyle.SINGLE,
                    size: 6,
                    color: '94a3b8',
                    space: 4,
                  },
                },
                children: [
                  new TextRun({
                    text: 'Trang ',
                    font: 'Times New Roman',
                    size: 18,
                    color: '64748b',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Times New Roman',
                    size: 18,
                    color: '64748b',
                  }),
                  new TextRun({
                    text: ' / ',
                    font: 'Times New Roman',
                    size: 18,
                    color: '64748b',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: 'Times New Roman',
                    size: 18,
                    color: '64748b',
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  })
}

module.exports = {
  mm,
  PAGE_W,
  CONTENT_W,
  MARGIN,
  AlignmentType,
  HeadingLevel,
  PageBreak,
  p,
  cell,
  makeTable,
  tableCaption,
  tableNote,
  stripMarkdownHeader,
  cleanLine,
  isSectionH1,
  isClause,
  isListItem,
  isGarbageTableLine,
  buildCover,
  buildDoc,
}
