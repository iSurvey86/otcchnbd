/**
 * Tách văn bản CSPL thành chunk (Điều / Khoản / mục TCVN) để Admin duyệt.
 */

export type CsplChunkStatus = 'pending' | 'approved' | 'rejected'

export interface CsplChunkDraft {
  citeLabel: string
  dieu: string | null
  khoan: string | null
  muc: string | null
  body: string
  sortOrder: number
}

export interface CsplChunk {
  id: string
  documentId: string
  sector: string
  soHieu: string
  citeLabel: string
  dieu: string | null
  khoan: string | null
  muc: string | null
  body: string
  charCount: number
  sortOrder: number
  status: CsplChunkStatus
  reviewNote: string | null
  createdAt: string
  updatedAt: string
}

export type CsplChunkDbRow = {
  id: string
  document_id: string
  sector: string
  so_hieu: string
  cite_label: string
  dieu: string | null
  khoan: string | null
  muc: string | null
  body: string
  char_count: number
  sort_order: number
  status: string
  review_note: string | null
  created_at: string
  updated_at: string
}

export const CSPL_CHUNK_SELECT =
  'id, document_id, sector, so_hieu, cite_label, dieu, khoan, muc, body, char_count, sort_order, status, review_note, created_at, updated_at'

export const CSPL_CHUNK_STATUS_LABEL: Record<CsplChunkStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Loại',
}

