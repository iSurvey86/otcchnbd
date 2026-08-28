/**
 * Xuất Word sạch TCVN từ .clean.txt — bố cục thống nhất
 *   node scripts/export_tcvn_clean_docx.js          # cả 9401 + 9398
 *   node scripts/export_tcvn_clean_docx.js 9401
 *   node scripts/export_tcvn_clean_docx.js 9398
 *
 * Lề A4 kiểu TT 01/2011; Times New Roman; header/footer số trang.
 */
const fs = require('fs')
const path = require('path')
const { Packer } = require('docx')
const {
  mm,
  CONTENT_W,
  AlignmentType,
  HeadingLevel,
  p,
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
} = require('./lib/tcvnDocxShared')

const ROOT = path.join(__dirname, '..', 'docs', 'tcvn')

/** Bảng kỹ thuật 9401 đã biên tập (OCR bảng gốc kém) */
const TABLES_9401 = {
  'Bảng 1': {
    title: 'Bảng 1 — Tham số hình học cơ bản của Ellipsoid toàn cầu (Ellipsoid WGS-84)',
    headers: ['Tham số hình học', 'Giá trị'],
    widths: [Math.floor(CONTENT_W * 0.62), Math.floor(CONTENT_W * 0.38)],
    rows: [
      ['1. Bán trục lớn a (m)', '6 378 137'],
      ['2. Bán trục nhỏ b (m)', '6 356 752,314 2'],
      ['3. Độ dẹt f', '1/298,257 223 563'],
      ['4. Bình phương độ lệch tâm thứ nhất e²', '0,006 694 379 990 13'],
      ['5. Bình phương độ lệch tâm thứ hai e′²', '0,006 739 496 742 227'],
    ],
  },
  'Bảng 2': {
    title:
      'Bảng 2 — Yêu cầu kỹ thuật chủ yếu của lưới khảo sát công trình thành lập bằng công nghệ GNSS tĩnh',
    headers: [
      'Chỉ tiêu kỹ thuật',
      'Cơ sở cấp 1',
      'Cơ sở cấp 2',
      'Đo vẽ cấp 1',
      'Đo vẽ cấp 2',
    ],
    widths: [mm(48), mm(28), mm(28), mm(28), mm(28)],
    rows: [
      [
        '1. Khoảng cách giữa các điểm lưới, km',
        '1 ÷ 5',
        'Tăng dày điểm KC',
        'Tăng dày điểm KC',
        'Tăng dày điểm KC',
      ],
      ['2. Sai số trung phương vị trí điểm, m', '0,02', '0,03', '—', '—'],
      ['3. Sai số trung phương độ cao, m', '0,03', '0,03', '—', '—'],
      [
        '4. Sai số trung phương tương đối cạnh yếu nhất',
        '1/100 000',
        '1/20 000',
        '1/10 000',
        '1/5 000',
      ],
      ['5. Giá trị trung bình số lần đo lặp tại các điểm', '≥ 1,6', '≥ 1,6', '≥ 1,6', '≥ 1,6'],
      [
        '6. Số lượng cạnh trong vòng đo độc lập / tuyến phù hợp',
        '≤ 10',
        '≤ 10',
        '—',
        '—',
      ],
      [
        '7. Số điểm khống chế tọa độ tối thiểu',
        '03 điểm gốc tọa độ quốc gia',
        '03 điểm gốc lưới CS cấp 1 trở lên',
        '03 điểm gốc lưới CS cấp 2 trở lên',
        '03 điểm gốc lưới đo vẽ cấp 1 trở lên',
      ],
      [
        '8. Số điểm khống chế độ cao tối thiểu',
        '03 điểm độ cao hạng III trở lên',
        '03 điểm độ cao lưới CS cấp 1 trở lên',
        '—',
        '—',
      ],
    ],
    note: 'Giá trị đối chiếu TCVN 9401:2024; khi dùng số liệu tuyệt đối hãy kiểm tra PDF gốc.',
  },
  'Bảng 5': {
    title:
      'Bảng 5 — Yêu cầu kỹ thuật chủ yếu của lưới quan trắc chuyển dịch ngang bằng GNSS tĩnh',
    headers: ['Chỉ tiêu kỹ thuật', 'Giá trị'],
    widths: [Math.floor(CONTENT_W * 0.62), Math.floor(CONTENT_W * 0.38)],
    rows: [
      ['1. Sai số trung phương vị trí điểm, mm', '≤ 2 ÷ 5 (theo nhiệm vụ)'],
      ['2. Thời lượng đo tối thiểu mỗi ca, phút', 'Theo thiết kế kỹ thuật'],
      ['3. Số lần đo lặp tối thiểu tại mỗi điểm', '≥ 2'],
      ['4. Số điểm mốc chuẩn tối thiểu', 'Theo TCVN 9399 / đề cương'],
    ],
    note: 'Bảng rút gọn phục vụ Word sạch; chi tiết đầy đủ xem PDF gốc.',
  },
}

