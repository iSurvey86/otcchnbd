export type DdBankKind = 'official' | 'onthicchn'

export type DdBankStatus = 'recommended' | 'superseded' | 'active'

export type DdExamKind = 'standard-do-dac' | 'whole-pool'

export interface DdBankMeta {
  id: string
  kind: DdBankKind
  status: DdBankStatus
  /** Card title, e.g. Ngân hàng câu hỏi công bố năm 2020 */
  title: string
  /** Certificate / export */
  fullTitle: string
  legalRef?: string
  periodLabel: string
  blurb?: string
  supersededNote?: string
  /** ISO date — ONTHICCHN publish / last update */
  publishedAt?: string
  legalRefs?: string[]
  ready: boolean
  examKind: DdExamKind
  examMinutes?: number
  /** Static hint before load; runtime count overrides when loaded */
  questionCountHint?: number
}

export const DD_DEFAULT_BANK_ID = 'official-2020'

export const ONTHICCHN_SOURCE_URL = 'https://onthicchn.org'

export const DD_BANKS: DdBankMeta[] = [
  {
    id: 'official-2020',
    kind: 'official',
    status: 'recommended',
    title: 'Ngân hàng câu hỏi công bố năm 2020',
    fullTitle: 'Ngân hàng câu hỏi công bố năm 2020 · Chính thức · Đo đạc và Bản đồ',
    legalRef:
      'Quyết định 308/QĐ-ĐĐBĐVN ngày 29/12/2020 của Cục Đo đạc, Bản đồ và Thông tin địa lý Việt Nam',
    periodLabel: '2020',
    ready: true,
    examKind: 'standard-do-dac',
    questionCountHint: 393,
  },
  {
    id: 'official-2019',
    kind: 'official',
    status: 'superseded',
    title: 'Ngân hàng câu hỏi công bố năm 2019',
    fullTitle: 'Ngân hàng câu hỏi công bố năm 2019 · Chính thức · Đo đạc và Bản đồ',
    legalRef: 'Quyết định 2317/QĐ-BTNMT ngày 06/9/2019 của Bộ Tài nguyên và Môi trường',
    periodLabel: '2019',
    ready: true,
    examKind: 'standard-do-dac',
    questionCountHint: 244,
  },
  {
    id: 'onthicchn-2026-07',
    kind: 'onthicchn',
    status: 'active',
    title: 'Bộ câu hỏi cập nhật tháng 07/2026',
    fullTitle: 'Bộ câu hỏi cập nhật tháng 07/2026 · Đo đạc và Bản đồ',
    periodLabel: '07/2026',
    publishedAt: '2026-07-19T00:00:00.000Z',
    legalRefs: ['TT …/2026', 'NĐ …/2026'],
    ready: true,
    examKind: 'whole-pool',
    examMinutes: 45,
    questionCountHint: 12,
  },
  {
    id: 'onthicchn-2026-06',
    kind: 'onthicchn',
    status: 'active',
    title: 'Bộ câu hỏi cập nhật tháng 06/2026',
    fullTitle: 'Bộ câu hỏi cập nhật tháng 06/2026 · Đo đạc và Bản đồ',
    periodLabel: '06/2026',
    publishedAt: '2026-06-28T00:00:00.000Z',
    ready: true,
    examKind: 'whole-pool',
    examMinutes: 45,
    questionCountHint: 10,
  },
]

const bankById = new Map(DD_BANKS.map((b) => [b.id, b]))

export function getDdBank(id: string | undefined): DdBankMeta | undefined {
  if (!id) return undefined
  return bankById.get(id)
}

export function resolveDdBankId(bankId: string | undefined): string {
  return bankId && bankById.has(bankId) ? bankId : DD_DEFAULT_BANK_ID
}

export function recommendedDdBank(): DdBankMeta {
  return DD_BANKS.find((b) => b.status === 'recommended') ?? DD_BANKS[0]
}

export function officialDdBanks(): DdBankMeta[] {
  const rec = recommendedDdBank().id
  return DD_BANKS.filter((b) => b.kind === 'official' && b.id !== rec)
}

export function onthicchnDdBanks(): DdBankMeta[] {
  return DD_BANKS.filter((b) => b.kind === 'onthicchn').sort((a, b) => {
    const ta = a.publishedAt ?? ''
    const tb = b.publishedAt ?? ''
    return tb.localeCompare(ta)
  })
}

export function latestOnthicchnBank(): DdBankMeta | undefined {
  return onthicchnDdBanks()[0]
}

const NEW_BADGE_DAYS = 30

export function isDdBankNew(bank: DdBankMeta): boolean {
  const latest = latestOnthicchnBank()
  if (!latest || bank.id !== latest.id || bank.kind !== 'onthicchn') return false
  if (!bank.publishedAt) return false
  const ageMs = Date.now() - new Date(bank.publishedAt).getTime()
  return ageMs >= 0 && ageMs <= NEW_BADGE_DAYS * 24 * 60 * 60 * 1000
}

export function ddOpenQuestionTotal(): number {
  return DD_BANKS.filter((b) => b.ready).reduce(
    (sum, b) => sum + (b.questionCountHint ?? 0),
    0,
  )
}

export function bankTitleForMeta(bank: DdBankMeta): string {
  return bank.title
}

export function bankKindLabel(bank: DdBankMeta): string {
  return bank.kind === 'official' ? 'Chính thức' : 'ONTHICCHN'
}

/** Bộ đề khác cùng lĩnh vực Đo đạc — liên kết nội bộ. */
export function relatedDdBanks(bankId: string | undefined, limit = 3): DdBankMeta[] {
  const current = resolveDdBankId(bankId)
  return DD_BANKS.filter((b) => b.ready && b.id !== current).slice(0, limit)
}
