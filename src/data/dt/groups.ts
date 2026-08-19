import type { Topic, TopicId } from '../../types'

export type DtDocGroup =
  | 'dt-luat'
  | 'dt-nd214'
  | 'dt-tt79'
  | 'dt-hon-hop'
  | 'dt-khac'

export const DT_DOC_GROUPS: Topic[] = [
  {
    id: 'dt-luat',
    section: 'kinh-nghiem',
    title: 'Luật Đấu thầu',
    blurb: 'Câu dẫn VBHN Luật Đấu thầu — đối tượng, khái niệm, nguyên tắc, trình tự.',
  },
  {
    id: 'dt-nd214',
    section: 'kinh-nghiem',
    title: 'Nghị định 214/2025',
    blurb: 'Hướng dẫn chi tiết Luật: hạn mức, đánh giá, bảo đảm cạnh tranh, tình huống.',
  },
  {
    id: 'dt-tt79',
    section: 'kinh-nghiem',
    title: 'Thông tư 79/2025',
    blurb: 'Mẫu E-HSMT, E-HSDT và quy định lập hồ sơ trên mạng.',
  },
  {
    id: 'dt-hon-hop',
    section: 'kinh-nghiem',
    title: 'Nhiều văn bản',
    blurb: 'Câu dẫn đồng thời Luật và Nghị định / Thông tư.',
  },
  {
    id: 'dt-khac',
    section: 'kinh-nghiem',
    title: 'Khác',
    blurb: 'Mẫu tờ trình và nguồn chưa gom vào một văn bản.',
  },
]

export function isDtDocGroup(id: string | undefined): id is DtDocGroup {
  return (
    id === 'dt-luat' ||
    id === 'dt-nd214' ||
    id === 'dt-tt79' ||
    id === 'dt-hon-hop' ||
    id === 'dt-khac'
  )
}

export function dtRandCount(topicId: TopicId | undefined): number | null {
  if (!topicId?.startsWith('dt-rand-')) return null
  const n = Number(topicId.slice('dt-rand-'.length))
  return n === 10 || n === 20 || n === 30 ? n : null
}

export interface DtOnthicchnSet {
  id: string
  periodLabel: string
  blurb: string
  ready: boolean
  questionCountHint?: number
}

export const DT_ONTHICCHN_SETS: DtOnthicchnSet[] = [
  {
    id: 'onthicchn-2026-07',
    periodLabel: '07/2026',
    blurb: 'Bộ câu hỏi cập nhật từ ONTHICCHN — đang bổ sung vào ngân hàng.',
    ready: false,
  },
  {
    id: 'onthicchn-2026-06',
    periodLabel: '06/2026',
    blurb: 'Bộ câu hỏi cập nhật từ ONTHICCHN — đang bổ sung vào ngân hàng.',
    ready: false,
  },
]

export function dtDocGroupOf(source: string): DtDocGroup {
  const hasLuat = /Luật Đấu thầu|VBHN Luật/i.test(source)
  const hasNd = /214\/2025/.test(source)
  const hasTt = /79\/2025/.test(source)
  const n = Number(hasLuat) + Number(hasNd) + Number(hasTt)
  if (n >= 2) return 'dt-hon-hop'
  if (hasLuat) return 'dt-luat'
  if (hasNd) return 'dt-nd214'
  if (hasTt) return 'dt-tt79'
  return 'dt-khac'
}
