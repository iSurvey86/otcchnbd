/**
 * Pack câu hỏi tháng — types, template giải thích, prompt Gemini.
 * Tuân thủ docs/Quy-che-van-hanh-sinh-cau-hoi-thang.md
 */

import type { CsplSector } from './cspl'

export type CsplPackStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'locked'

export type CsplPackQuestionStatus = 'draft' | 'approved' | 'rejected'

export type CsplStemType =
  | 'định-nghĩa'
  | 'phạm-vi'
  | 'trừ-ngoại'
  | 'so-sánh'
  | 'tình-huống'
  | 'phương-án-sai'
  | 'thẩm-quyền'
  | 'trình-tự'
  | 'định-lượng'

export type CsplPackSection = 'phap-luat' | 'kinh-nghiem'

export interface CsplPackSource {
  chunkId: string
  soHieu: string
  citeLabel: string
  multiSourceSuggested?: boolean
}

export interface CsplMonthlyPack {
  id: string
  sector: CsplSector
  period: string
  status: CsplPackStatus
  minQuestions: number
  lawTarget: number
  skillTarget: number
  notes: string | null
  createdByEmail: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  /** counts from join / separate query */
  questionCounts?: {
    total: number
    draft: number
    approved: number
    rejected: number
  }
}

export interface CsplPackQuestion {
  id: string
  packId: string
  sector: CsplSector
  period: string
  status: CsplPackQuestionStatus
  stemType: string
  section: CsplPackSection
  prompt: string
  options: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  explanation: string
  sources: CsplPackSource[]
  multiSourceOk: boolean
  reviewNote: string | null
  createdAt: string
  updatedAt: string
}

