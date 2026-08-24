import type { CsplDocType } from './cspl'

export type CsplScanField = {
  value: string
  confidence?: number
  warning?: string
}

export type CsplScanResult = {
  docType: CsplDocType
  soHieu: string
  title: string
  issuedOn: string
  effectiveOn: string
  coQuanBanHanh: string
  warning: string
  sources: {
    issuedOn?: string
    effectiveOn?: string
  }
}

const LOAI_TO_DOC_TYPE: Record<string, CsplDocType> = {
  luat: 'luat',
  nghi_dinh: 'nghi-dinh',
  'nghi-dinh': 'nghi-dinh',
  thong_tu: 'thong-tu',
  'thong-tu': 'thong-tu',
  quyet_dinh: 'quyet-dinh',
  'quyet-dinh': 'quyet-dinh',
  vbhn: 'vbhn',
  van_ban_hop_nhat: 'vbhn',
  'van-ban-hop-nhat': 'vbhn',
  qcvn: 'qcvn',
  tcvn: 'tcvn',
  quy_dinh: 'quy-dinh',
  'quy-dinh': 'quy-dinh',
  khac: 'khac',
}

export const CSPL_SCAN_MAX_BYTES = 20 * 1024 * 1024

export function buildCsplScanPrompt(): string {
  return `
Bạn là chuyên gia đọc văn bản quy phạm pháp luật / quy chuẩn Việt Nam
(Luật, Nghị định, Thông tư, Quyết định, Văn bản hợp nhất/VBHN, QCVN, TCVN).
Đọc văn bản (PDF, Word hoặc ảnh scan) và trích xuất thông tin để điền form upload.

TRẢ VỀ DUY NHẤT JSON (không markdown):
{
  "loai_van_ban": "luat | nghi_dinh | thong_tu | quyet_dinh | vbhn | qcvn | tcvn | quy_dinh | khac",
  "so_hieu": "Số hiệu ngắn gọn, VD: 96/2024/NĐ-CP hoặc 22/2023/QH15 hoặc QCVN 01:202x/...",
  "ten_cspl": "Dòng trích yếu đầy đủ (giữ dấu tiếng Việt), VD: Nghị định số ... ngày ... của ...: [trích yếu]",
  "ngay_ban_hanh": "YYYY-MM-DD hoặc rỗng — lấy từ tiêu ngữ / đầu văn bản",
  "ngay_hieu_luc": "YYYY-MM-DD hoặc rỗng — chỉ điền nếu chắc từ Điều Hiệu lực thi hành khoản 1",
  "co_quan_ban_hanh": "Tên cơ quan ban hành",
  "confidence": 85,
  "warning": "Cảnh báo nếu scan mờ hoặc thiếu thông tin"
}

QUY TẮC:
- so_hieu: chỉ phần số hiệu (không kèm chữ Nghị định/Thông tư phía trước nếu không cần).
- Văn bản hợp nhất (VBHN) → loai_van_ban = "vbhn".
- ngay_hieu_luc: nếu khoản 1 ghi «kể từ ngày ký / ban hành» → bằng ngay_ban_hanh.
- Không lấy ngày từ phụ lục / biểu mẫu.
- Không bịa số hiệu hoặc ngày không có trong văn bản.
`.trim()
}