export function mapCsplChunkRow(row: CsplChunkDbRow): CsplChunk {
  const status =
    row.status === 'approved' || row.status === 'rejected'
      ? row.status
      : 'pending'
  return {
    id: row.id,
    documentId: row.document_id,
    sector: row.sector,
    soHieu: row.so_hieu,
    citeLabel: row.cite_label,
    dieu: row.dieu,
    khoan: row.khoan,
    muc: row.muc,
    body: row.body,
    charCount: row.char_count,
    sortOrder: row.sort_order,
    status,
    reviewNote: row.review_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

type Mark = {
  citeLabel: string
  dieu: string | null
  khoan: string | null
  muc: string | null
  index: number
}

const MIN_BODY = 40
const LONG_DIEU = 1800

function pushMarksFromRegex(
  text: string,
  re: RegExp,
  toMark: (label: string) => Omit<Mark, 'index'> | null,
): Mark[] {
  const marks: Mark[] = []
  const seen = new Set<number>()
  let m: RegExpExecArray | null
  const rx = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`)
  while ((m = rx.exec(text))) {
    const full = m[0]
    const label = (m[1] || '').replace(/\s+/g, ' ').trim()
    if (!label) continue
    const index = m.index + full.indexOf(label)
    if (seen.has(index)) continue
    const meta = toMark(label)
    if (!meta) continue
    seen.add(index)
    marks.push({ ...meta, index })
  }
  return marks
}

function marksToDrafts(text: string, marks: Mark[]): CsplChunkDraft[] {
  marks.sort((a, b) => a.index - b.index)
  const drafts: CsplChunkDraft[] = []
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].index
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length
    const body = text.slice(start, end).trim()
    if (body.length < MIN_BODY) continue
    drafts.push({
      citeLabel: marks[i].citeLabel,
      dieu: marks[i].dieu,
      khoan: marks[i].khoan,
      muc: marks[i].muc,
      body,
      sortOrder: drafts.length + 1,
    })
  }
  return drafts
}

/** Tách thêm Khoản trong Điều dài. */
function expandLongDieu(drafts: CsplChunkDraft[]): CsplChunkDraft[] {
  const out: CsplChunkDraft[] = []
  for (const d of drafts) {
    if (!d.dieu || d.khoan || d.body.length < LONG_DIEU) {
      out.push(d)
      continue
    }
    const marks = pushMarksFromRegex(
      d.body,
      /(?:^|\n)\s*((?:Khoản|KHOẢN)\s+\d+)\s*[.:]?/gi,
      (label) => ({
        citeLabel: `${d.dieu} ${label}`,
        dieu: d.dieu,
        khoan: label,
        muc: null,
      }),
    )
    if (marks.length < 2) {
      out.push(d)
      continue
    }
    const parts = marksToDrafts(d.body, marks)
    if (parts.length < 2) {
      out.push(d)
      continue
    }
    out.push(...parts)
  }
  return out.map((x, i) => ({ ...x, sortOrder: i + 1 }))
}

function splitByDieu(text: string): CsplChunkDraft[] {
  const marks = pushMarksFromRegex(
    text,
    /(?:^|\n)\s*((?:Điều|Điêu|DIEU)\s+\d+[a-zA-Z]?)\s*[.:]?/gi,
    (label) => {
      const norm = label.replace(/^Điêu/i, 'Điều').replace(/^DIEU/i, 'Điều')
      return {
        citeLabel: norm,
        dieu: norm,
        khoan: null,
        muc: null,
      }
    },
  )
  if (marks.length < 2) return []
  return expandLongDieu(marksToDrafts(text, marks))
}

/** TCVN / quy chuẩn: mục 4.2, 5.1.1… (ưu tiên đa cấp). */
function splitByNumberedMuc(text: string): CsplChunkDraft[] {
  const marks = pushMarksFromRegex(
    text,
    /(?:^|\n)\s*((?:\d+\.)+\d+|\d{1,2})\s+(?=[A-ZÀ-Ỵa-zà-ỹ«"“])/gu,
    (label) => {
      if (/^\d+$/.test(label)) {
        const n = Number(label)
        if (n < 1 || n > 25) return null
      }
      // Bỏ nhiễu số đo / tọa độ kiểu "6 378"
      return {
        citeLabel: `Mục ${label}`,
        dieu: null,
        khoan: null,
        muc: label,
      }
    },
  )
  // Bỏ mục trùng từ mục lục: giữ lần xuất hiện có body dài hơn khi cùng label liên tiếp gần nhau
  if (marks.length < 3) return []
  const drafts = marksToDrafts(text, marks)
  // Lọc chunk quá ngắn (thường là dòng mục lục)
  const filtered = drafts.filter((d) => d.body.length >= 80 || (d.muc || '').includes('.'))
  return filtered.map((x, i) => ({ ...x, sortOrder: i + 1 }))
}

/** Fallback: cắt theo khối ~1500 ký tự. */
function splitByBlocks(text: string, size = 1500): CsplChunkDraft[] {
  const parts: CsplChunkDraft[] = []
  const clean = text.trim()
  if (clean.length < MIN_BODY) return []
  let i = 0
  let order = 1
  while (i < clean.length) {
    let end = Math.min(i + size, clean.length)
    if (end < clean.length) {
      const slice = clean.slice(i, end)
      const breakAt = Math.max(
        slice.lastIndexOf('\n\n'),
        slice.lastIndexOf('\n'),
        slice.lastIndexOf('. '),
      )
      if (breakAt > size * 0.4) end = i + breakAt + 1
    }
    const body = clean.slice(i, end).trim()
    if (body.length >= MIN_BODY) {
      parts.push({
        citeLabel: `Đoạn ${order}`,
        dieu: null,
        khoan: null,
        muc: null,
        body,
        sortOrder: order,
      })
      order += 1
    }
    i = end
  }
  return parts
}

export function splitCsplTextToChunks(text: string): {
  drafts: CsplChunkDraft[]
  strategy: 'dieu' | 'muc' | 'block'
} {
  const dieu = splitByDieu(text)
  if (dieu.length >= 3) {
    return { drafts: dieu, strategy: 'dieu' }
  }
  const muc = splitByNumberedMuc(text)
  if (muc.length >= 3) {
    return { drafts: muc, strategy: 'muc' }
  }
  return { drafts: splitByBlocks(text), strategy: 'block' }
}