export type CsplMonthlyPackDbRow = {
  id: string
  sector: string
  period: string
  status: string
  min_questions: number
  law_target: number
  skill_target: number
  notes: string | null
  created_by_email: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export type CsplPackQuestionDbRow = {
  id: string
  pack_id: string
  sector: string
  period: string
  status: string
  stem_type: string
  section: string
  prompt: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  answer: number
  explanation: string
  sources: unknown
  multi_source_ok: boolean
  review_note: string | null
  created_at: string
  updated_at: string
}

export const CSPL_PACK_SELECT =
  'id, sector, period, status, min_questions, law_target, skill_target, notes, created_by_email, published_at, created_at, updated_at'

export const CSPL_PACK_QUESTION_SELECT =
  'id, pack_id, sector, period, status, stem_type, section, prompt, option_a, option_b, option_c, option_d, answer, explanation, sources, multi_source_ok, review_note, created_at, updated_at'

export const CSPL_PACK_STATUS_LABEL: Record<CsplPackStatus, string> = {
  draft: 'Nháp',
  review: 'Đang duyệt',
  approved: 'Đủ duyệt',
  published: 'Đã publish',
  locked: 'Khóa thi thử',
}

export const CSPL_PACK_Q_STATUS_LABEL: Record<CsplPackQuestionStatus, string> = {
  draft: 'Nháp',
  approved: 'Đã duyệt',
  rejected: 'Loại',
}

/** Pilot Đo đạc: 40 câu đề = 16 PL + 24 KN */
export const CSPL_PACK_DO_DAC_DEFAULTS = {
  minQuestions: 40,
  lawTarget: 16,
  skillTarget: 24,
} as const

export function mapCsplPackRow(row: CsplMonthlyPackDbRow): CsplMonthlyPack {
  const status = (
    ['draft', 'review', 'approved', 'published', 'locked'] as const
  ).includes(row.status as CsplPackStatus)
    ? (row.status as CsplPackStatus)
    : 'draft'
  return {
    id: row.id,
    sector: row.sector as CsplSector,
    period: row.period,
    status,
    minQuestions: row.min_questions,
    lawTarget: row.law_target,
    skillTarget: row.skill_target,
    notes: row.notes,
    createdByEmail: row.created_by_email,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function parsePackSources(raw: unknown): CsplPackSource[] {
  if (!Array.isArray(raw)) return []
  const out: CsplPackSource[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const chunkId = String(o.chunkId || o.chunk_id || '').trim()
    const soHieu = String(o.soHieu || o.so_hieu || '').trim()
    const citeLabel = String(o.citeLabel || o.cite_label || '').trim()
    if (!chunkId || !soHieu || !citeLabel) continue
    out.push({
      chunkId,
      soHieu,
      citeLabel,
      multiSourceSuggested: Boolean(o.multiSourceSuggested),
    })
  }
  return out
}

export function mapCsplPackQuestionRow(
  row: CsplPackQuestionDbRow,
): CsplPackQuestion {
  const status =
    row.status === 'approved' || row.status === 'rejected'
      ? row.status
      : 'draft'
  const answer = ([0, 1, 2, 3] as const).includes(row.answer as 0 | 1 | 2 | 3)
    ? (row.answer as 0 | 1 | 2 | 3)
    : 0
  const section: CsplPackSection =
    row.section === 'kinh-nghiem' ? 'kinh-nghiem' : 'phap-luat'
  return {
    id: row.id,
    packId: row.pack_id,
    sector: row.sector as CsplSector,
    period: row.period,
    status,
    stemType: row.stem_type || 'định-nghĩa',
    section,
    prompt: row.prompt,
    options: [row.option_a, row.option_b, row.option_c, row.option_d],
    answer,
    explanation: row.explanation,
    sources: parsePackSources(row.sources),
    multiSourceOk: Boolean(row.multi_source_ok),
    reviewNote: row.review_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** YYYY-MM theo GMT+7 — mặc định tháng tiếp theo (chu kỳ publish 01). */
export function defaultPackPeriod(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(now)
  const y = Number(parts.find((p) => p.type === 'year')?.value)
  const m = Number(parts.find((p) => p.type === 'month')?.value)
  let ny = y
  let nm = m + 1
  if (nm > 12) {
    nm = 1
    ny += 1
  }
  return `${ny}-${String(nm).padStart(2, '0')}`
}

export function isValidPeriod(period: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(period)
}

const EXPL_MARKERS = [
  'Đáp án chính xác cho câu hỏi này là:',
  'Căn cứ:',
  'Phân tích:',
  'Đối chiếu với các phương án còn lại:',
] as const

export function explanationHasFourParts(text: string): boolean {
  const t = String(text || '')
  return EXPL_MARKERS.every((m) => t.includes(m))
}

export type GenerateChunkInput = {
  id: string
  soHieu: string
  citeLabel: string
  body: string
  docType?: string
}

export function buildPackGeneratePrompt(input: {
  period: string
  count: number
  lawNeed: number
  skillNeed: number
  chunks: GenerateChunkInput[]
  avoidPrompts: string[]
}): string {
  const chunkBlock = input.chunks
    .map(
      (c, i) =>
        `### CHUNK ${i + 1}
chunk_id: ${c.id}
so_hieu: ${c.soHieu}
cite: ${c.citeLabel}
body:
${c.body.slice(0, 3500)}`,
    )
    .join('\n\n')

  const avoid =
    input.avoidPrompts.length > 0
      ? input.avoidPrompts
          .slice(0, 40)
          .map((p, i) => `${i + 1}. ${p.slice(0, 180)}`)
          .join('\n')
      : '(chưa có)'

  return `
Bạn soạn câu hỏi trắc nghiệm ôn thi CCHN Đo đạc và Bản đồ (pack tháng ${input.period}).
CHỈ dùng nội dung các CHUNK bên dưới. CẤM bịa điều khoản / số liệu không có trong chunk.

Sinh đúng ${input.count} câu. Ưu tiên khoảng ${input.lawNeed} câu pháp luật (Luật/NĐ chung) và ${input.skillNeed} câu chuyên môn (TT/TCVN/QCVN/NĐ kỹ thuật) nếu chunk cho phép.
Mỗi câu MẶC ĐỊNH đơn nguồn (một chunk). Chỉ khi thật cần mới đề xuất đa nguồn (multi_source_suggested=true) — Admin sẽ tick sau.

Template giải thích BẮT BUỘC đúng 4 mục (đúng thứ tự, giữ nguyên tiêu đề):
1) Đáp án chính xác cho câu hỏi này là:
2) Căn cứ:
3) Phân tích:
4) Đối chiếu với các phương án còn lại:

stem_type một trong: định-nghĩa | phạm-vi | trừ-ngoại | so-sánh | tình-huống | phương-án-sai | thẩm-quyền | trình-tự | định-lượng
section: phap-luat | kinh-nghiem
answer: 0|1|2|3 tương ứng A|B|C|D
Đáp án phải kiểm chứng được trên chunk. Cấm câu mơ hồ / nhiều phương án đều đúng.
Với định-lượng: số/đơn vị phải có trong chunk; distractor cùng đơn vị.

Tránh trùng ý với các prompt đã có:
${avoid}

TRẢ VỀ DUY NHẤT JSON:
{
  "questions": [
    {
      "stem_type": "định-nghĩa",
      "section": "phap-luat",
      "prompt": "…",
      "options": ["A…", "B…", "C…", "D…"],
      "answer": 0,
      "explanation": "Đáp án chính xác…\\n\\nCăn cứ:\\n…\\n\\nPhân tích:\\n…\\n\\nĐối chiếu với các phương án còn lại:\\n…",
      "sources": [
        { "chunk_id": "uuid", "so_hieu": "…", "cite_label": "Điều …", "multi_source_suggested": false }
      ]
    }
  ]
}

CHUNK NGUỒN:
${chunkBlock}
`.trim()
}

export type ParsedAiPackQuestion = {
  stemType: string
  section: CsplPackSection
  prompt: string
  options: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  explanation: string
  sources: CsplPackSource[]
}

export function parseAiPackQuestionsJson(
  raw: unknown,
  chunkById: Map<string, GenerateChunkInput>,
): { questions: ParsedAiPackQuestion[]; errors: string[] } {
  const errors: string[] = []
  const root =
    raw && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : null
  const list = Array.isArray(root?.questions) ? root!.questions : []
  const questions: ParsedAiPackQuestion[] = []

  for (const item of list) {
    if (!item || typeof item !== 'object') {
      errors.push('Phần tử questions không hợp lệ.')
      continue
    }
    const o = item as Record<string, unknown>
    const prompt = String(o.prompt || '').trim()
    const optsRaw = Array.isArray(o.options) ? o.options.map(String) : []
    if (!prompt || optsRaw.length !== 4 || optsRaw.some((x) => !x.trim())) {
      errors.push('Thiếu prompt hoặc options A–D.')
      continue
    }
    const answerNum = Number(o.answer)
    if (![0, 1, 2, 3].includes(answerNum)) {
      errors.push(`Đáp án không hợp lệ cho: ${prompt.slice(0, 60)}`)
      continue
    }
    const explanation = String(o.explanation || '').trim()
    if (!explanationHasFourParts(explanation)) {
      errors.push(`Thiếu 4 mục giải thích: ${prompt.slice(0, 60)}`)
      continue
    }
    const section: CsplPackSection =
      String(o.section || '') === 'kinh-nghiem' ? 'kinh-nghiem' : 'phap-luat'
    const stemType = String(o.stem_type || o.stemType || 'định-nghĩa').trim()

    const srcRaw = Array.isArray(o.sources) ? o.sources : []
    const sources: CsplPackSource[] = []
    for (const s of srcRaw) {
      if (!s || typeof s !== 'object') continue
      const so = s as Record<string, unknown>
      const chunkId = String(so.chunk_id || so.chunkId || '').trim()
      const chunk = chunkById.get(chunkId)
      if (!chunk) continue
      sources.push({
        chunkId,
        soHieu: chunk.soHieu,
        citeLabel: chunk.citeLabel,
        multiSourceSuggested: Boolean(
          so.multi_source_suggested || so.multiSourceSuggested,
        ),
      })
    }
    if (sources.length === 0) {
      errors.push(`Không resolve được chunk cite: ${prompt.slice(0, 60)}`)
      continue
    }

    questions.push({
      stemType,
      section,
      prompt,
      options: [
        optsRaw[0].trim(),
        optsRaw[1].trim(),
        optsRaw[2].trim(),
        optsRaw[3].trim(),
      ],
      answer: answerNum as 0 | 1 | 2 | 3,
      explanation,
      sources,
    })
  }

  return { questions, errors }
}

export function pickRandom<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return [...arr]
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}