export function mapLoaiToDocType(raw: string, fallbackText = ''): CsplDocType {
  const v = String(raw || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
  if (LOAI_TO_DOC_TYPE[v]) return LOAI_TO_DOC_TYPE[v]

  const hay = `${raw} ${fallbackText}`.toLowerCase()
  if (/văn bản hợp nhất|\bvbhn\b/.test(hay)) return 'vbhn'
  if (/nghị định|nghi dinh|\bnđ-cp\b|nd-cp/.test(hay)) return 'nghi-dinh'
  if (/thông tư|thong tu|\btt-/.test(hay)) return 'thong-tu'
  if (/quyết định|quyet dinh/.test(hay)) return 'quyet-dinh'
  if (/\bluật\b|\bluat\b|\/qh\d*/.test(hay)) return 'luat'
  if (/\bqcvn\b/.test(hay)) return 'qcvn'
  if (/\btcvn\b/.test(hay)) return 'tcvn'
  return 'khac'
}

/** Lấy số hiệu từ chuỗi tiêu đề nếu AI bỏ sót. */
export function extractSoHieuFromTitle(title: string): string {
  const t = String(title || '').trim()
  if (!t) return ''
  const patterns = [
    /(?:Nghị định|Nghi dinh)\s+số\s+([0-9./\-A-ZĐđ]+)/i,
    /(?:Thông tư|Thong tu)\s+số\s+([0-9./\-A-ZĐđ]+)/i,
    /(?:Quyết định|Quyet dinh)\s+số\s+([0-9./\-A-ZĐđ]+)/i,
    /(?:Luật|Luat)\s+(?:số\s+)?([0-9./\-A-ZĐđ]*\/?\d{4}\/QH\d*)/i,
    /(?:VBHN|Văn bản hợp nhất)[^\d]*([0-9./\-A-ZĐđ]+)/i,
    /\b(QCVN\s*[0-9:./\-A-Z]+)/i,
    /\b(TCVN\s*[0-9:./\-A-Z]+)/i,
    /\b(\d{1,4}\/\d{4}\/[A-ZĐđ0-9\-]+)\b/,
  ]
  for (const re of patterns) {
    const m = t.match(re)
    if (m?.[1]) return m[1].replace(/\s+/g, '').trim()
  }
  return ''
}

export function normalizeIsoDate(raw: unknown): string {
  const s = String(raw ?? '').trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (m) {
    const dd = m[1].padStart(2, '0')
    const mm = m[2].padStart(2, '0')
    return `${m[3]}-${mm}-${dd}`
  }
  const vi = s.match(/(\d{1,2})\s*tháng\s*(\d{1,2})\s*năm\s*(\d{4})/i)
  if (vi) {
    return `${vi[3]}-${vi[2].padStart(2, '0')}-${vi[1].padStart(2, '0')}`
  }
  return ''
}

export function fieldValue(raw: unknown): string {
  if (raw && typeof raw === 'object' && 'value' in (raw as object)) {
    return String((raw as { value?: unknown }).value ?? '').trim()
  }
  return String(raw ?? '').trim()
}

export function parseCsplScanJson(raw: Record<string, unknown>): CsplScanResult {
  const title = fieldValue(raw.ten_cspl) || fieldValue(raw.title)
  const soFromAi = fieldValue(raw.so_hieu) || fieldValue(raw.soHieu)
  const soHieu = soFromAi || extractSoHieuFromTitle(title)
  const loaiRaw = fieldValue(raw.loai_van_ban) || fieldValue(raw.docType)
  const docType = mapLoaiToDocType(loaiRaw, title)
  const issuedOn = normalizeIsoDate(fieldValue(raw.ngay_ban_hanh) || fieldValue(raw.issuedOn))
  let effectiveOn = normalizeIsoDate(
    fieldValue(raw.ngay_hieu_luc) || fieldValue(raw.effectiveOn),
  )
  const coQuanBanHanh =
    fieldValue(raw.co_quan_ban_hanh) || fieldValue(raw.coQuanBanHanh)
  const warning = fieldValue(raw.warning)

  if (!effectiveOn && issuedOn && /kể từ ngày ký|kể từ ngày ban hành/i.test(warning)) {
    effectiveOn = issuedOn
  }

  return {
    docType,
    soHieu,
    title,
    issuedOn,
    effectiveOn,
    coQuanBanHanh,
    warning,
    sources: {
      issuedOn: issuedOn ? 'AI / tiêu ngữ' : undefined,
      effectiveOn: effectiveOn ? 'AI / Điều hiệu lực' : undefined,
    },
  }
}

export function buildScanErrorMessage(error: unknown): string {
  const message = String(
    (error as { message?: string })?.message || error || '',
  )
  const status =
    (error as { status?: number; code?: number })?.status ??
    (error as { code?: number })?.code

  if (status === 503 || /503|UNAVAILABLE|high demand/i.test(message)) {
    return 'Dịch vụ AI đang quá tải. Thử lại sau 1–2 phút.'
  }
  if (status === 429 || /429|quota|rate limit|RESOURCE_EXHAUSTED/i.test(message)) {
    return 'Hết quota API AI. Chờ rồi thử lại.'
  }
  if (status === 401 || status === 403 || /API key|API_KEY|permission/i.test(message)) {
    return 'Chưa cấu hình GEMINI_API_KEY hoặc khóa không hợp lệ.'
  }
  if (/mimeType|mime type|not supported/i.test(message)) {
    return 'Định dạng file AI chưa hỗ trợ tốt. Dùng PDF hoặc .docx.'
  }
  return `Không quét được file: ${message.slice(0, 180)}`
}
