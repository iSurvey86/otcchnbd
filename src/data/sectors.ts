import type { SectorId } from '../types'

export interface Sector {
  id: SectorId
  title: string
  blurb: string
  open: boolean
}

export const SECTORS: Sector[] = [
  {
    id: 'do-dac-ban-do',
    title: 'Đo đạc và Bản đồ',
    blurb: 'Ôn thi Chứng chỉ hành nghề Đo đạc và Bản đồ — ngân hàng câu hỏi biên soạn theo Quyết định 308/QĐ-ĐĐBĐVN ngày 29/12/2020.',
    open: true,
  },
  {
    id: 'xay-dung',
    title: 'Xây dựng',
    blurb: 'Chứng chỉ hành nghề xây dựng. Ngân hàng câu hỏi đang biên soạn.',
    open: false,
  },
]
