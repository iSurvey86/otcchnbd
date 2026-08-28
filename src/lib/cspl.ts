export type CsplSector = 'do-dac-ban-do' | 'xay-dung' | 'dau-thau'

export type CsplDocType =
  | 'nghi-dinh'
  | 'thong-tu'
  | 'quyet-dinh'
  | 'luat'
  | 'vbhn'
  | 'qcvn'
  | 'tcvn'
  | 'quy-dinh'
  | 'khac'

/** Pipeline xử lý file / sinh câu — không lẫn hiệu lực pháp lý. */
export type CsplDocStatus =
  | 'uploaded'
  | 'ingesting'
  | 'chunk_review'
  | 'active'
  | 'superseded'

/** Hiệu lực pháp lý (kiểu danh mục CSPL ksnpsc). */
export type CsplLegalStatus = 'con_hieu_luc' | 'het_hieu_luc'

export interface CsplAppendix {
  id: string
  ten: string
  path: string
  fileTenGoc: string
  byteSize: number | null
  thuTu: number
}

export interface CsplDocument {
  id: string
  sector: CsplSector
  docType: CsplDocType
  soHieu: string
  title: string | null
  issuedOn: string | null
  effectiveOn: string | null
  status: CsplDocStatus
  legalStatus: CsplLegalStatus
  expiredOn: string | null
  replacedById: string | null
  expireNote: string | null
  storagePath: string
  originalFilename: string | null
  contentType: string | null
  byteSize: number | null
  uploadedByEmail: string | null
  notes: string | null
  createdAt: string
  appendices: CsplAppendix[]
}

export const CSPL_SECTOR_LABEL: Record<CsplSector, string> = {
  'do-dac-ban-do': 'Đo đạc và Bản đồ',
  'xay-dung': 'Xây dựng',
  'dau-thau': 'Đấu thầu',
}

export const CSPL_DOC_TYPE_LABEL: Record<CsplDocType, string> = {
  'nghi-dinh': 'Nghị định',
  'thong-tu': 'Thông tư',
  'quyet-dinh': 'Quyết định',
  luat: 'Luật',
  vbhn: 'Văn bản hợp nhất',
  qcvn: 'QCVN',
  tcvn: 'TCVN',
  'quy-dinh': 'Quy định',
  khac: 'Khác',
}

export const CSPL_STATUS_LABEL: Record<CsplDocStatus, string> = {
  uploaded: 'Đã tải lên',
  ingesting: 'Đang xử lý',
  chunk_review: 'Chờ duyệt đoạn',
  active: 'Đang dùng',
  superseded: 'Đã thay thế',
}

export const CSPL_LEGAL_STATUS_LABEL: Record<CsplLegalStatus, string> = {
  con_hieu_luc: 'Còn HL',
  het_hieu_luc: 'Hết HL',
}

export const CSPL_BUCKET = 'cspl'
export const CSPL_PILOT_SECTOR: CsplSector = 'do-dac-ban-do'

/** Chuẩn hóa số hiệu để so trùng (bỏ khoảng trắng, thống nhất dấu gạch). */
export function normalizeSoHieu(value: string): string {
  return value
    .normalize('NFC')
    .trim()
    .replace(/[–—−]/g, '-')
    .replace(/\s+/g, '')
    .toUpperCase()
}

export function findCsplDuplicateBySoHieu(
  docs: Array<Pick<CsplDocument, 'id' | 'soHieu' | 'title'>>,
  soHieu: string,
  excludeId?: string,
): Pick<CsplDocument, 'id' | 'soHieu' | 'title'> | null {
  const key = normalizeSoHieu(soHieu)
  if (!key) return null
  return (
    docs.find(
      (d) =>
        d.id !== excludeId && normalizeSoHieu(d.soHieu) === key,
    ) ?? null
  )
}
export const CSPL_MAX_BYTES = 20 * 1024 * 1024

export const CSPL_SELECT =
  'id, sector, doc_type, so_hieu, title, issued_on, effective_on, status, legal_status, expired_on, replaced_by_id, expire_note, storage_path, original_filename, content_type, byte_size, uploaded_by_email, notes, created_at, phu_luc_files'

const ALLOWED_EXT = new Set(['pdf', 'doc', 'docx'])

export function slugSoHieu(soHieu: string): string {
  return soHieu
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'VAN-BAN'
}