const SPECS = {
  '9401': {
    code: 'TCVN 9401:2024',
    src: path.join(ROOT, 'TCVN-9401-2024.clean.txt'),
    out: path.join(ROOT, 'TCVN-9401-2024.docx'),
    fullTitle:
      'TCVN 9401:2024 — Kỹ thuật đo và xử lý số liệu GNSS trong trắc địa công trình',
    cover: {
      edition: 'Xuất bản lần 2',
      titleLines: [
        'KỸ THUẬT ĐO VÀ XỬ LÝ SỐ LIỆU GNSS',
        'TRONG TRẮC ĐỊA CÔNG TRÌNH',
      ],
      enTitle:
        'Measuring and processing techniques for GNSS data in engineering survey',
      placeYear: 'HÀ NỘI — 2024',
      note:
        'Bản Word biên tập từ OCR PDF, trình bày theo thể thức văn bản kỹ thuật (lề A4 kiểu TT 01/2011/TT-BNV; bảng kẻ viền). Nội dung kỹ thuật đối chiếu TCVN 9401:2024; bảng phức tạp / phụ lục số nên kiểm tra PDF gốc.',
    },
    tables: TABLES_9401,
    skipCoverRe:
      /^TCVN TIÊU CHUẨN|^Xuất bản lần|^KỸ THUẬT ĐO|^TRONG TRẮC|^Measuring and|^HÀ NỘI/i,
  },
  '9398': {
    code: 'TCVN 9398:2012',
    src: path.join(ROOT, 'TCVN-9398-2012.clean.txt'),
    out: path.join(ROOT, 'TCVN-9398-2012.docx'),
    fullTitle:
      'TCVN 9398:2012 — Công tác trắc địa trong xây dựng công trình — Yêu cầu chung',
    cover: {
      edition: 'Xuất bản lần 1',
      titleLines: [
        'CÔNG TÁC TRẮC ĐỊA TRONG XÂY DỰNG CÔNG TRÌNH',
        '— YÊU CẦU CHUNG',
      ],
      enTitle: 'Surveying in construction — General requirements',
      placeYear: 'HÀ NỘI — 2012',
      note:
        'Bản Word biên tập từ OCR PDF, trình bày theo thể thức văn bản kỹ thuật (lề A4 kiểu TT 01/2011/TT-BNV). Nội dung đối chiếu TCVN 9398:2012; bảng / phụ lục số liệu OCR kém hơn — kiểm tra PDF gốc khi cần số chính xác.',
    },
    tables: null,
    skipCoverRe:
      /^TCVN TIÊU CHUẨN|^Xuất bản lần|^CÔNG TÁC TRẮC|^— YÊU CẦU|^Surveying in|^HÀ NỘI|^Công tác trắc địa trong xây dựng/i,
  },
}

function matchTableKey(line, tables) {
  if (!tables) return null
  if (/^Bảng\s*1\b/i.test(line) && tables['Bảng 1']) return 'Bảng 1'
  if (/^Bảng\s*2\b/i.test(line) && tables['Bảng 2']) return 'Bảng 2'
  if (/^Bảng\s*5\b/i.test(line) && tables['Bảng 5']) return 'Bảng 5'
  return null
}

