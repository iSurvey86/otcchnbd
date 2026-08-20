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

export type CsplDocStatus =
  | 'uploaded'
  | 'ingesting'
  | 'chunk_review'
  | 'active'
  | 'superseded'

export interface CsplDocument {
  id: string
  sector: CsplSector
  docType: CsplDocType
  soHieu: string
  title: string | null
  issuedOn: string | null
  effectiveOn: string | null
  status: CsplDocStatus
  storagePath: string
  originalFilename: string | null
  contentType: string | null
  byteSize: number | null
  uploadedByEmail: string | null
  notes: string | null
  createdAt: string
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

export const CSPL_BUCKET = 'cspl'
export const CSPL_PILOT_SECTOR: CsplSector = 'do-dac-ban-do'
export const CSPL_MAX_BYTES = 20 * 1024 * 1024

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

export type CsplDbRow = {
  id: string
  sector: string
  doc_type: string
  so_hieu: string
  title: string | null
  issued_on: string | null
  effective_on: string | null
  status: string
  storage_path: string
  original_filename: string | null
  content_type: string | null
  byte_size: number | null
  uploaded_by_email: string | null
  notes: string | null
  created_at: string
}

export function mapCsplRow(row: CsplDbRow): CsplDocument {
  return {
    id: row.id,
    sector: row.sector as CsplSector,
    docType: row.doc_type as CsplDocType,
    soHieu: row.so_hieu,
    title: row.title,
    issuedOn: row.issued_on,
    effectiveOn: row.effective_on,
    status: row.status as CsplDocStatus,
    storagePath: row.storage_path,
    originalFilename: row.original_filename,
    contentType: row.content_type,
    byteSize: row.byte_size,
    uploadedByEmail: row.uploaded_by_email,
    notes: row.notes,
    createdAt: row.created_at,
  }
}