export function sanitizeAppendixBaseName(name: string): string {
  return (
    String(name || 'phu-luc')
      .replace(/\.[^.]+$/, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .replace(/[^a-zA-Z0-9._-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 60) || 'phu-luc'
  )
}

export function extFromFilename(name: string): string | null {
  const m = /\.([a-z0-9]+)$/i.exec(name.trim())
  if (!m) return null
  const ext = m[1].toLowerCase()
  return ALLOWED_EXT.has(ext) ? ext : null
}

export function buildCsplStoragePath(input: {
  sector: CsplSector
  docType: CsplDocType
  soHieu: string
  year?: number
  ext: string
  docId: string
}): string {
  const year = input.year ?? new Date().getFullYear()
  const slug = slugSoHieu(input.soHieu)
  return `${input.sector}/${input.docType}/${year}/${slug}/${input.docId}/original.${input.ext}`
}

/** Phụ lục / phần Công báo cùng một văn bản: …/{docId}/phu_luc/01_ten.ext */
export function buildCsplAppendixPath(input: {
  sector: CsplSector
  docId: string
  index: number
  originalName: string
  ext: string
}): string {
  const num = String(input.index).padStart(2, '0')
  const base = sanitizeAppendixBaseName(input.originalName)
  return `${input.sector}/${input.docId}/phu_luc/${num}_${base}.${input.ext}`
}

export type CsplDbAppendix = {
  id?: string
  ten?: string
  path?: string
  file_ten_goc?: string
  byte_size?: number | null
  thu_tu?: number
}

export function parsePhuLucFiles(raw: unknown): CsplAppendix[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item, i) => {
      const row = item as CsplDbAppendix
      if (!row?.path) return null
      return {
        id: String(row.id || `pl-${i + 1}`),
        ten: String(row.ten || row.file_ten_goc || `Phụ lục ${i + 1}`),
        path: String(row.path),
        fileTenGoc: String(row.file_ten_goc || ''),
        byteSize: typeof row.byte_size === 'number' ? row.byte_size : null,
        thuTu: typeof row.thu_tu === 'number' ? row.thu_tu : i + 1,
      } satisfies CsplAppendix
    })
    .filter((x): x is CsplAppendix => Boolean(x))
    .sort((a, b) => a.thuTu - b.thuTu)
}

export function serializePhuLucFiles(list: CsplAppendix[]): CsplDbAppendix[] {
  return list.map((pl) => ({
    id: pl.id,
    ten: pl.ten,
    path: pl.path,
    file_ten_goc: pl.fileTenGoc,
    byte_size: pl.byteSize,
    thu_tu: pl.thuTu,
  }))
}

export type CsplDbRow = {
  id: string
  sector: string
  doc_type: string
  so_hieu: string
  title: string | null
  issued_on: string | null
  effective_on: string | null
  status: string
  legal_status?: string | null
  expired_on?: string | null
  replaced_by_id?: string | null
  expire_note?: string | null
  storage_path: string
  original_filename: string | null
  content_type: string | null
  byte_size: number | null
  uploaded_by_email: string | null
  notes: string | null
  created_at: string
  phu_luc_files?: unknown
}

export function mapCsplRow(row: CsplDbRow): CsplDocument {
  const legal =
    row.legal_status === 'het_hieu_luc' ? 'het_hieu_luc' : 'con_hieu_luc'
  return {
    id: row.id,
    sector: row.sector as CsplSector,
    docType: row.doc_type as CsplDocType,
    soHieu: row.so_hieu,
    title: row.title,
    issuedOn: row.issued_on,
    effectiveOn: row.effective_on,
    status: row.status as CsplDocStatus,
    legalStatus: legal,
    expiredOn: row.expired_on ?? null,
    replacedById: row.replaced_by_id ?? null,
    expireNote: row.expire_note ?? null,
    storagePath: row.storage_path,
    originalFilename: row.original_filename,
    contentType: row.content_type,
    byteSize: row.byte_size,
    uploadedByEmail: row.uploaded_by_email,
    notes: row.notes,
    createdAt: row.created_at,
    appendices: parsePhuLucFiles(row.phu_luc_files),
  }
}

export function csplDocLabel(row: Pick<CsplDocument, 'soHieu' | 'title'>): string {
  if (row.title?.trim()) return `${row.soHieu} — ${row.title.trim()}`
  return row.soHieu
}