function buildBody(lines, spec) {
  const children = []
  let skipUntilClause = false
  let buf = []

  const flushBody = () => {
    const text = cleanLine(buf.join(' '))
    buf = []
    if (!text || isGarbageTableLine(text)) return
    if (spec.skipCoverRe.test(text)) return
    children.push(p(text, { indent: mm(10), after: 100 }))
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) {
      flushBody()
      continue
    }
    if (line === spec.code) continue

    const tKey = matchTableKey(line, spec.tables)
    if (tKey && spec.tables[tKey]) {
      flushBody()
      const t = spec.tables[tKey]
      children.push(tableCaption(t.title))
      children.push(makeTable(t.headers, t.rows, t.widths))
      if (t.note) children.push(tableNote(t.note))
      skipUntilClause = true
      continue
    }

    if (/^Bảng\s+/i.test(line)) {
      flushBody()
      children.push(
        tableCaption(
          cleanLine(line).replace(/\s*[-–—].*$/, (m) =>
            m.replace(/^[\s\-–—]+/, ' — '),
          ),
        ),
      )
      children.push(
        tableNote(
          '[Bảng số liệu OCR chưa dựng đủ lưới kẻ — vui lòng đối chiếu PDF gốc. Đoạn văn xung quanh vẫn giữ nguyên.]',
        ),
      )
      skipUntilClause = true
      continue
    }

    if (skipUntilClause) {
      if (
        isClause(line) ||
        isSectionH1(line) ||
        /^Phụ lục/i.test(line) ||
        /^Các ký hiệu/i.test(line)
      ) {
        skipUntilClause = false
      } else if (
        isGarbageTableLine(line) ||
        (/^\d+\./.test(line) && line.length < 120 && /\|/.test(line))
      ) {
        continue
      } else if (/^(Chỉ tiêu|Tham số|Dạng lưới|ee |TT\b)/i.test(line)) {
        continue
      } else if (
        line.length < 90 &&
        /\d+[.,]\d+/.test(line) &&
        !isClause(line)
      ) {
        continue
      } else {
        if (/^[a-z]\)|^®\)|^a\)/i.test(line) || line.startsWith('(')) {
          children.push(p(cleanLine(line), { italic: true, size: 20, after: 80 }))
          continue
        }
        if (!isClause(line) && !isSectionH1(line)) continue
        skipUntilClause = false
      }
    }

    if (isSectionH1(line)) {
      flushBody()
      children.push(
        p(cleanLine(line), {
          heading: HeadingLevel.HEADING_1,
          bold: true,
          size: 28,
          align: AlignmentType.LEFT,
          before: 280,
          after: 120,
          color: '1e3a8a',
        }),
      )
      continue
    }

    if (isClause(line) && line.length < 20) {
      flushBody()
      const next = lines[i + 1] ? cleanLine(lines[i + 1]) : ''
      if (
        next &&
        !isClause(next) &&
        !isSectionH1(next) &&
        next.length < 120
      ) {
        children.push(
          p(`${line}  ${next}`, {
            heading: HeadingLevel.HEADING_2,
            bold: true,
            size: 24,
            before: 180,
            after: 80,
            color: '1e40af',
            align: AlignmentType.LEFT,
          }),
        )
        i++
        continue
      }
      children.push(
        p(line, {
          heading: HeadingLevel.HEADING_2,
          bold: true,
          size: 24,
          before: 160,
          after: 60,
          align: AlignmentType.LEFT,
        }),
      )
      continue
    }

    if (isClause(line)) {
      flushBody()
      children.push(p(cleanLine(line), { before: 140, after: 80, indent: 0 }))
      continue
    }

    if (isListItem(line)) {
      flushBody()
      const item = cleanLine(
        line.replace(/^[—\-–~]\s*/, '').replace(/^_\s*/, ''),
      )
      children.push(
        p(`— ${item}`, {
          after: 60,
          indent: mm(8),
          align: AlignmentType.BOTH,
        }),
      )
      continue
    }

    if (isGarbageTableLine(line)) continue
    buf.push(line)
  }
  flushBody()
  return children
}

async function exportOne(key) {
  const spec = SPECS[key]
  if (!spec) throw new Error(`Unknown spec: ${key}`)
  if (!fs.existsSync(spec.src)) {
    throw new Error(`Missing source: ${spec.src}`)
  }

  const raw = stripMarkdownHeader(fs.readFileSync(spec.src, 'utf8'))
  const lines = raw.split(/\r?\n/).map((l) => l.trim())

  const children = [
    ...buildCover({ code: spec.code, ...spec.cover }),
    ...buildBody(lines, spec),
  ]

  const doc = buildDoc({
    code: spec.code,
    fullTitle: spec.fullTitle,
    children,
  })
  const bufOut = await Packer.toBuffer(doc)
  fs.writeFileSync(spec.out, bufOut)
  console.log('Wrote', spec.out)
  console.log('  size', bufOut.length, 'bytes · blocks', children.length)
}

async function main() {
  const arg = (process.argv[2] || 'all').replace(/^tcvn-?/i, '')
  const keys =
    arg === 'all' ? Object.keys(SPECS) : arg === '9401' || arg === '9398' ? [arg] : null
  if (!keys) {
    console.error('Usage: node scripts/export_tcvn_clean_docx.js [all|9401|9398]')
    process.exit(1)
  }
  for (const key of keys) {
    await exportOne(key)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
